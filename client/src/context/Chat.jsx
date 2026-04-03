import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './User';
import { useNavigate } from 'react-router-dom';
import { useSocket } from './Socket';
import { useSnackbar } from './Snackbar';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { socket } = useSocket();
    const { showSnackbar } = useSnackbar();
    const [chats, setChats] = useState(null);
    const [activeChatId, setActiveChatId] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const [chatLoading, setChatLoading] = useState(false);
    const [chatError, setChatError] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [newChatAdded, setNewChatAdded] = useState(false);
    const navigate = useNavigate();
    const { user } = useUser();

    // This runs immediately when 'user' becomes available (login/reload) or when a new chat is added
    useEffect(() => {
        if (user || newChatAdded) {
            fetchChats();
        } else {
            setChats([]);
            setActiveChat(null);
            setActiveChatId(null);
        }
    }, [user, newChatAdded]);

    // Set up socket listener for incoming messages
    useEffect(() => {
        if (!socket) return;
        console.log("ChatWindow - Setting up socket listener for incoming messages", activeChatId);

        const messageHandler = (data) => {
            console.log("Socket received new message: ", activeChatId);
            const { newMessage, channel } = data;
            // Only append if the message belongs to the CURRENTLY opened chat
            if (activeChatId && channel._id === activeChatId) {
                setMessages(prevMessages => [...prevMessages, newMessage]);
            }
            // Update the chats list to reflect the latest message
            updateChatListOnMessage(channel);
        };

        // Register the handler directly (not via anonymous wrapper)
        // so that socket.off can correctly remove it during cleanup.
        socket.on("receive_message", messageHandler);

        // CLEANUP: This is critical. It removes the old listener so a new one 
        // with the FRESH activeChatId can be created.
        return () => {
            socket.off("receive_message", messageHandler);
            console.log("ChatWindow - Removed socket listener for incoming messages");
        }
    }, [socket, activeChatId]);

    // 3. Fetch Messages when Active Chat changes and set Active Chat Object
    useEffect(() => {
        if (!activeChatId || !chats) {
            setActiveChat(null);
            setMessages(null);
            return;
        };

        for (const chat of chats) {
            if (chat._id === activeChatId) {
                setActiveChat(chat);
                break;
            }
        }

        const fetchMessages = async () => {
            if (!activeChatId) return;
            setMessagesLoading(true);
            try {
                console.log("Fetching messages for chat:", activeChatId);
                const { data } = await axios.get(`/api/message/${activeChatId}`);
                setMessages(data);
                // --- SOCKET LOGIC: JOIN ROOM ---
                // if (socket) {
                //   socket.emit("join_chat", activeChat._id);
                // }
            } catch (error) {
                showSnackbar("Failed to load messages", "error");
                console.error("Error fetching messages:", error);
                setMessagesError(error);
                setMessages(null);
            } finally {
                setMessagesLoading(false);
            }
        };

        fetchMessages();
    }, [activeChatId]);

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
            setNewChatAdded(false); // Reset the flag after fetching
        }
    }, [user]);

    // Remove the current user from the 'users' array in the response
    const filterChatUsers = (list) => {
        // First, filter out deleted chats for now
        list = list.filter(chat => chat.isDeleted === false);
        return list.map(chat => {
            chat.users = chat.users.filter(c => c._id.toString() !== user._id.toString());
            return chat;
        })
    }

    // update chat list with updated chat when new message arrives via socket
    const updateChatListOnMessage = (updatedChannel) => {
        setChats(prevChats => {
            const tempChats = [...prevChats];
            const index = tempChats.findIndex(c => c._id === updatedChannel._id);
            if (index !== -1) {
                tempChats.splice(index, 1);
            }
            tempChats.unshift(updatedChannel);
            return filterChatUsers(tempChats);
        });
    };

    const sendMessage = async (message) => {
        // Optimistically show the message immediately
        setMessages((prev) => [...prev, message]);

        // Emit with acknowledgment callback
        socket.emit("new_message", message, (response) => {
            if (response && response.success) {
                // Replace the optimistic message with the confirmed one from the DB
                setMessages((prev) =>
                    prev.map((m) => (m === message ? response.newMessage : m))
                );
                // Update chat list so this chat moves to the top
                updateChatListOnMessage(response.channel);
            } else {
                // Remove the optimistic message and show error
                showSnackbar("Message failed to deliver", "error");
                setMessages((prev) => prev.filter((m) => m !== message));
            }
        });
    }

    return (
        <ChatContext.Provider
            value={{
                chats,
                activeChat,
                setActiveChat,
                chatLoading,
                chatError,

                activeChatId,
                setActiveChatId,
                messages,
                messagesLoading,
                messagesError,
                updateChatListOnMessage,
                sendMessage,
                newChatAdded,
                setNewChatAdded,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);