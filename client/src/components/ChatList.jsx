import { TextField, InputAdornment } from '@mui/material';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export default function ChatList() {

    return (
        <div className="chat-list">
            <h2 id='chatflow'>ChatFlow</h2>
            <ChatListSearch />
        </div>
    )
}

const ChatListSearch = () => {
  return (
    <div style={{ padding: '16px' }}>
      <TextField
        placeholder="Search contacts..."
        variant="outlined"
        fullWidth
        sx={{
          // 1. The Container Styles
          '& .MuiOutlinedInput-root': {
            // Use your CSS variable for the light grey background
            backgroundColor: 'var(--bg-main, #F5F7FB)', 
            borderRadius: '999px', // Makes it pill-shaped
            height: '40px',        // Compact height
            paddingLeft: '4px',
            
            // 2. Remove the default MUI Border
            '& fieldset': {
              border: 'none',
            },
            
            // 3. Hover state (optional subtle darken)
            '&:hover': {
              backgroundColor: '#eef0f5',
            },
            
            // 4. Focus state (optional ring)
            '&.Mui-focused': {
              backgroundColor: 'var(--bg-main, #F5F7FB)',
              boxShadow: '0 0 0 2px var(--text-dim, #E3F2FF)', // Subtle blue focus ring
            }
          },
          // 5. Input Text Styles
          '& input': {
            color: 'var(--text-main, #1C1F26)',
            padding: '8px 0', // Center text vertically
          }
        }}
        InputProps={{
          // Add the Search Icon at the start
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'var(--text-muted, #9CA3AF)' }} />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};