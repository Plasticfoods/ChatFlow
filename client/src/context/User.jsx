import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // This loading state is NOW RESTRICTED only for the initial session check
  const [userLoading, setUserLoading] = useState(true); 
  const [error, setError] = useState(null);

  axios.defaults.withCredentials = true;

  // 1. Check for existing session on Mount (Keep this logic)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get('/api/auth/check');
        setUser(data);
      } catch (err) {
        if (err.response && err.response.status !== 401) {
          console.error("Session check failed", err);
        }
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 2. Login Function
  // REMOVED: setUserLoading(true/false) - Let your local component handle the UI
  const login = async (email, password) => {
    setError(null);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  // 3. Register Function
  // REMOVED: setUserLoading(true/false) - Let your local component handle the UI
  const register = async (name, email, username, password) => {
    setError(null);
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, username, password });
      setUser(data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  // 4. Logout Function
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // 5. Update Profile Function
  const updateProfile = async (profileData) => {
    try {
      const { data } = await axios.put('/api/user/profile', profileData);
      setUser(data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Update failed';
      return { success: false, message };
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        userLoading, // Only true on initial page load
        error, 
        login, 
        register, 
        logout, 
        updateProfile 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);