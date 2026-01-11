import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from './Snackbar';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // This loading state is NOW RESTRICTED only for the initial session check
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  axios.defaults.withCredentials = true;

  // 1. Check for existing session on Mount (Keep this logic)
  useEffect(() => {
    const checkAuth = async () => {
      setUserError(null);
      setUserLoading(true);
      try {
        const { data } = await axios.get('/api/user/profile');
        setUser(data);
      } catch (err) {
        if (err.response && (err.response.status == 401 || err.response.status == 403)) {
          setUser(null);
        } else {
          setUserError(err);
        }
      } finally {
        setUserLoading(false);
      }
    };

    checkAuth();
  }, []);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     setUserLoading(true);
  //     try {
  //       const { data } = await axios.get('/api/user/profile');
  //       setUser(data);
  //     } catch (err) {
  //       if (err.response && err.response.status !== 401) {
  //         console.error("Session check failed", err);
  //       }
  //       setUser(null);
  //     } finally {
  //       setUserLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, []);

  const errorHandling = (err) => {
    if (err.response && err.response.status >= 500) {
      // Catch 500, 502, 503, 504, etc.
      setUserError(err);
      return;
    }
    if (err.response && err.status != "404") {
      showSnackbar(err.response.statusText, "info");
    } else {
      setUserError(err);
    }
  }

  // 2. Login Function
  const login = async (email, password) => {
    setUserLoading(true);
    setUserError(null);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      showSnackbar("Logged in Successfully", "success");
      return { success: true };
    } catch (err) {
      console.log(err);
      errorHandling(err);
    } finally {
      setUserLoading(false);
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
    setUserError(null);
    setUserLoading(true);
    try {
      const { data } = await axios.put('/api/user/profile1', updatedUser);
      setUser(data);
      showSnackbar("User profile updated successfully!!", "success");
      return { success: true };
    } catch (err) {
      if (err.response && err.response.status >= 500) {
        // Catch 500, 502, 503, 504, etc.
        setUserError(err);
        return;
      }
      if (err.response && err.status != "404") {
        showSnackbar(err.response.statusText, "info");
      } else {
        setUserError(err);
      }
      return { success: false };
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
        updateProfile,
        setUserError,
        setUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

// Desc
// Here is a breakdown of why this works well with your ErrorPage.jsx setup:

// Server Crashes (5xx): You correctly catch status >= 500 and pass it to setUserError(err). This will render your ErrorPage, telling the user "It's not you, it's us," which is the perfect UX for a server outage.

// Network Errors: The else block catches errors where err.response is missing (like offline issues). Passing this to setUserError(err) triggers the ErrorPage with the "Connection Error" state defined in your getErrorDetails function.

// User Errors (4xx): You filter these out (e.g., Wrong Password, User Not Found) and show a Snackbar instead. This keeps the user on the login form so they can try again immediately.

// One small recommendation: For the Snackbar message, err.response.statusText can sometimes be vague (e.g., just "Bad Request"). If your backend sends a specific message (like "Invalid password"), you should try to use that first.