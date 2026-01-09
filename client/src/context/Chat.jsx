import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useUser } from './User';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [chatLoading, setChatLoading] = useState(false);
    const [chatError, setChatError] = useState(null);
    const navigate = useNavigate();

    const { user } = useUser();

    // 1. Fetch Chats (Optimized with useCallback to prevent infinite loops)
    const fetchChats = useCallback(async () => {
        // Don't fetch if no user is logged in
        if (!user) return;

        setChatError(null);
        setChatLoading(true);
        try {
            const { data } = await axios.get('/api/channel');
            setChats(data);
        } catch (err) {
            if(err.response && (err.response.status == "401" || err.response.status == "403")) {
                // Handle unauthorized or forbidden access
                navigate('/login');
            } else {
                setChatError(err);
            }
        } finally {
            setChatLoading(false);
        }
    }, [user]);

    // 2. Helper: Update the 'Latest Message' in real-time
    // Call this when a socket message arrives to bump the chat to the top
    const updateLatestMessage = (newMessage) => {
        const channelId = newMessage.channel._id || newMessage.channel;

        setChats(prevChats => {
            // Find the chat that received the message
            const updatedChatIndex = prevChats.findIndex(c => c._id === channelId);

            if (updatedChatIndex === -1) {
                // Option: You might want to fetchChats() here if it's a brand new conversation
                return prevChats;
            }

            const updatedChat = {
                ...prevChats[updatedChatIndex],
                latestMessage: newMessage,
                updatedAt: new Date().toISOString() // Update time for sorting
            };

            // Remove the old version and put the updated one at the top (Index 0)
            const otherChats = prevChats.filter(c => c._id !== channelId);
            return [updatedChat, ...otherChats];
        });
    };

    return (
        <ChatContext.Provider
            value={{
                chats,
                setChats,
                activeChat,
                setActiveChat,
                chatLoading,
                chatError,
                fetchChats,
                updateLatestMessage
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);