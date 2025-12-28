import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import ChatListItems from './ChatListItems.jsx';
import { MessageCircleCode, MessageSquarePlus } from 'lucide-react';


export default function ChatList({ chats, activeChat, setActiveChat, setShowAddChatSection }) {
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
        <div className="chat-list section-middle" style={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <header>
                <div className='hidden-on-mobile' style={{ display: 'flex', justifyContent: 'start', padding: '1rem 1.4rem', gap: '15px', alignItems: 'center' }}>
                    <MessageCircleCode color='var(--primary)' size={35} />
                    <h2 id='chatflow' style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--primary)' }}>ChatFlow</h2>
                    <MessageSquarePlus color='var(--text-main)' size={26} style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={() => setShowAddChatSection(true)} />
                </div>
                <ChatListSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </header>
            <Tabs
                value={filterType}
                onChange={handleTabChange}
                sx={{
                    paddingTop: '.5rem',
                    minHeight: '40px',
                    borderBottom: '1px solid var(--border-color)', // Adds a subtle grey line across the whole width

                    // Customize the Sliding Indicator (The Blue Line)
                    '& .MuiTabs-indicator': {
                        backgroundColor: 'var(--primary)',
                        height: '3px', // Slightly thicker for modern look
                        borderRadius: '3px 3px 0 0' // Rounded top corners on the line
                    }
                }}
            >
                <Tab
                    label="All"
                    value="all"
                    disableRipple
                    sx={tabStyle}
                />
                <Tab
                    label="Unread"
                    value="unread"
                    disableRipple
                    sx={tabStyle}
                />
                <Tab
                    label="Groups"
                    value="groupchat"
                    disableRipple
                    sx={tabStyle}
                />
            </Tabs>
            <ChatListItems chats={filteredChats} activeChat={activeChat} setActiveChat={setActiveChat} />
        </div>
    )
}


export const ChatListSearch = ({ searchTerm, setSearchTerm }) => {
    return (
        <div style={{ padding: '.5rem 1.2rem' }}>
            <TextField
                placeholder="Search contacts..."
                variant="outlined"
                fullWidth
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
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
                            <SearchIcon sx={{ color: 'var(--text-muted, #9CA3AF)', marginLeft: '10px' }} />
                        </InputAdornment>
                    ),
                }}
            />
        </div>
    );
};

// 5. CUSTOM STYLES FOR THE TABS
const tabStyle = {
    textTransform: 'none',     // Stop ALL CAPS default
    fontWeight: 600,
    fontSize: '14px',          // Slightly larger for readability
    minHeight: '40px',
    padding: '0 16px',
    color: 'var(--text-dim)',  // Default text color (Gray)
    transition: 'all 0.2s',

    // Active State Styling
    '&.Mui-selected': {
        color: 'var(--primary)', // Blue Text
        // Note: No background color here anymore, just text color
    },

    // Hover State
    '&:hover': {
        color: 'var(--text-main)',
        backgroundColor: 'transparent',
    }
};

