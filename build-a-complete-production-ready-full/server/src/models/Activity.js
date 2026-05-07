import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    entityType: {
      type: String,
      enum: ["Project", "Task", "User", "Message"],
      required: true
    },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    metadata: { type: Map, of: String }
  },
  { timestamps: true }
);

activitySchema.index({ project: 1, createdAt: -1 });

export default mongoose.model("Activity", activitySchema);

