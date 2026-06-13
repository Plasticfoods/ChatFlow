import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./Socket"; // Import your global socket instance

const OnlineUsersContext = createContext();

export const useOnlineUsers = () => useContext(OnlineUsersContext);

export const OnlineUsersProvider = ({ children }) => {
  // We use a Set for O(1) lookup time. 
  // Set contains the IDs of all online users.
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // 1. Listener for status updates
    const handleStatusChange = (activeUsers) => {
      setOnlineUserIds(new Set(activeUsers));
    };

    // 2. Optional: Listener for initial bulk list (if you implement get_online_users API)
    // socket.on("get_online_users", (usersArray) => setOnlineUserIds(new Set(usersArray)));

    socket.on("user_status_change", handleStatusChange);

    return () => {
      socket.off("user_status_change", handleStatusChange);
    };
  }, [socket]);

  // Helper function to check specific user
  const isUserOnline = (userId) => {
    return onlineUserIds.has(userId);
  };

  return (
    <OnlineUsersContext.Provider value={{ isUserOnline, onlineUserIds }}>
      {children}
    </OnlineUsersContext.Provider>
  );
};