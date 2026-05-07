import Activity from "../models/Activity.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { logActivity } from "../services/activityService.js";
import { emitToProject } from "../services/socketService.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const projectAccessFilter = (user) =>
  user.role === "Admin" ? {} : { teamMembers: user._id };

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find(projectAccessFilter(req.user))
    .populate("owner", "name email avatar")
    .populate("teamMembers", "name email role avatar title")
    .sort("-updatedAt");

  res.json(projects);
});

export const getProject = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id, ...projectAccessFilter(req.user) };
  const project = await Project.findOne(filter)
    .populate("owner", "name email avatar")
    .populate("teamMembers", "name email role avatar title");

  if (!project) throw new ApiError("Project not found", 404);

  const tasks = await Task.find({ project: project._id })
    .populate("assignedTo", "name email avatar title")
    .populate("createdBy", "name email avatar")
    .sort("dueDate");

  const activity = await Activity.find({ project: project._id })
    .populate("actor", "name email avatar")
    .sort("-createdAt")
    .limit(20);

  res.json({ project, tasks, activity });
});

export const createProject = asyncHandler(async (req, res) => {
  const teamMembers = [...new Set([req.user._id.toString(), ...req.body.teamMembers])];
  const project = await Project.create({
    ...req.body,
    owner: req.user._id,
    teamMembers
  });

  await User.updateMany({ _id: { $in: teamMembers } }, { $addToSet: { projects: project._id } });
  const activity = await logActivity({
    actor: req.user._id,
    action: "created project",
    entityType: "Project",
    entityId: project._id,
    project: project._id
  });

  emitToProject(project._id.toString(), "project:created", { project, activity });
  res.status(201).json(await project.populate("teamMembers", "name email role avatar title"));
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError("Project not found", 404);

  const previousMembers = project.teamMembers.map(String);
  Object.assign(project, req.body);
  if (req.body.teamMembers) {
    project.teamMembers = [...new Set([project.owner.toString(), ...req.body.teamMembers])];
  }
  await project.save();

  const nextMembers = project.teamMembers.map(String);
  const removed = previousMembers.filter((id) => !nextMembers.includes(id));
  await User.updateMany({ _id: { $in: nextMembers } }, { $addToSet: { projects: project._id } });
  await User.updateMany({ _id: { $in: removed } }, { $pull: { projects: project._id } });

  const updated = await project.populate("teamMembers", "name email role avatar title");
  const activity = await logActivity({
    actor: req.user._id,
    action: "updated project",
    entityType: "Project",
    entityId: project._id,
    project: project._id
  });

  emitToProject(project._id.toString(), "project:updated", { project: updated, activity });
  res.json(updated);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError("Project not found", 404);

  await Task.deleteMany({ project: project._id });
  await User.updateMany({ projects: project._id }, { $pull: { projects: project._id } });
  await Activity.deleteMany({ project: project._id });
  await project.deleteOne();

  emitToProject(req.params.id, "project:deleted", { id: req.params.id });
  res.json({ message: "Project deleted" });
});

