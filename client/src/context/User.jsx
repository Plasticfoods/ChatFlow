import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // This loading state is NOW RESTRICTED only for the initial session check
  const [userLoading, setUserLoading] = useState(true); 
  const [userError, setUserError] = useState(null);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  // 1. Check for existing session on Mount (Keep this logic)
  useEffect(() => {
    const checkAuth = async () => {
      setUserLoading(true);
      try {
        const { data }= await axios.get('/api/user/profile');
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
    setUserError(null);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setUserError(message);
      return { success: false, message };
    }
  };

  // 3. Register Function
  // REMOVED: setUserLoading(true/false) - Let your local component handle the UI
  const register = async (name, email, username, password) => {
    setUserError(null);
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, username, password });
      setUser(data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setUserError(message);
      return { success: false, message };
    }
  };

  // 4. Logout Function
  const logout = async () => {
    setUserLoading(true);
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUserLoading(false);
    }
  };

  // 5. Update Profile Function
  const updateProfile = async (updatedUser) => {
    setUserLoading(true);
    setUserError(null);
    try {
      const { data } = await axios.put('/api/user/profile', updatedUser);
      setUser(data);
      return { success: true };
    } catch (err) {
      if(err.response && (err.response.status === 401 || err.response.status === 403)) {
        setUser(null);
        navigate('/login');
        return { success: false, message: err.message };
      }
      const message = err.response?.data?.message || err.message || 'Update failed';
      setUserError(message);
      return { success: false, message };
    } finally {
      setUserLoading(false);
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        user,
        userLoading, // Only true on initial page load
        userError, 
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