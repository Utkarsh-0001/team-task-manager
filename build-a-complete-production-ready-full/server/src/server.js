import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./services/socketService.js";

const port = process.env.PORT || 5000;
const clientUrls = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: clientUrls,
    credentials: true
  }
});

initSocket(io);

const start = async () => {
  try {
    await connectDB();
    server.listen(port, () => console.log(`API running on port ${port}`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection", reason);
  server.close(() => process.exit(1));
});

