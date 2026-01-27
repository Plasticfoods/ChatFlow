import { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useUser } from './User';

const SocketContext = createContext();

// Define your backend URL (or use environment variable)
const ENDPOINT = "https://chatflow-67xw.onrender.com";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  
  const { user } = useUser();

  useEffect(() => {
    // 1. If user is logged in, connect socket
    if (user) {
      const newSocket = io(ENDPOINT, {
        withCredentials: true,
        extraHeaders: {
          "my-custom-header": "chatflow",
        },
      });
      
      // 2. Identification: Tell backend who this socket belongs to
      newSocket.emit("setup", user);
      
      newSocket.on("user_connected", () => setSocketConnected(true));
      newSocket.on("disconnect", () => setSocketConnected(false));

      setSocket(newSocket);

      // Cleanup on logout or unmount
      return () => {
        newSocket.disconnect();
      };
    } else {
      // 3. If user logs out, kill the connection to save resources
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setSocketConnected(false);
      }
    }
    // eslint-disable-next-line
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, socketConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);