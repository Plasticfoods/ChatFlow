import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Divider,
  Button,
  IconButton
} from '@mui/material';
import {
  Mail,
  Lock,
  User,
  Chrome,
  MessageCircleCode,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useUser } from '../context/User.jsx';
import Loader from "./Loader.jsx";
import ErrorPage from "./ErrorPage.jsx";
import { useNavigate } from "react-router-dom";

// Shared Layout for both Login and Register
const AuthLayout = ({ children, title, subtitle, linkText, linkAction, linkLabel, hideLogo = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'var(--bg-main)',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 4, md: 4 },
        position: 'relative'
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          animation: 'fadeIn 0.6s ease-out',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(15px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}
      >
        {/* Conditional Logo Section */}
        {!hideLogo && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1, paddingRight: '30px' }}>
            <MessageCircleCode size={40} color="var(--primary)" />
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-1px' }}>
              ChatFlow
            </Typography>
          </Box>
        )}

        {/* Text Section */}
        {title && (
          <Box sx={{ mb: 1, textAlign: 'center' }}>
            {typeof title === 'string' ? (
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--text-main)', fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                {title}
              </Typography>
            ) : (
              title
            )}
          </Box>
        )}
        <Typography variant="body1" sx={{ color: 'var(--text-dim)', mb: 5, textAlign: 'center', fontSize: '1.05rem', lineHeight: 1.6 }}>
          {subtitle}
        </Typography>

        {children}

        {/* Footer Link */}
        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: 'var(--text-dim)' }}>
            {linkLabel}
          </Typography>
          <Button
            onClick={linkAction}
            disableRipple
            sx={{
              textTransform: 'none',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '1rem',
              minWidth: 0,
              p: 0,
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
            }}
          >
            {linkText}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Common Input Styles designed to be highly readable and modern
const inputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: 'transparent',
    transition: 'all 0.2s ease',
    '& fieldset': {
      borderColor: 'var(--text-muted)',
      borderWidth: '1.5px'
    },
    '&:hover fieldset': {
      borderColor: 'var(--text-dim)'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--primary)',
      borderWidth: '2px'
    },
  },
  '& .MuiInputBase-input': {
    color: 'var(--text-main)', // Fix for readability
    fontSize: '1rem',
    p: '14px'
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'var(--text-muted)',
    opacity: 1
  }
};

export const LoginPage = () => {
  const { login, user, userLoading, userError, setUserError } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(email, password);
    if (response.success) {
      navigate("/");
    }
  };

  if (userLoading) return <Loader overlay={true} />;
  if (userError) return <ErrorPage error={userError} onRetryPath="/login" />;
  if (user) navigate("/");

  return (
    <AuthLayout
      hideLogo={true}
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1, paddingRight: '10px' }}>
          <MessageCircleCode size={40} color="var(--primary)" />
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1px' }}>
            ChatFlow
          </Typography>
        </Box>
      }
      subtitle="Enter your details to access your account."
      linkLabel="Don't have an account?"
      linkText="Sign up now"
      linkAction={() => navigate('/register')}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextField
          fullWidth
          placeholder="Email address"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Mail size={22} color="var(--text-dim)" /></InputAdornment>,
          }}
          sx={inputStyles}
        />

        <Box>
          <TextField
            fullWidth
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Lock size={24} color="var(--text-dim)" /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} disableRipple sx={{ '&:hover': { bgcolor: 'transparent' } }}>
                    {showPassword ? <EyeOff size={20} color="var(--text-dim)" /> : <Eye size={20} color="var(--text-dim)" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={inputStyles}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
            <Button disableRipple sx={{ textTransform: 'none', color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 600, '&:hover': { color: 'var(--primary)', bgcolor: 'transparent' } }}>
              Forgot password?
            </Button>
          </Box>
        </Box>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{
            bgcolor: 'var(--primary)',
            color: 'white',
            borderRadius: '12px',
            py: 1.2,
            mt: 2,
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'var(--primary)',
              opacity: 0.9,
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Sign In <ArrowRight size={18} style={{ marginLeft: '8px' }} />
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={async () => {
            const response = await login('rohit@gmail.com', 'abc');
            if (response.success) navigate("/");
          }}
          sx={{
            borderColor: 'var(--text-muted)',
            color: 'var(--text-main)',
            borderRadius: '12px',
            py: 1.2,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            borderWidth: '1.5px',
            '&:hover': {
              borderColor: 'var(--text-main)',
              borderWidth: '1.5px',
              bgcolor: 'transparent'
            }
          }}
        >
          Login as Demo User
        </Button>

        <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Divider sx={{ flex: 1, borderColor: 'var(--text-muted)' }} />
          <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>OR</Typography>
          <Divider sx={{ flex: 1, borderColor: 'var(--text-muted)' }} />
        </Box>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Chrome size={20} />}
          sx={{
            borderColor: 'var(--text-muted)',
            color: 'var(--text-main)',
            textTransform: 'none',
            borderRadius: '12px',
            py: 1.4,
            fontWeight: 600,
            fontSize: '1rem',
            justifyContent: 'center',
            borderWidth: '1.5px',
            '&:hover': { borderColor: 'var(--text-main)', borderWidth: '1.5px', bgcolor: 'var(--bg-surface)' }
          }}
        >
          Continue with Google
        </Button>
      </form>
    </AuthLayout>
  );
};

export const RegisterPage = () => {
  const { register } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const onRegister = async () => {
    const response = await register(fullName, email, username, password);
    if (response.success) {
      navigate("/");
    }
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join ChatFlow to connect with your team."
      linkLabel="Already have an account?"
      linkText="Log in instead"
      linkAction={() => navigate('/login')}
    >
      <form onSubmit={(e) => { e.preventDefault(); onRegister(); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        <TextField
          fullWidth
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start"><User size={20} color="var(--text-dim)" /></InputAdornment>,
          }}
          sx={inputStyles}
        />

        <TextField
          fullWidth
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start"><User size={20} color="var(--text-dim)" /></InputAdornment>,
          }}
          sx={inputStyles}
        />

        <TextField
          fullWidth
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start"><Mail size={20} color="var(--text-dim)" /></InputAdornment>,
          }}
          sx={inputStyles}
        />

        <TextField
          fullWidth
          placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start"><Lock size={20} color="var(--text-dim)" /></InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} disableRipple sx={{ '&:hover': { bgcolor: 'transparent' } }}>
                  {showPassword ? <EyeOff size={20} color="var(--text-dim)" /> : <Eye size={20} color="var(--text-dim)" />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={inputStyles}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{
            bgcolor: 'var(--primary)',
            color: 'white',
            borderRadius: '12px',
            py: 1.6,
            mt: 2,
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'var(--primary)',
              opacity: 0.9,
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Sign Up <ArrowRight size={18} style={{ marginLeft: '8px' }} />
        </Button>

        <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Divider sx={{ flex: 1, borderColor: 'var(--text-muted)' }} />
          <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>OR</Typography>
          <Divider sx={{ flex: 1, borderColor: 'var(--text-muted)' }} />
        </Box>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Chrome size={20} />}
          sx={{
            borderColor: 'var(--text-muted)',
            color: 'var(--text-main)',
            textTransform: 'none',
            borderRadius: '12px',
            py: 1.4,
            fontWeight: 600,
            fontSize: '1rem',
            justifyContent: 'center',
            borderWidth: '1.5px',
            '&:hover': { borderColor: 'var(--text-main)', borderWidth: '1.5px', bgcolor: 'var(--bg-surface)' }
          }}
        >
          Sign up with Google
        </Button>
      </form>
    </AuthLayout>
  );
};
