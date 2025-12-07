import { CircularProgress, Box, Typography } from '@mui/material';

const Loader = ({ message = "Loading...", overlay = false, className = '' }) => {
  return (
    <Box
      className={className}
      sx={{
        // 1. DIMENSIONS: Fill the parent container
        width: '100%',
        height: '100%',
        
        // 2. LAYOUT: Center content
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        
        // 3. APPEARANCE
        backgroundColor: 'var(--bg-main)', // Matches active theme
        transition: 'background-color 0.3s ease',
        
        // 4. OVERLAY LOGIC (Optional)
        // If 'overlay' is true, this sits ON TOP of parent content
        ...(overlay && {
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 50, // High enough to cover content
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent logic if needed
           // OR keep solid 'var(--bg-main)' if you want to hide content completely
        })
      }}
    >
      {/* The Spinner */}
      <CircularProgress 
        size={50} 
        thickness={4} 
        sx={{ color: 'var(--primary)' }} 
      />
      
      {/* The Text */}
      <Typography 
        variant="h5" 
        sx={{ 
          marginTop: 2, 
          color: 'var(--text-dim)', 
          fontWeight: 500,
          animation: 'pulse 1.5s infinite ease-in-out'
        }}
      >
        {message}
      </Typography>

      {/* Internal Style for the pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>
    </Box>
  );
};

export default Loader;