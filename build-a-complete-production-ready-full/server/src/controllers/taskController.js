import Notification from "../models/Notification.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { logActivity } from "../services/activityService.js";
import { sendMail } from "../services/emailService.js";
import { emitToProject, emitToUser } from "../services/socketService.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const canAccessTask = async (user, task) => {
  if (user.role === "Admin") return true;
  const project = await Project.findOne({ _id: task.project, teamMembers: user._id });
  return task.assignedTo?.toString() === user._id.toString() || Boolean(project);
};

const recalculateProgress = async (projectId) => {
  const [total, completed] = await Promise.all([
    Task.countDocuments({ project: projectId }),
    Task.countDocuments({ project: projectId, status: "Completed" })
  ]);
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  await Project.findByIdAndUpdate(projectId, { progress });
  return progress;
};

export const getTasks = asyncHandler(async (req, res) => {
  const {
    status,
    priority,
    project,
    assignedTo,
    search,
    sort = "dueDate",
    page = 1,
    limit = 20
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (project) filter.project = project;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (search) filter.$text = { $search: search };

  if (req.user.role !== "Admin") {
    filter.assignedTo = req.user._id;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate("assignedTo", "name email avatar title")
      .populate("createdBy", "name email avatar")
      .populate("project", "name color deadline")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Task.countDocuments(filter)
  ]);

  res.json({
    data: tasks,
    pagination: {
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    }
  });
});

export const createTask = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.body.project);
  if (!project) throw new ApiError("Project not found", 404);
  if (!project.teamMembers.map(String).includes(req.body.assignedTo)) {
    throw new ApiError("Assigned user must be a project team member", 400);
  }

  const task = await Task.create({ ...req.body, createdBy: req.user._id });
  await recalculateProgress(task.project);

  const populated = await task.populate([
    { path: "assignedTo", select: "name email avatar title" },
    { path: "createdBy", select: "name email avatar" },
    { path: "project", select: "name color deadline" }
  ]);

  const activity = await logActivity({
    actor: req.user._id,
    action: "created task",
    entityType: "Task",
    entityId: task._id,
    project: task.project
  });

  const notification = await Notification.create({
    recipient: task.assignedTo,
    title: "New task assigned",
    message: `${req.user.name} assigned you "${task.title}"`,
    type: "task",
    link: `/tasks?task=${task._id}`
  });

  const assignee = await User.findById(task.assignedTo);
  await sendMail({
    to: assignee.email,
    subject: `New task: ${task.title}`,
    html: `<p>You have been assigned <strong>${task.title}</strong>.</p>`
  });

  emitToProject(task.project.toString(), "task:created", { task: populated, activity });
  emitToUser(task.assignedTo.toString(), "notification:new", notification);
  res.status(201).json(populated);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError("Task not found", 404);
  if (!(await canAccessTask(req.user, task))) throw new ApiError("Forbidden", 403);

  if (req.user.role !== "Admin") {
    const disallowed = ["title", "description", "priority", "dueDate", "assignedTo", "project"];
    const tried = disallowed.some((field) => Object.prototype.hasOwnProperty.call(req.body, field));
    if (tried) throw new ApiError("Members can only update assigned task status", 403);
  }

  const previousProject = task.project;
  Object.assign(task, req.body);
  if (req.body.status === "Completed" && task.status === "Completed") task.completedAt = new Date();
  if (req.body.status && req.body.status !== "Completed") task.completedAt = undefined;
  await task.save();

  await Promise.all([
    recalculateProgress(previousProject),
    previousProject.toString() !== task.project.toString() ? recalculateProgress(task.project) : null
  ]);

  const populated = await task.populate([
    { path: "assignedTo", select: "name email avatar title" },
    { path: "createdBy", select: "name email avatar" },
    { path: "project", select: "name color deadline" }
  ]);

  const activity = await logActivity({
    actor: req.user._id,
    action: "updated task",
    entityType: "Task",
    entityId: task._id,
    project: task.project
  });

  emitToProject(task.project.toString(), "task:updated", { task: populated, activity });
  res.json(populated);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError("Task not found", 404);

  await task.deleteOne();
  await recalculateProgress(task.project);
  const activity = await logActivity({
    actor: req.user._id,
    action: "deleted task",
    entityType: "Task",
    entityId: task._id,
    project: task.project
  });

  emitToProject(task.project.toString(), "task:deleted", { id: req.params.id, activity });
  res.json({ message: "Task deleted" });
});

export const uploadAttachment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError("Task not found", 404);
  if (!(await canAccessTask(req.user, task))) throw new ApiError("Forbidden", 403);

  task.attachments.push({
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: `/uploads/${req.file.filename}`,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedBy: req.user._id
  });
  await task.save();

  emitToProject(task.project.toString(), "task:attachment", { taskId: task._id });
  res.status(201).json(task.attachments.at(-1));
});

