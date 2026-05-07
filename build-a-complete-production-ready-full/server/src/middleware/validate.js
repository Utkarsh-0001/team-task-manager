import Joi from "joi";
import { ApiError } from "../utils/apiError.js";

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

export const schemas = {
  signup: Joi.object({
    name: Joi.string().trim().min(2).max(80).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid("Admin", "Member").default("Member"),
    title: Joi.string().allow("").max(120)
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  project: Joi.object({
    name: Joi.string().trim().min(2).max(120).required(),
    description: Joi.string().trim().min(5).max(2000).required(),
    deadline: Joi.date().iso().required(),
    teamMembers: Joi.array().items(objectId).default([]),
    color: Joi.string().allow("").max(24)
  }),
  projectUpdate: Joi.object({
    name: Joi.string().trim().min(2).max(120),
    description: Joi.string().trim().min(5).max(2000),
    deadline: Joi.date().iso(),
    teamMembers: Joi.array().items(objectId),
    color: Joi.string().allow("").max(24)
  }).min(1),
  task: Joi.object({
    title: Joi.string().trim().min(2).max(160).required(),
    description: Joi.string().allow("").max(3000),
    priority: Joi.string().valid("Low", "Medium", "High").default("Medium"),
    status: Joi.string().valid("Todo", "In Progress", "Completed").default("Todo"),
    dueDate: Joi.date().iso().required(),
    assignedTo: objectId.required(),
    project: objectId.required()
  }),
  taskUpdate: Joi.object({
    title: Joi.string().trim().min(2).max(160),
    description: Joi.string().allow("").max(3000),
    priority: Joi.string().valid("Low", "Medium", "High"),
    status: Joi.string().valid("Todo", "In Progress", "Completed"),
    dueDate: Joi.date().iso(),
    assignedTo: objectId,
    project: objectId
  }).min(1)
};

export const validate = (schema) => (req, _res, next) => {
  const { value, error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return next(
      new ApiError(
        error.details.map((detail) => detail.message).join(", "),
        400
      )
    );
  }

  req.body = value;
  next();
};

