import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 2000
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"]
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    color: {
      type: String,
      default: "#2563eb"
    }
  },
  { timestamps: true }
);

projectSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "project"
});

projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });

export default mongoose.model("Project", projectSchema);

