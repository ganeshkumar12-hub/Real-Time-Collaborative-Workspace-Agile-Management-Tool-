let io;

const onlineUsers = new Map();

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

    // ============================
    // Join Board
    // ============================
    socket.on("joinBoard", ({ boardId, user }) => {
      if (!boardId || !user) return;

      socket.join(boardId);

      onlineUsers.set(socket.id, {
        boardId,
        user,
      });

      console.log(`${user.name} joined board ${boardId}`);

      const users = [...onlineUsers.values()]
        .filter((u) => u.boardId === boardId)
        .map((u) => u.user);

      io.to(boardId).emit("onlineUsers", users);
    });

    // ============================
    // Leave Board
    // ============================
    socket.on("leaveBoard", (boardId) => {
      socket.leave(boardId);

      onlineUsers.delete(socket.id);

      const users = [
  ...new Map(
    [...onlineUsers.values()]
      .filter((u) => u.boardId === boardId)
      .map((u) => [u.user.id, u.user])
  ).values(),
];

      io.to(boardId).emit("onlineUsers", users);

      console.log(`${socket.id} left board ${boardId}`);
    });

    // ============================
    // Typing Indicator
    // ============================
    socket.on("typing", ({ boardId, cardId, user }) => {
      socket.to(boardId).emit("typing", {
        cardId,
        user,
      });
    });

    socket.on("stopTyping", ({ boardId, cardId }) => {
      socket.to(boardId).emit("stopTyping", {
        cardId,
      });
    });

    // ============================
    // Disconnect
    // ============================
    socket.on("disconnect", () => {
      const disconnectedUser = onlineUsers.get(socket.id);

      if (disconnectedUser) {
        onlineUsers.delete(socket.id);

        const users = [...onlineUsers.values()]
          .filter(
            (u) =>
              u.boardId === disconnectedUser.boardId
          )
          .map((u) => u.user);

        io.to(disconnectedUser.boardId).emit(
          "onlineUsers",
          users
        );
      }

      console.log(
        "User Disconnected:",
        socket.id
      );
    });
  });
};

const getIO = () => io;

module.exports = {
  initializeSocket,
  getIO,
};