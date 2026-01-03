import { Box, Typography, Button, Paper } from '@mui/material';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';

const ErrorPage = ({ 
  code = '404', 
  title = 'Page Not Found', 
  message = "The page you're looking for doesn't exist or has been moved.",
  onHome,
  onRetry 
}) => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: 'var(--bg-main)', 
        color: 'var(--text-main)',
        p: 2,
        animation: 'fadeIn 0.5s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
          p: { xs: 4, md: 6 },
          borderRadius: '24px',
          bgcolor: 'var(--bg-surface)',
          // Border removed as requested
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)'
        }}
      >
        {/* Icon Circle */}
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
            mb: 4
          }}
        >
          <AlertTriangle size={40} strokeWidth={1.5} />
        </Box>

        {/* Error Code */}
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: '4rem', 
            fontWeight: 800, 
            color: 'var(--primary)', 
            lineHeight: 1, 
            mb: 2 
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
            lineHeight: 1.6 
          }}
        >
          {message}
        </Typography>

        {/* Actions */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%' }}>
          {/* Always visible Go Home button, defaults to root path */}
          <Button
            fullWidth
            onClick={onHome || (() => window.location.href = '/')}
            startIcon={<Home size={20} />}
            sx={{
              py: 1.5,
              borderRadius: 'var(--radius-md)',
              textTransform: 'none',
              fontWeight: 600,
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              '&:hover': { bgcolor: 'var(--bg-main)', borderColor: 'var(--text-dim)' }
            }}
          >
            Go Home
          </Button>

           {onRetry && (
            <Button
              fullWidth
              onClick={onRetry}
              startIcon={<RefreshCcw size={20} />}
              variant="contained"
              sx={{
                py: 1.5,
                borderRadius: 'var(--radius-md)',
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: 'var(--primary)',
                color: 'var(--text-inverse)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': { bgcolor: 'var(--primary-hover)' }
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