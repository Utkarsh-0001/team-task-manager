import "dotenv/config";
import http from "http";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { getAllowedOrigins, isSocketEnabled } from "./config/env.js";
import { initSocket } from "./services/socketService.js";

const port = process.env.PORT || 5000;
const isMain = process.argv[1] === fileURLToPath(import.meta.url);

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  if (isSocketEnabled()) {
    const io = new Server(server, {
      cors: {
        origin: getAllowedOrigins(),
        credentials: true
      }
    });
    initSocket(io);
    console.log("Socket.IO enabled");
  }

  server.listen(port, () => console.log(`API running on port ${port}`));
};

if (isMain) {
  startServer().catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
}

export default app;
