import { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Drawer
} from '@mui/material';
import {
  ArrowLeft,
  Search,
  X,
  UserPlus,
  MessageSquare,
  Mail,
  AtSign
} from 'lucide-react';
import axios from 'axios';
import ErrorPage from './ErrorPage.jsx';

// --- Mock Data Database ---
const MOCK_DATABASE = [
  { id: 1, name: "Alice Freeman", username: "alice_f", email: "alice@example.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
  { id: 5, name: "Alice Freeman", username: "alice_f", email: "alice@example.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
  { id: 2, name: "Bob Smith", username: "bob_builder", email: "bob@test.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
  { id: 3, name: "Charlie Davis", username: "charlie_d", email: "charlie@domain.org", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie" },
  { id: 4, name: "Diana Prince", username: "wonder_d", email: "diana@themyscira.net", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana" },
];

export default function UserSearchDrawer({ openUserSearchDrawer, setOpenUserSearchDrawer, onStartChat }) {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleUserSearch = async () => {
    if (!query.trim()) return;
    try {
      setIsSearching(true);
      setHasSearched(true);

      const { data } = await axios.get(`/api/user?search=${encodeURIComponent(query.trim())}`);
      setSearchResult(data);
    } catch (err) {
      setError("Failed to search users. Please try again.");
      console.error("Error during user search:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleUserSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchResult([]);
    setHasSearched(false);
  };

  if (error) {
    return <ErrorPage message={error} onRetry={() => setError(null)} />;
  }

  return (
    <Drawer
      anchor={'right'}
      open={openUserSearchDrawer}
      onClose={() => setOpenUserSearchDrawer(false)}
      className='user-search-drawer'
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: 'var(--bg-main)',
          color: 'var(--text-main)',
          animation: 'fadeIn 0.3s ease-out',
          '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } }
        }}
      >
        {/* --- Header --- */}
        <Box
          sx={{
            height: 73,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}
        >
          <IconButton
            onClick={() => { handleClear(); setOpenUserSearchDrawer(false); }}
            sx={{ color: 'var(--text-dim)', '&:hover': { bgcolor: 'var(--bg-main)' } }}
          >
            <ArrowLeft size={22} />
          </IconButton>

          <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              autoFocus
              placeholder="Search by full username or email..."
              variant="outlined"
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                // startAdornment: (
                //   <InputAdornment position="start">
                //     <Search size={18} style={{ color: 'var(--text-muted)' }} />
                //   </InputAdornment>
                // ),
                endAdornment: query && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClear} sx={{ color: 'var(--text-muted)' }}>
                      <X size={16} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'var(--bg-main)',
                  borderRadius: '30px',
                  border: '2px solid #eee',
                  color: 'var(--text-main)',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: '1px solid var(--border-color)' },
                  '&.Mui-focused fieldset': { border: '1px solid var(--primary)' },
                },
                '& input::placeholder': { color: 'var(--text-muted)', opacity: 1 }
              }}
            />
            <IconButton
              onClick={handleUserSearch}
              disabled={isSearching || !query.trim()}
              sx={{
                bgcolor: 'var(--primary)',
                color: 'var(--text-inverse)',
                borderRadius: 'var(--radius-md)',
                width: 40,
                height: 40,
                '&:hover': { bgcolor: 'var(--primary-hover)' },
                '&.Mui-disabled': { bgcolor: 'var(--bg-main)', color: 'var(--text-muted)' }
              }}
            >
              {isSearching ? <CircularProgress size={20} color='inherit' /> : <Search size={20} />}
            </IconButton>
          </Box>
        </Box>

        {/* --- Content Area --- */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 0 }}>

          {/* State: Loading (Center Page) */}
          {isSearching && (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
              {/* Spinner inside button handles small loading, this handles page transition feel */}
            </Box>
          )}

          {/* State: searchResult Found */}
          {!isSearching && searchResult.length > 0 && (
            <List sx={{ px: 2, py: 2 }}>
              <Typography variant="caption" sx={{ px: 2, mb: 1, display: 'block', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Search searchResult ({searchResult.length})
              </Typography>
              {searchResult.map((user) => (
                <Paper
                  key={user.id}
                  elevation={0}
                  sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: 'var(--primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                  }}
                >
                  <Avatar
                    src={user.avatar}
                    sx={{ width: 48, height: 48, bgcolor: 'var(--bg-main)', mr: 2 }}
                  />
                  <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {user.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', color: 'var(--text-dim)', fontWeight: 600 }}>
                        <AtSign size={12} style={{ marginRight: 4 }} /> {user.username}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', color: 'var(--text-dim)', fontWeight: 600 }}>
                        <Mail size={12} style={{ marginRight: 4 }} /> {user.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => onStartChat && onStartChat(user)}
                      sx={{
                        bgcolor: 'var(--secondary)',
                        color: 'var(--primary)',
                        borderRadius: 'var(--radius-md)',
                        '&:hover': { bgcolor: 'var(--primary)', color: 'var(--text-inverse)' }
                      }}
                    >
                      <MessageSquare size={18} />
                    </IconButton>
                    <IconButton
                      sx={{
                        bgcolor: 'var(--bg-main)',
                        color: 'var(--text-dim)',
                        borderRadius: 'var(--radius-md)',
                        '&:hover': { bgcolor: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }
                      }}
                    >
                      <UserPlus size={18} />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </List>
          )}

          {/* State: No searchResult */}
          {!isSearching && hasSearched && searchResult.length === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', textAlign: 'center', px: 4 }}>
              <Box sx={{ p: 3, bgcolor: 'var(--bg-surface)', borderRadius: '50%', mb: 2 }}>
                <Search size={48} className="text-gray-300" style={{ color: 'var(--text-muted)' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-main)', mb: 1 }}>
                No users found
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--text-dim)', maxWidth: 260 }}>
                We couldn't find anyone matching. Try a different username or email.
              </Typography>
            </Box>
          )}

          {/* State: Initial Empty */}
          {!isSearching && !hasSearched && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', textAlign: 'center', px: 4, opacity: 0.6 }}>
              <Box sx={{ p: 3, bgcolor: 'var(--bg-surface)', borderRadius: '50%', mb: 2 }}>
                <AtSign size={48} style={{ color: 'var(--primary)' }} />
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'var(--text-dim)' }}>
                Type a full username or email address above to find people.
              </Typography>
            </Box>
          )}

        </Box>
      </Box>
    </Drawer>
  );
};

