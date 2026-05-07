import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.COOKIE_SECURE === "true",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const authResponse = (res, statusCode, user) => {
  const token = generateToken(user._id);
  res.cookie("token", token, cookieOptions);
  res.status(statusCode).json({ user, token });
};

export const signup = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) throw new ApiError("Email is already registered", 409);

  const user = await User.create(req.body);
  authResponse(res, 201, user);
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new ApiError("Invalid email or password", 401);
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });
  authResponse(res, 200, user);
});

export const logout = (_req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("name email role avatar title projects").sort("name");
  res.json(users);
});

