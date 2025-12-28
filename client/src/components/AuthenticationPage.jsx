import { useState } from "react";
import { 
  Box, 
  List, 
  ListItemButton, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  TextField, 
  Typography, 
  IconButton, 
  InputAdornment, 
  Badge, 
  Divider,
  Paper,
  Drawer,
  Switch,
  Button,
  Grid,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  MessageSquare, 
  Moon, 
  Sun, 
  Settings, 
  Users, 
  Menu, 
  X, 
  Search, 
  Send, 
  Phone, 
  Video, 
  Info,
  ArrowRight,
  ArrowLeft,
  Layout,
  Bell,
  Plus,
  AtSign,
  Mail,
  UserPlus,
  ChevronRight,
  Palette,
  Sparkles,
  Bot,
  Lock,
  User,
  Github,
  Chrome
} from 'lucide-react';
import { useUser } from '../context/User.jsx';


const AuthLayout = ({ children, title, subtitle, linkText, linkAction, linkLabel }) => (
  <Box 
    sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      bgcolor: 'var(--bg-main)',
      p: 2
    }}
  >
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: 440,
        p: 4,
        borderRadius: '24px',
        bgcolor: 'var(--bg-surface)',
        textAlign: 'center',
        border: '1px solid var(--border-color)',
        animation: 'fadeIn 0.5s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: '16px', bgcolor: 'var(--secondary)', color: 'var(--primary)', mb: 2 }}>
        <MessageSquare size={32} />
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--text-main)', mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'var(--text-dim)', mb: 4 }}>
        {subtitle}
      </Typography>

      {children}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'var(--text-dim)' }}>
          {linkLabel}{' '}
          <Button 
            onClick={linkAction}
            sx={{ 
              textTransform: 'none', 
              color: 'var(--primary)', 
              fontWeight: 700,
              minWidth: 0,
              p: 0,
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } 
            }}
          >
            {linkText}
          </Button>
        </Typography>
      </Box>
    </Paper>
  </Box>
);

export const LoginPage = () => {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    const response = await login(email, password);
    if (response.success) {
      window.location.href = '/';
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to continue to ChatSpace"
      linkLabel="Don't have an account?"
      linkText="Sign Up"
      linkAction={'/register'}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email Address"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Mail size={20} className="text-gray-400" /></InputAdornment>,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 'var(--radius-md)',
              bgcolor: 'var(--bg-main)',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'var(--border-color)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: 'var(--primary)' }
          }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Lock size={20} className="text-gray-400" /></InputAdornment>,
          }}
          sx={{
            mb: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 'var(--radius-md)',
              bgcolor: 'var(--bg-main)',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'var(--border-color)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: 'var(--primary)' }
          }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button sx={{ textTransform: 'none', color: 'var(--primary)', fontSize: '0.875rem' }}>
            Forgot password?
          </Button>
        </Box>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{
            bgcolor: 'var(--primary)',
            color: 'var(--text-inverse)',
            borderRadius: 'var(--radius-md)',
            py: 1.5,
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
            '&:hover': { bgcolor: 'var(--primary-hover)', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }
          }}
        >
          Sign In
        </Button>

        <Box sx={{ my: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>OR CONTINUE WITH</Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        <Grid container spacing={2} sx={{ justifyContent: 'center'}}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Chrome size={20} />}
              sx={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)',
                textTransform: 'none',
                borderRadius: 'var(--radius-md)',
                py: 1,
                '&:hover': { borderColor: 'var(--text-dim)', bgcolor: 'var(--bg-main)' }
              }}
            >
              Google
            </Button>
          </Grid>
          <Grid item xs={6}>
             <Button
              fullWidth
              variant="outlined"
              startIcon={<Github size={20} />}
              sx={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-main)',
                textTransform: 'none',
                borderRadius: 'var(--radius-md)',
                py: 1,
                '&:hover': { borderColor: 'var(--text-dim)', bgcolor: 'var(--bg-main)' }
              }}
            >
              GitHub
            </Button>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};

export const RegisterPage = () => {
  const { register } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

  const onRegister = async () => {
    // redirect to home page for demo purposes
    const response = await register(fullName, email, username, password);
    if (response.success) {
      window.location.href = '/';
    }
  }

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join ChatSpace today"
      linkLabel="Already have an account?"
      linkText="Sign In"
      linkAction={'/login'}
    >
      <form onSubmit={(e) => { e.preventDefault(); onRegister(); }}>
        <TextField
          fullWidth
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start"><User size={20} className="text-gray-400" /></InputAdornment>,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 'var(--radius-md)',
              bgcolor: 'var(--bg-main)',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'var(--border-color)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
            },
             '& .MuiInputLabel-root.Mui-focused': { color: 'var(--primary)' }
          }}
        />
        <TextField
          fullWidth
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start"><Mail size={20} className="text-gray-400" /></InputAdornment>,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 'var(--radius-md)',
              bgcolor: 'var(--bg-main)',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'var(--border-color)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
            },
             '& .MuiInputLabel-root.Mui-focused': { color: 'var(--primary)' }
          }}
        />
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start"><User size={20} className="text-gray-400" /></InputAdornment>,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 'var(--radius-md)',
              bgcolor: 'var(--bg-main)',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'var(--border-color)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
            },
             '& .MuiInputLabel-root.Mui-focused': { color: 'var(--primary)' }
          }}
        />
        <TextField
          fullWidth
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start"><Lock size={20} className="text-gray-400" /></InputAdornment>,
          }}
          sx={{
            mb: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: 'var(--radius-md)',
              bgcolor: 'var(--bg-main)',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'var(--border-color)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
            },
             '& .MuiInputLabel-root.Mui-focused': { color: 'var(--primary)' }
          }}
        />
        
        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{
            bgcolor: 'var(--primary)',
            color: 'var(--text-inverse)',
            borderRadius: 'var(--radius-md)',
            py: 1.5,
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
            '&:hover': { bgcolor: 'var(--primary-hover)', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }
          }}
        >
          Create Account
        </Button>
      </form>
    </AuthLayout>
  );
};