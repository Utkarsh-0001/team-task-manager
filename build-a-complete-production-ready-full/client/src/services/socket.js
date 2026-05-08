import { io } from "socket.io-client";

let socket;

export const connectSocket = (userId) => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL || "https://team-task-manager-34f2.onrender.com";

  if (!socket) {
    socket = io(socketUrl, {
      withCredentials: true,
      autoConnect: false
    });
  }

  if (!socket.connected) socket.connect();
  if (userId) socket.emit("join:user", userId);
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

