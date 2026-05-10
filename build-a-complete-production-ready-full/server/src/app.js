import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { getAllowedOrigins } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("trust proxy", 1);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());

const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    optionsSuccessStatus: 200,
    credentials: true
  })
);

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 350,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.use("/uploads", express.static(path.join(__dirname, "../..", "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
