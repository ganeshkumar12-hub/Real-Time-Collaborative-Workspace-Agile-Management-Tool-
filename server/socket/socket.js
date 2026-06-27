let io;

const initializeSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // Join board room
    socket.on("joinBoard", (boardId) => {
      socket.join(boardId);
      console.log(`${socket.id} joined board ${boardId}`);
    });

    // Leave board room
    socket.on("leaveBoard", (boardId) => {
      socket.leave(boardId);
      console.log(`${socket.id} left board ${boardId}`);
    });

    // User is typing
    socket.on("typing", ({ boardId, cardId, user }) => {
      socket.to(boardId).emit("typing", {
        cardId,
        user,
      });
    });

    // User stopped typing
    socket.on("stopTyping", ({ boardId, cardId }) => {
      socket.to(boardId).emit("stopTyping", {
        cardId,
      });
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });
};

const getIO = () => io;

module.exports = {
  initializeSocket,
  getIO,
};