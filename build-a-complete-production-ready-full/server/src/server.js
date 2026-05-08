import "dotenv/config";
import http from "http";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./services/socketService.js";

const port = process.env.PORT || 5000;
const clientUrls = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim());
const isMain = process.argv[1] === fileURLToPath(import.meta.url);

const startServer = async () => {
  const server = http.createServer(app);

  if (process.env.ENABLE_SOCKET_IO === "true") {
    const io = new Server(server, {
      cors: {
        origin: clientUrls,
        credentials: true
      }
    });
    initSocket(io);
    console.log("Socket.IO enabled");
  }

  server.listen(port, () => console.log(`API running on port ${port}`));
};

await connectDB();

if (isMain) {
  await startServer();
}

export default app;

