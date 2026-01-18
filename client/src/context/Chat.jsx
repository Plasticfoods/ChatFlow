import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './User';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const [chatLoading, setChatLoading] = useState(false);
    const [chatError, setChatError] = useState(null);
    const [newUserAdded, setNewUserAdded] = useState(false);
    // State variable which will track the latest channel update received within same chat or different chat
    const [latestChannelUpdate, setLatestChannelUpdate] = useState(null);
    const navigate = useNavigate();

    const { user } = useUser();

    // 2. AUTOMATIC TRIGGER: Fetch when User logs in
    useEffect(() => {
        if (user || newUserAdded) {
            // This runs immediately when 'user' becomes available (login/reload)
            fetchChats();
        } else {
            // Optional: Clear chats on logout
            setChats([]);
            setActiveChat(null);
        }
    }, [user, newUserAdded]);

    // 1. Fetch Chats (Optimized with useCallback to prevent infinite loops)
    const fetchChats = useCallback(async () => {
        // Don't fetch if no user is logged in
        if (!user) return;

        setChatError(null);
        setChatLoading(true);
        try {
            const { data } = await axios.get('/api/channel');
            const processedData = filterChatUsers(data);
            setChats(processedData);
        } catch (err) {
            if (err.response && (err.response.status == "401" || err.response.status == "403")) {
                // Handle unauthorized or forbidden access
                navigate('/login');
            } else {
                setChatError(err);
            }
        } finally {
            setChatLoading(false);
            setNewUserAdded(false); // Reset the flag after fetching
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

    // Remove the current user from the 'users' array in the response
    const filterChatUsers = (list) => {
        return list.map(chat => {
            chat.users = chat.users.filter(c => c._id.toString() !== user._id.toString());
            return chat;
        })
    }

    // update chats when new message arrives via socket
    const updateChatsOnMessage = (updatedChannel) => {
        setChats(prevChats => {
            const tempChats = [...prevChats];
            const index = tempChats.findIndex(c => c._id === updatedChannel._id);

            if (index !== -1) {
                tempChats.splice(index, 1);
            }
            tempChats.unshift(updatedChannel);
            setLatestChannelUpdate(updatedChannel);
            return filterChatUsers(tempChats);
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
                //updateLatestMessage,
                newUserAdded,
                setNewUserAdded,
                updateChatsOnMessage,
                latestChannelUpdate,
                setLatestChannelUpdate
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);