import { useState, useEffect, useRef } from 'react';
import {
  Info,
  Smile,
  Paperclip,
  Mic,
  Send,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import Loader from './Loader.jsx';
import MessageBubble from './MessageBubble.jsx';
// import useIsMobile from '../hooks/mobileSreenHook.jsx';
import './ChatWindow.css';
import { useChat } from '../context/Chat.jsx';
import ErrorPage from './ErrorPage.jsx';
import { useUser } from '../context/User.jsx';
import Avatar from '@mui/material/Avatar';

export default function ChatWindow() {
  const { activeChat, setActiveChatId, messagesLoading, messagesError } = useChat();

  const handleSetActiveChat = () => {
    setActiveChatId(null);
  }

  if (messagesLoading) {
    return <Loader message="Loading Conversation..." overlay={false} className='chat-window active' />;
  }

  if (messagesError) {
    return <ErrorPage error={messagesError} />;
  }

  if (!activeChat) {
    return <EmptyChatState />;
  }

  return (
    <>
      {activeChat && activeChat.isGroupChannel ? (
        <GroupChatWindow handleSetActiveChat={handleSetActiveChat} />
      ) : (
        <SingleChatWindow handleSetActiveChat={handleSetActiveChat} />
      )}
    </>
  )
}

const EmptyChatState = () => {
  return (
    <div className='hidden-on-mobile empty-chat-state'>
      <div
        style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'var(--secondary)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}
      >
        <MessageSquare size={40} color="var(--primary)" />
      </div>
      <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '12px' }}>
        Welcome to ChatFlow
      </h2>
      <p style={{ fontSize: '15px', color: 'var(--text-dim)', maxWidth: '300px', lineHeight: '1.5' }}>
        Select a conversation from the sidebar to start messaging, or start a new chat.
      </p>
    </div>
  );
};

export function SingleChatWindow({ handleSetActiveChat }) {
  const { activeChat, messages, messagesLoading, sendMessage } = useChat();
  const { user } = useUser();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!messagesLoading) {
      scrollToBottom();
    }
  }, [messagesLoading, messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      content: inputValue,
      image: null,
      sender: user._id,
      channelId: activeChat._id,
    };

    setInputValue('');
    await sendMessage(newMessage);
    scrollToBottom();
  };

  return (
    <div className={`chat-window section-right ${activeChat ? 'active' : 'hidden-on-mobile'}`}>
      <header className="chat-header">
        <div className="chat-header-info">
          <div type="button" className="back-button hidden-on-desktop" onClick={handleSetActiveChat}>
            <ArrowLeft />
          </div>
          <img
            src={activeChat?.users[0]?.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
            alt="image"
            className="chat-header-avatar"
          />
          <div className="chat-header-text">
            <h3>{activeChat?.users[0]?.name}</h3>
            <div>@{activeChat?.users[0]?.username}</div>
          </div>
        </div>
        <div className="chat-header-actions">
          <Info className="header-icon" size={20} />
        </div>
      </header>

      <div className="chat-messages">
        {messages?.length > 0 ? (messages?.map((msg, index) => (
          <MessageBubble
            key={index}
            text={msg.content}
            time={msg.createdAt}
            isOwnMessage={msg.sender._id === user._id}
          />
        ))) : (
          <div className='date-divider'>
            <span style={{ fontSize: '.8rem' }}>No messages yet. Start the conversation!</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="chat-input-area">
        <form className="input-wrapper" onSubmit={handleSend}>
          <Paperclip className="header-icon" size={20} style={{ cursor: 'pointer' }} />
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="input-actions">
            <Smile className="header-icon" size={20} style={{ cursor: 'pointer', marginRight: 8 }} />
            {inputValue.trim() ? (
              <button type="submit" className="send-button"><Send size={18} /></button>
            ) : (
              <Mic className="header-icon" size={22} style={{ cursor: 'pointer', marginRight: 8 }} />
            )}
          </div>
        </form>
      </footer>
    </div>
  );
};

export function GroupChatWindow({ handleSetActiveChat }) {
  const { activeChat, messages, messagesLoading, sendMessage } = useChat();
  const { user } = useUser();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!messagesLoading) {
      scrollToBottom();
    }
  }, [messagesLoading, messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      content: inputValue,
      sender: user._id,
      channelId: activeChat._id,
    };

    setInputValue('');
    await sendMessage(newMessage);
    scrollToBottom();
  };

  return (
    <div className={`chat-window section-right ${activeChat ? 'active' : 'hidden-on-mobile'}`}>
      {/* HEADER */}
      <header className="chat-header">
        <div className="chat-header-info">
          <div type="button" className="back-button hidden-on-desktop" onClick={handleSetActiveChat}>
            <ArrowLeft />
          </div>
          <div 
            className="chat-header-avatar" 
            style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              backgroundColor: 'var(--secondary)', 
              color: 'var(--primary)',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            {activeChat?.channelName?.charAt(0).toUpperCase() || "G"}
          </div>
          <div className="chat-header-text">
            <h3>{activeChat?.channelName || "Group Chat"}</h3>
            <p>{activeChat?.users?.length + 1} members</p>
          </div>
        </div>

        <div className="chat-header-actions">
          <Info className="header-icon" size={20} />
        </div>
      </header>

      {/* MESSAGES LIST */}
      <div className="chat-messages">
        {messages?.length > 0 ? (messages.map((msg, index) => (
          <MessageBubble
            key={index}
            text={msg.content}
            time={msg.createdAt}
            isOwnMessage={msg.sender._id === user._id}
            username={msg.sender.username}
          />
        ))) : (
          <div className='date-divider'>
            <span style={{ fontSize: '.8rem' }}>No messages yet. Start the conversation!</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT FOOTER */}
      <footer className="chat-input-area">
        <form className="input-wrapper" onSubmit={handleSend}>
          <Paperclip className="header-icon" size={20} style={{ cursor: 'pointer' }} />
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="input-actions">
            <Smile className="header-icon" size={20} style={{ cursor: 'pointer', marginRight: 8 }} />
            {inputValue.trim() ? (
              <button type="submit" className="send-button"><Send size={18} /></button>
            ) : (
              <Mic className="header-icon" size={22} style={{ cursor: 'pointer', marginRight: 8 }} />
            )}
          </div>
        </form>
      </footer>
    </div>
  );
};