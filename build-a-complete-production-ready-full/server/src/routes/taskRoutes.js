import express from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  uploadAttachment
} from "../controllers/taskController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import { schemas, validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getTasks).post(authorize("Admin"), validate(schemas.task), createTask);
router
  .route("/:id")
  .put(validate(schemas.taskUpdate), updateTask)
  .delete(authorize("Admin"), deleteTask);
router.post("/:id/attachments", upload.single("file"), uploadAttachment);

export default router;

