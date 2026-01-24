import React, { useState, useRef } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Checkbox,
  Chip,
  Stack,
  InputAdornment
} from '@mui/material';
import {
  ArrowLeft,
  Camera,
  Search,
  Check
} from 'lucide-react';
import { useChat } from '../context/Chat';
import axios from 'axios';
import { useSnackbar } from '../context/Snackbar';
import Loader from './Loader';

export default function CreateGroupDrawer({ open, onClose }) {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const { chats, setNewChatAdded } = useChat();
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Filter contacts based on search
  const filteredContacts = chats.filter(chat => {
    if(chat.isGroupChannel) return false; // Exclude group chats
    const user = chat.users[0];
    return user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handle user selection/deselection
  const handleToggleUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle Image Upload Preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupImage(URL.createObjectURL(file));
    }
  };

  // Create Action
  const handleCreate = async () => {
    if (!groupName || selectedUsers.length === 0) return;

    // Logic to create group goes here (e.g., API call)
    console.log("Creating group:", { groupName, selectedUsers });

    try {
      setIsLoading(true);
      // const { data } = await axios.post('/api/channel/group', {
      //   name: groupName,
      //   members: selectedUsers,
      // });
        const { data } = await axios.post('/api/channel/group', {
        name: groupName,
        users: selectedUsers,
      });

      showSnackbar("Group created successfully", "success");
      setNewChatAdded(true); // Notify chat context to refresh chat list
    } catch (error) {
      showSnackbar("Failed to create group", "error");
      console.error("Error creating group:", error);
    } finally {
      // Reset and close
      setGroupName('');
      setSelectedUsers([]);
      setGroupImage(null);
      onClose();
      setIsLoading(false);
    }
  };

  if(isLoading) {
    return <Loader overlay={true} message="Creating group..." />;
  }

  return (
    <Drawer
      className="create-group-drawer"
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 400 }, // Responsive width
          bgcolor: 'var(--bg-surface)',
          color: 'var(--text-main)',
          borderRight: '1px solid var(--border-color)'
        }
      }}
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
        <Box sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid var(--border-color)',
          bgcolor: 'var(--bg-surface)'
        }}>
          <IconButton onClick={onClose} sx={{ color: 'var(--text-dim)' }}>
            <ArrowLeft size={24} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>New Group</Typography>
        </Box>

        {/* --- Scrollable Content --- */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>

          {/* 1. Group Info Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            {/* Image Uploader */}
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Avatar
                src={groupImage}
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 0.8 }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {!groupImage && <Camera size={32} color="var(--text-muted)" />}
              </Avatar>
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Box>

            {/* Name Input */}
            <TextField
              fullWidth
              placeholder="Group Name"
              variant="standard"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              InputProps={{
                disableUnderline: false,
                sx: {
                  color: 'var(--text-main)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  '&:before': { borderBottomColor: 'var(--border-color)' },
                  '&:after': { borderBottomColor: 'var(--primary)' },
                  '& input': { textAlign: 'center' }
                }
              }}
            />
          </Box>

          {/* 2. Selected Members (Chips) */}
          {selectedUsers.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>
              {selectedUsers.map(userId => {
                const chat = chats.find(c => c.users[0]._id === userId);
                const user = chat ? chat.users[0] : null;

                if (!user) return null;

                return (
                  <Chip
                    key={userId}
                    avatar={<Avatar src={user.avatar} />}
                    label={user.name}
                    onDelete={() => handleToggleUser(userId)}
                    sx={{
                      bgcolor: 'var(--bg-main)',
                      color: 'var(--text-main)',
                      borderColor: 'var(--border-color)',
                      '& .MuiChip-deleteIcon': { color: 'var(--text-muted)', '&:hover': { color: 'var(--text-dim)' } }
                    }}
                    variant="outlined"
                  />
                );
              })}
            </Stack>
          )}

          {/* 3. Search & List Section */}
          <Typography variant="subtitle2" sx={{ color: 'var(--text-dim)', mb: 2, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
            Add Members
          </Typography>

          <TextField
            fullWidth
            placeholder="Search contacts..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} style={{ color: 'var(--text-muted)' }} />
                </InputAdornment>
              ),
              sx: {
                bgcolor: 'var(--bg-main)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: '1px solid var(--border-color)' },
                '&.Mui-focused fieldset': { border: '1px solid var(--primary)' }
              }
            }}
            sx={{ mb: 2 }}
          />

          <List sx={{ px: 0 }}>
            {filteredContacts.map(contact => {
              const user = contact.users[0];
              const isSelected = selectedUsers.includes(user._id);
              return (
                <ListItemButton
                  key={contact._id} // Use contact._id (chat ID) as key for list item
                  onClick={() => handleToggleUser(user._id)}
                  sx={{
                    borderRadius: 'var(--radius-md)',
                    mb: 0.5,
                    bgcolor: isSelected ? 'var(--secondary)' : 'transparent',
                    '&:hover': { bgcolor: isSelected ? 'var(--secondary)' : 'var(--bg-main)' }
                  }}
                >
                  <ListItemAvatar>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
                      {isSelected && (
                        <Box sx={{
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          bgcolor: 'var(--primary)',
                          borderRadius: '50%',
                          width: 18,
                          height: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid var(--bg-surface)'
                        }}>
                          <Check size={12} color="var(--text-inverse)" />
                        </Box>
                      )}
                    </Box>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    primaryTypographyProps={{
                      color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                      fontWeight: isSelected ? 600 : 400,
                      fontSize: '0.95rem'
                    }}
                    secondary={`@${user.username}`}
                    secondaryTypographyProps={{ color: 'var(--text-dim)', fontSize: '.9rem' }}
                  />
                  <Checkbox
                    checked={isSelected}
                    tabIndex={-1}
                    disableRipple
                    edge="end"
                    sx={{
                      color: 'var(--border-color)',
                      '&.Mui-checked': { color: 'var(--primary)' }
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* --- Footer Action --- */}
        <Box sx={{ p: 2, borderTop: '1px solid var(--border-color)', bgcolor: 'var(--bg-surface)' }}>
          <Button
            fullWidth
            variant="contained"
            disabled={!groupName || selectedUsers.length === 0}
            onClick={handleCreate}
            sx={{
              bgcolor: 'var(--primary)',
              color: 'var(--text-inverse)',
              py: 1.5,
              borderRadius: 'var(--radius-md)',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: 'var(--primary-hover)', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' },
              '&.Mui-disabled': { bgcolor: 'var(--bg-main)', color: 'var(--text-muted)' }
            }}
          >
            Create Group {selectedUsers.length > 0 && `(${selectedUsers.length})`}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}