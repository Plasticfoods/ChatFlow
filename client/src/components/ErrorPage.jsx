import { useMemo } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import {
  AlertTriangle,
  Home,
  RefreshCcw,
  WifiOff,
  ServerCrash,
  Lock,
  Timer,
  FileQuestion // Added for Unknown errors
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/User';

/**
 * Helper to parse Axios errors into UI-friendly formats
 */
const getErrorDetails = (error) => {
  // Default State (Unknown / Client-side JS Error)
  let details = {
    code: 'Unknown',
    title: 'Something Went Wrong',
    message: error?.message || 'An unknown error occurred. It might be a client-side issue.',
    Icon: FileQuestion
  };

  if (!error) return details;

  // 1. Axios Response Error (Server responded with 4xx or 5xx)
  if (error.response) {
    const status = error.response.status;
    details.code = status;

    switch (status) {
      case 500:
      case 502:
      case 504:
        details.title = 'Server Error';
        details.message = "Our servers are acting up. It's not you, it's us. Please try again later.";
        details.Icon = ServerCrash;
        break;
      case 404:
        details.title = 'Page Not Found';
        details.message = "The page you're looking for doesn't exist or has been moved.";
        details.Icon = AlertTriangle;
        break;
      case 401:
      case 403:
        details.title = 'Access Denied';
        details.message = "You don't have permission to view this page.";
        details.Icon = Lock;
        break;
      case 429:
        details.title = 'Too Many Requests';
        details.message = "You're sending requests too fast. Please slow down and try again in a moment.";
        details.Icon = Timer;
        break;
      case 503:
        details.title = 'Service Unavailable';
        details.message = "The service is currently unavailable. Please check back later.";
        details.Icon = ServerCrash;
        break;
      default:
        details.title = error.response.statusText || 'Server Error';
        details.message = error.response.data?.message || 'The server returned an unexpected response.';
        details.Icon = AlertTriangle;
    }
  }
  // 2. Network Error (No response received)
  else if (error.request) {
    if (navigator.onLine) {
      // Browser has internet, but server didn't respond
      details.code = 'Unreachable';
      details.title = 'No Response from Server';
      details.message = 'The server is unreachable right now. Please try again later.';
      details.Icon = ServerCrash;
    } else {
      // Browser is actually offline
      details.code = 'Network';
      details.title = 'No Internet Connection';
      details.message = 'You appear to be offline. Please check your internet connection and try again.';
      details.Icon = WifiOff;
    }
  }

  return details;
};

const ErrorPage = ({
  error,          // The raw error object from your API catch block
  onRetry,
  onRetryPath,
  onHome,         // Optional callback when clicking "Go Home"
  // Overrides (optional) - if you want to force a specific message
  code: propCode,
  title: propTitle,
  message: propMessage
}) => {
  const navigate = useNavigate();
  const { setUserError } = useUser();

  // Parse the error object only when it changes
  const { code, title, message, Icon } = useMemo(() => {
    // If explicit props are passed, use them. Otherwise, parse the error object.
    const autoDetails = getErrorDetails(error);
    return {
      code: propCode || autoDetails.code,
      title: propTitle || autoDetails.title,
      message: propMessage || autoDetails.message,
      Icon: autoDetails.Icon
    };
  }, [error, propCode, propTitle, propMessage]);

  const handleHome = () => {
    setUserError(null);
    if (onHome) {
      onHome();
      return;
    }
    navigate("/");
  };

  const handleOnRetry = () => {
    // if (onRetry) {
    //   onRetry();
    //   return;
    // }
    // setUserError(null);
    // if (onRetryPath) {
    //   navigate(onRetryPath);
    // }
    // Check the current path and navigate to it
    const currentPath = window.location.pathname;
    if (currentPath === "/login" || currentPath === "/register") {
      navigate("/");
    } else {
      navigate(currentPath);
    }
  };

  return (
    <Box
      role="alert"
      aria-live="assertive"
      sx={{
        position: 'fixed', // Fix: Break out of parent container
        top: 0,
        left: 0,
        width: '100vw',    // Full viewport width
        height: '100vh',   // Full viewport height
        zIndex: 9999,      // Ensure it sits on top of all other elements
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'var(--bg-main)',
        color: 'var(--text-main)',
        p: 2,
        // Subtle animated gradient background effect
        backgroundImage: 'radial-gradient(circle at 50% 50%, var(--bg-surface) 0%, var(--bg-main) 100%)',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
          p: { xs: 4, md: 6 },
          borderRadius: 'var(--radius-md)',
          bgcolor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
          animation: 'slideUpFade 0.5s ease-out',
          '@keyframes slideUpFade': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}
      >
        {/* Animated Icon Circle */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'var(--secondary)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            animation: 'pulse 3s infinite ease-in-out',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 0 0 rgba(var(--primary-rgb), 0.1)' },
              '70%': { boxShadow: '0 0 0 15px rgba(var(--primary-rgb), 0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(var(--primary-rgb), 0)' }
            }
          }}
        >
          <Icon size={40} strokeWidth={1.5} />
        </Box>

        {/* Error Code */}
        <Typography
          variant="h1"
          sx={{
            fontSize: '4rem',
            fontWeight: 800,
            color: 'var(--primary)',
            lineHeight: 1,
            mb: 1,
            opacity: 0.9
          }}
        >
          {code}
        </Typography>

        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: 'var(--text-main)',
            mb: 2
          }}
        >
          {title}
        </Typography>

        {/* Message */}
        <Typography
          variant="body1"
          sx={{
            color: 'var(--text-dim)',
            mb: 5,
            lineHeight: 1.6,
            maxWidth: '90%'
          }}
        >
          {message}
        </Typography>

        {/* Actions */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%' }}>

          <Button
            fullWidth
            onClick={handleHome}
            startIcon={<Home size={18} />}
            sx={{
              py: 1.2,
              borderRadius: 'var(--radius-md)',
              textTransform: 'none',
              fontWeight: 600,
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              bgcolor: 'transparent',
              '&:hover': {
                bgcolor: 'var(--bg-main)',
                borderColor: 'var(--text-dim)'
              }
            }}
          >
            Go Home
          </Button>

          {(onRetry || onRetryPath) && (
            <Button
              fullWidth
              onClick={handleOnRetry}
              startIcon={<RefreshCcw size={18} />}
              disableElevation
              sx={{
                py: 1.2,
                borderRadius: 'var(--radius-md)',
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: 'var(--primary)',
                color: 'var(--text-inverse)',
                '&:hover': {
                  bgcolor: 'var(--primary-hover)',
                  transform: 'translateY(-1px)'
                },
                transition: 'background-color 0.2s, transform 0.2s'
              }}
            >
              Try Again
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ErrorPage;