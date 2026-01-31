import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import {
  X,
  Calendar,
  Trash2,
  LogOut,
  Shield,
  User,
  Users,
  Mail
} from 'lucide-react';
import { useUser } from '../context/User'; 

export default function ChatInfoDrawer({ open, onClose, chat }) {
  const { user: currentUser } = useUser();

  if (!chat) return null;

  // --- Logic to Determine Chat Type & Details ---
  const isGroup = chat.isGroupChannel;
  
  // For Single Chat: Find the other user
  const otherUser = !isGroup 
    ? chat.users.find((u) => u._id !== currentUser?._id) 
    : null;

  // Display Details
  const chatName = isGroup ? chat.chatName : otherUser?.name;
  const chatImage = isGroup ? chat.avatar : otherUser?.avatar;
  const chatSubtitle = isGroup 
    ? `${chat.users.length + 1} members` 
    : otherUser?.email;

  // Date Formatting
  const creationDate = new Date(chat.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Admin Check
  const isAdmin = isGroup && chat.groupAdmin?._id === currentUser?._id;

  // --- Handlers ---
  const handleDeleteChat = () => {
    console.log("Deleting chat:", chat._id);
    // Add API call logic here
  };

  const handleExitGroup = () => {
    console.log("Exiting group:", chat._id);
    // Add API call logic here
  };

  const handleDeleteGroup = () => {
    console.log("Deleting group (Admin action):", chat._id);
    // Add API call logic here
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '30rem',
          bgcolor: 'var(--bg-surface)',
          color: 'var(--text-main)',
          borderLeft: '1px solid var(--border-color)'
        }
      }}
      className='chat-info-drawer'
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* 1. Header */}
        <Box sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)',
          bgcolor: 'var(--bg-surface)'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {isGroup ? 'Group Info' : 'Contact Info'}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'var(--text-dim)' }}>
            <X size={24} />
          </IconButton>
        </Box>

        {/* 2. Scrollable Content */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          
          {/* Hero Section */}
          <Box sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <Avatar 
              src={chatImage} 
              alt={chatName}
              sx={{ 
                width: 120, 
                height: 120, 
                mb: 2, 
                border: '4px solid var(--bg-main)',
                bgcolor: 'var(--bg-main)'
              }}
            >
              {isGroup ? <Users size={48} /> : <User size={48} />}
            </Avatar>
            
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--text-main)', mb: 0.5 }}>
              {chatName}
            </Typography>
            
            <Typography variant="body2" sx={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {chatSubtitle}
            </Typography>
          </Box>

          {/* Info Section */}
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ 
              color: 'var(--text-dim)', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              fontSize: '0.75rem', 
              letterSpacing: '0.05em',
              mb: 2
            }}>
              About
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              p: 2, 
              bgcolor: 'var(--bg-main)', 
              borderRadius: 'var(--radius-md)',
              mb: 2
            }}>
              <Calendar size={20} color="var(--primary)" />
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-dim)', display: 'block' }}>
                  Created
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {creationDate}
                </Typography>
              </Box>
            </Box>

            {!isGroup && otherUser?.about && (
               <Box sx={{ 
                p: 2, 
                bgcolor: 'var(--bg-main)', 
                borderRadius: 'var(--radius-md)'
              }}>
                <Typography variant="caption" sx={{ color: 'var(--text-dim)', display: 'block', mb: 0.5 }}>
                  Bio
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {otherUser.about}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Group Chat Info Section (Only for Groups) */}
          {isGroup && (
            <Box>
              <Divider sx={{ borderColor: 'var(--border-color)' }} />
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ 
                  color: 'var(--text-dim)', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  fontSize: '0.75rem', 
                  letterSpacing: '0.05em',
                  mb: 1,
                  px: 1
                }}>
                  Group Chat Info ({chat.users.length} Members)
                </Typography>
                
                <List disablePadding>
                  {chat.users.map((member) => (
                    <ListItem key={member._id} sx={{ borderRadius: 'var(--radius-md)', '&:hover': { bgcolor: 'var(--bg-main)' } }}>
                      <ListItemAvatar>
                        <Avatar src={member.avatar} />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {member.name}
                            {chat.groupAdmin?._id === member._id && (
                              <Chip 
                                label="Admin" 
                                size="small" 
                                color="primary" 
                                variant="outlined" 
                                sx={{ height: 20, fontSize: '0.65rem' }} 
                              />
                            )}
                          </Box>
                        }
                        secondary={member.email}
                        primaryTypographyProps={{ fontWeight: 500, color: 'var(--text-main)' }}
                        secondaryTypographyProps={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}
        </Box>

        {/* 3. Actions / Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid var(--border-color)', bgcolor: 'var(--bg-main)' }}>
          <Stack spacing={2}>
            
            {/* Logic for 1-on-1 Chat */}
            {!isGroup && (
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<Trash2 size={18} />}
                onClick={handleDeleteChat}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 'var(--radius-md)' }}
              >
                Delete Chat
              </Button>
            )}

            {/* Logic for Groups */}
            {isGroup && (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  startIcon={<LogOut size={18} />}
                  onClick={handleExitGroup}
                  sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 'var(--radius-md)', borderColor: 'var(--text-dim)', color: 'var(--text-main)' }}
                >
                  Exit Group
                </Button>

                {/* ADMIN ONLY BUTTON */}
                {isAdmin && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    startIcon={<Trash2 size={18} />}
                    onClick={handleDeleteGroup}
                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 'var(--radius-md)', boxShadow: 'none' }}
                  >
                    Delete Group
                  </Button>
                )}
              </>
            )}
          </Stack>
        </Box>

      </Box>
    </Drawer>
  );
}