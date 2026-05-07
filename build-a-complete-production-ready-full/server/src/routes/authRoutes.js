import express from "express";
import { listUsers, login, logout, me, signup } from "../controllers/authController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { schemas, validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/signup", validate(schemas.signup), signup);
router.post("/login", validate(schemas.login), login);
router.post("/logout", logout);
router.get("/me", protect, me);
router.get("/users", protect, authorize("Admin"), listUsers);

export default router;

