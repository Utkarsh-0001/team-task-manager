import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Activity from "../models/Activity.js";
import Notification from "../models/Notification.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

const seed = async () => {
  await connectDB();
  await Promise.all([
    Activity.deleteMany({}),
    Notification.deleteMany({}),
    Task.deleteMany({}),
    Project.deleteMany({}),
    User.deleteMany({})
  ]);

  const users = await User.create([
    {
      name: "Avery Admin",
      email: "admin@teamtask.dev",
      password: "Password123!",
      role: "Admin",
      title: "Delivery Lead",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Avery"
    },
    {
      name: "Maya Member",
      email: "member@teamtask.dev",
      password: "Password123!",
      role: "Member",
      title: "Frontend Engineer",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Maya"
    },
    {
      name: "Leo Chen",
      email: "leo@teamtask.dev",
      password: "Password123!",
      role: "Member",
      title: "Product Designer",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Leo"
    },
    {
      name: "Nora Patel",
      email: "nora@teamtask.dev",
      password: "Password123!",
      role: "Member",
      title: "QA Analyst",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Nora"
    }
  ]);

  const [admin, maya, leo, nora] = users;
  const projects = await Project.create([
    {
      name: "Atlas Mobile Refresh",
      description: "Upgrade onboarding, dashboards, and collaboration surfaces for the Atlas mobile product.",
      deadline: daysFromNow(21),
      owner: admin._id,
      teamMembers: users.map((user) => user._id),
      color: "#2563eb"
    },
    {
      name: "Revenue Ops Portal",
      description: "Build internal workflows for pipeline reviews, invoice approvals, and account health tracking.",
      deadline: daysFromNow(38),
      owner: admin._id,
      teamMembers: [admin._id, maya._id, nora._id],
      color: "#059669"
    }
  ]);

  await User.updateMany({}, { $set: { projects: projects.map((project) => project._id) } });

  const tasks = await Task.create([
    {
      title: "Design responsive project overview",
      description: "Create a dense overview with mobile-safe cards and status summaries.",
      priority: "High",
      status: "In Progress",
      dueDate: daysFromNow(4),
      assignedTo: leo._id,
      project: projects[0]._id,
      createdBy: admin._id
    },
    {
      title: "Implement auth token refresh handling",
      description: "Harden route guards and Axios interceptors for expired sessions.",
      priority: "High",
      status: "Todo",
      dueDate: daysFromNow(7),
      assignedTo: maya._id,
      project: projects[0]._id,
      createdBy: admin._id
    },
    {
      title: "QA drag and drop board states",
      description: "Verify status transitions, empty columns, and overdue styling.",
      priority: "Medium",
      status: "Todo",
      dueDate: daysFromNow(-1),
      assignedTo: nora._id,
      project: projects[0]._id,
      createdBy: admin._id
    },
    {
      title: "Complete API pagination tests",
      description: "Exercise search, sorting, and project filters with representative data.",
      priority: "Medium",
      status: "Completed",
      dueDate: daysFromNow(-2),
      assignedTo: nora._id,
      project: projects[1]._id,
      createdBy: admin._id,
      completedAt: daysFromNow(-3)
    },
    {
      title: "Build member performance chart",
      description: "Use task throughput and completion metrics on the admin dashboard.",
      priority: "Low",
      status: "Completed",
      dueDate: daysFromNow(5),
      assignedTo: maya._id,
      project: projects[1]._id,
      createdBy: admin._id,
      completedAt: daysFromNow(-1)
    }
  ]);

  for (const project of projects) {
    const projectTasks = tasks.filter((task) => task.project.toString() === project._id.toString());
    const completed = projectTasks.filter((task) => task.status === "Completed").length;
    project.progress = Math.round((completed / projectTasks.length) * 100);
    await project.save();
  }

  await Activity.create([
    {
      actor: admin._id,
      action: "created project",
      entityType: "Project",
      entityId: projects[0]._id,
      project: projects[0]._id
    },
    {
      actor: maya._id,
      action: "completed task",
      entityType: "Task",
      entityId: tasks[4]._id,
      project: projects[1]._id
    },
    {
      actor: nora._id,
      action: "reviewed task",
      entityType: "Task",
      entityId: tasks[2]._id,
      project: projects[0]._id
    }
  ]);

  console.log("Seed complete");
  console.log("Admin: admin@teamtask.dev / Password123!");
  console.log("Member: member@teamtask.dev / Password123!");
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});

