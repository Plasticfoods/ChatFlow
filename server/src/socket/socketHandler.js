const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    // 1. SETUP: User logs in
    // The frontend sends the User Data here. We create a generic "room" for this specific user.
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      console.log("User Joined Personal Room:", userData._id);
      socket.emit("user_connected");
    });

    // 2. JOIN CHAT: User clicks on a chat
    // We join a "room" specific to that Chat ID.
    // Room is used to group a set of users chatting together.
    socket.on("join_chat", (channelId) => {
      socket.join(channelId);
      console.log("User Joined Chat Room: " + channelId);
    });

    // 3. SEND MESSAGE: User sends a message
    // We forward this message to everyone else in that chat room.
    socket.on("new_message", (data) => {
      console.log("Entering socket new_message handler");
      console.log(data);

      socket.to(data.channel._id).emit("receive_message", data);
      console.log("Existing socket new_message handler");
    });

    // 4. CLEANUP: User closes browser
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });
};

module.exports = socketHandler;
