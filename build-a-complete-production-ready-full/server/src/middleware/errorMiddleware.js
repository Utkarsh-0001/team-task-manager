import { ApiError } from "../utils/apiError.js";

export const notFound = (req, _res, next) => {
  next(new ApiError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;

  if (err.name === "CastError") {
    err.message = "Resource not found";
    err.statusCode = 404;
  }

  if (err.code === 11000) {
    err.message = "Duplicate field value";
    err.statusCode = 409;
  }

  if (err.name === "ValidationError") {
    err.message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
    err.statusCode = 400;
  }

  res.status(err.statusCode || statusCode).json({
    message: err.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};

