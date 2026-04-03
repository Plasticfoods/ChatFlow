const { sendMessage2 } = require("../controllers/messageController");

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
    });

    // 3. SEND MESSAGE: User sends a message
    // We forward this message to everyone else in that chat room.
    socket.on("new_message", async (message, callback) => {
      console.log("Entering socket new_message handler");
      console.log(
        `${message.sender.name} sent a message with content: ${message.content}`,
      );
      // Call the sendMessage2 controller function to handle message creation and channel update
      const result = await sendMessage2(message);
      if (!result) {
        console.error("Failed to process new message");
        // Acknowledge failure back to the sender
        if (callback) callback({ success: false });
        return;
      }

      const { newMessage, updatedChannel } = result;
      updatedChannel.users.forEach((user) => {
        // Skip the sender — they already have the message locally
        if (user._id.toString() === newMessage.sender._id.toString()) return;
        console.log(user._id.toString(), "should receive the message");
        socket.to(user._id.toString()).emit("receive_message", { newMessage, channel: updatedChannel });
      });

      // Acknowledge success back to the sender with the saved message & updated channel
      if (callback) callback({ success: true, newMessage, channel: updatedChannel });
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
