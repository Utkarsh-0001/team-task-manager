let ioInstance;

export const initSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    socket.on("join:user", (userId) => {
      if (userId) socket.join(`user:${userId}`);
    });

    socket.on("join:project", (projectId) => {
      if (projectId) socket.join(`project:${projectId}`);
    });

    socket.on("chat:message", (message) => {
      if (message?.project) {
        io.to(`project:${message.project}`).emit("chat:message", {
          ...message,
          createdAt: new Date().toISOString()
        });
      }
    });
  });
};

export const emitToProject = (projectId, event, payload) => {
  if (ioInstance && projectId) ioInstance.to(`project:${projectId}`).emit(event, payload);
};

export const emitToUser = (userId, event, payload) => {
  if (ioInstance && userId) ioInstance.to(`user:${userId}`).emit(event, payload);
};

