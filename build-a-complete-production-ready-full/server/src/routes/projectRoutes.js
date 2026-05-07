import express from "express";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject
} from "../controllers/projectController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { schemas, validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getProjects).post(authorize("Admin"), validate(schemas.project), createProject);
router
  .route("/:id")
  .get(getProject)
  .put(authorize("Admin"), validate(schemas.projectUpdate), updateProject)
  .delete(authorize("Admin"), deleteProject);

export default router;

