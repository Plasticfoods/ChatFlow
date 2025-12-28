import {  List, 
  ListItemButton, 
  ListItemAvatar, 
  ListItemText, Avatar } from '@mui/material';
import { useState } from 'react';
import { MessageCircleCode, MessageSquarePlus, ChevronLeft, AtSign, Users, Mail, ChevronRight } from 'lucide-react';
import { ChatListSearch } from './ChatList.jsx';


export default function AddChatSection({ chats, setShowAddChatSection }) {

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all', 'unread', 'groupchat'

    // 1. Handle Tab Change
    const handleTabChange = (event, newValue) => {
        setFilterType(newValue);
    };

    // 2. The Smart Filter Logic
    const filteredChats = chats.filter(chat => {
        // First, check if it matches the search text
        const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Then, check if it matches the active Tab
        if (filterType === 'unread') {
            return matchesSearch && chat.unreadCount > 0;
        }
        if (filterType === 'groupchat') {
            return matchesSearch && chat.isGroup === true;
        }
        // Default 'all'
        return matchesSearch;
    });

    return (
        <div className="chat-list new-chat-section" style={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <header>
                <div className='hidden-on-mobile' style={{ display: 'flex', justifyContent: 'start', padding: '1rem 1.4rem', gap: '15px', alignItems: 'center' }}>
                    <ChevronLeft  color='var(--text-main)' size={30} sx={{ cursor: 'pointer' }} onClick={() => setShowAddChatSection(false)} />
                    <h4 style={{ fontSize: '1.5rem', fontWeight: '500', color: 'var(--text-main)' }}>New Chat</h4>
                </div>
                <ChatListSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} style={{ cursor: 'pointer'}} />
            </header>
            
            <List sx={{ px: 1 }}>
              {[
                { icon: AtSign, label: "Find by Username" },
                { icon: Mail, label: "Find by Email" },
                { icon: Users, label: "Create Group" },
              ].map((opt, idx) => (
                <ListItemButton 
                  key={idx} 
                  sx={{ borderRadius: 'var(--radius-md)', mb: 0.5, '&:hover': { bgcolor: 'var(--secondary)' } }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'var(--secondary)', color: 'var(--primary)', width: 40, height: 40 }}>
                      <opt.icon size={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={opt.label} primaryTypographyProps={{ fontWeight: 500, color: 'var(--text-main)' }} />
                  <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                </ListItemButton>
              ))}
            </List>
        </div>
    )
}

