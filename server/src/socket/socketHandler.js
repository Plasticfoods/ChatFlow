const socketHandler = (io) => {
  // Map to track active user connections: Map<UserId, Set<SocketId>>
  const userSocketMap = new Map();

  io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    // 1. SETUP: User logs in
    // The frontend sends the User Data here. We create a generic "room" for this specific user.
    socket.on("setup", (userData) => {
      socket.join(userData._id);

      // --- Online Status Logic ---
      // Store userId on the socket instance for disconnect handling
      socket.userId = userData._id;

      if (!userSocketMap.has(userData._id)) {
        userSocketMap.set(userData._id, new Set());
      }
      userSocketMap.get(userData._id).add(socket.id);

      console.log("User Joined Personal Room:", userData._id);
      socket.emit("user_connected");

      // Broadcast to everyone that this user is online
      const activeUsers = Array.from(userSocketMap.keys());
      io.emit("user_status_change", activeUsers);
      // ---------------------------
    });

    // 2. JOIN CHAT: User clicks on a chat
    // We join a "room" specific to that Chat ID.
    // Room is used to group a set of users chatting together.
    socket.on("join_chat", (channelId) => {
      socket.join(channelId);
      console.log("User Joined Chat Room: " + channelId);
    });

    // socket.on("new_message", (data) => {
    //   console.log("Entering socket new_message handler");
    //   console.log(data);

    //   socket.to(data.channel._id).emit("receive_message", data);
    //   console.log("Existing socket new_message handler");
    // });

    // 3. SEND MESSAGE: User sends a message
    // We forward this message to everyone else in that chat room.
    socket.on("new_message", (data) => {
      console.log("Entering socket new_message handler");
      console.log(
        `${data.newMessage.sender.name} sent a message with content: ${data.newMessage.content}`,
      );
      const { newMessage, channel } = data;
      if (!channel.users) {
        console.log("Channel users not defined");
        return;
      }

      channel.users.forEach((user) => {
        if (user._id.toString() === newMessage.sender._id.toString()) return;
        socket.to(user._id).emit("receive_message", data);
      });
      console.log("Exiting socket new_message handler");
    });

    // 4. CLEANUP: User closes browser or disconnects
    socket.on("disconnect", () => {
      console.log("USER DISCONNECTED");

      const userId = socket.userId;
      if (userId && userSocketMap.has(userId)) {
        const userSockets = userSocketMap.get(userId);
        userSockets.delete(socket.id);

        // If the user has no more active sockets (closed all tabs/devices), mark as offline
        if (userSockets.size === 0) {
          userSocketMap.delete(userId);
          // when a user goes offline, broadcast to all clients the latest active user list
          const activeUsers = Array.from(userSocketMap.keys());
          io.emit("user_status_change", activeUsers);
        }
      }
    });
  });
};

module.exports = socketHandler;
