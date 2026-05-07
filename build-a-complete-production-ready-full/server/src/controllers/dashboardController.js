import Activity from "../models/Activity.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const projectFilter = req.user.role === "Admin" ? {} : { teamMembers: req.user._id };
  const taskFilter = req.user.role === "Admin" ? {} : { assignedTo: req.user._id };
  const now = new Date();

  const [
    totalProjects,
    completedTasks,
    pendingTasks,
    overdueTasks,
    statusBuckets,
    recentActivity,
    memberPerformance
  ] = await Promise.all([
    Project.countDocuments(projectFilter),
    Task.countDocuments({ ...taskFilter, status: "Completed" }),
    Task.countDocuments({ ...taskFilter, status: { $ne: "Completed" } }),
    Task.countDocuments({ ...taskFilter, status: { $ne: "Completed" }, dueDate: { $lt: now } }),
    Task.aggregate([
      { $match: taskFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]),
    Activity.find(req.user.role === "Admin" ? {} : { project: { $in: req.user.projects } })
      .populate("actor", "name email avatar")
      .sort("-createdAt")
      .limit(12),
    User.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "assignedTo",
          as: "tasks"
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          completed: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond: { $eq: ["$$task.status", "Completed"] }
              }
            }
          },
          total: { $size: "$tasks" }
        }
      },
      { $sort: { completed: -1 } },
      { $limit: 8 }
    ])
  ]);

  res.json({
    totalProjects,
    completedTasks,
    pendingTasks,
    overdueTasks,
    chart: ["Todo", "In Progress", "Completed"].map((name) => ({
      name,
      value: statusBuckets.find((bucket) => bucket._id === name)?.count || 0
    })),
    recentActivity,
    memberPerformance
  });
});

