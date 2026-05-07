import Activity from "../models/Activity.js";

export const logActivity = async ({ actor, action, entityType, entityId, project, metadata }) => {
  const activity = await Activity.create({
    actor,
    action,
    entityType,
    entityId,
    project,
    metadata
  });

  return activity.populate("actor", "name email avatar");
};

