import { Box, Typography } from '@mui/material';

const Loader = ({ message = "Loading...", overlay = false, className = '' }) => {
  return (
    <Box
      className={className}
      role="status"
      aria-live="polite"
      sx={{
        // 1. DIMENSIONS: Fill the parent container
        width: '100%',
        height: '100%',

        // 2. LAYOUT: Center content
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,

        // 3. APPEARANCE
        backgroundColor: 'var(--bg-main)',
        transition: 'background-color 0.3s ease',

        // 4. OVERLAY LOGIC (Optional)
        // If 'overlay' is true, this sits ON TOP of parent content
        ...(overlay && {
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 50,
          backgroundColor: 'var(--bg-main)',
        }),

        // Keyframes
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        },
      }}
    >
      {/* Spinner */}
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          border: '4.2px solid var(--border-color)',
          borderTopColor: 'var(--primary)',
          animation: 'spin 0.8s linear infinite',
        }}
      />

      {/* Message */}
      {message && (
        <Typography
          variant="body1"
          sx={{
            color: 'var(--text-dim)',
            fontWeight: 500,
            fontSize: '1rem',
            letterSpacing: '0.01em',
            animation: 'pulse 1.8s ease-in-out infinite',
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;