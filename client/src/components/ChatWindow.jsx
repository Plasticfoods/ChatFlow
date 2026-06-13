import { useState, useEffect, useRef } from 'react';
import {
  Info,
  Smile,
  Mic,
  Send,
  ArrowLeft,
  MessageSquare,
  Paperclip,
  X,
  FileText
} from 'lucide-react';
import Loader from './Loader.jsx';
import MessageBubble from './MessageBubble.jsx';
import './ChatWindow.css';
import { useChat } from '../context/Chat.jsx';
import ErrorPage from './ErrorPage.jsx';
import { useUser } from '../context/User.jsx';
import ChatInfoDrawer from './ChatInfoDrawer.jsx';
import { useSnackbar } from '../context/Snackbar.jsx';
// Import UploadThing Button
import { UploadButton } from "../utils/uploadthing";
import "@uploadthing/react/styles.css";
import { ChatWindowSkeleton } from './SkeletonLoader.jsx';
import { useOnlineUsers } from '../context/OnlineUsers.jsx';
import { DEFAULT_AVATAR } from '../utils/avatarUtils';

export default function ChatWindow() {
  const { activeChat, setActiveChatId, messagesLoading, messagesError } = useChat();
  const [openChatInfo, setOpenChatInfo] = useState(false);

  const handleSetActiveChat = () => {
    setActiveChatId(null);
  }

  const handleOpenChatInfo = () => {
    setOpenChatInfo(true);
  }

  if (messagesLoading) {
    return <Loader message='fetching messages...' overlay={false} className='section-right active' />;
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
        <SingleChatWindow handleSetActiveChat={handleSetActiveChat} handleOpenChatInfo={handleOpenChatInfo} />
      ) : (
        <SingleChatWindow handleSetActiveChat={handleSetActiveChat} handleOpenChatInfo={handleOpenChatInfo} />
      )}
      <ChatInfoDrawer open={openChatInfo} onClose={() => setOpenChatInfo(false)} chat={activeChat} />
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

export function SingleChatWindow({ handleSetActiveChat, handleOpenChatInfo }) {
  const { activeChat, messages, messagesLoading, sendMessage, activeChatId } = useChat();
  const { user } = useUser();
  const { isUserOnline } = useOnlineUsers();
  const [inputValue, setInputValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [attachment, setAttachment] = useState(null); // URL of uploaded file
  const [attachmentType, setAttachmentType] = useState(null); // 'image' or 'pdf'
  const messagesEndRef = useRef(null);
  const lastChatIdRef = useRef(null);
  const { showSnackbar } = useSnackbar();

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (!messagesLoading) {
      if (lastChatIdRef.current !== activeChatId) {
        scrollToBottom("auto");
        lastChatIdRef.current = activeChatId;
      } else {
        scrollToBottom("smooth");
      }
    }
  }, [messagesLoading, messages, activeChatId]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim() && !attachment) return;

    const newMessage = {
      content: inputValue,
      attachment: attachment,
      attachmentType: attachmentType,
      sender: user,
      channelId: activeChatId,
    };

    setInputValue('');
    setAttachment(null); // Clear preview
    setAttachmentType(null);
    await sendMessage(newMessage);
    scrollToBottom();
  };

  // Handle File Upload Completion
  const handleUploadComplete = async (res) => {
    if (res && res.length > 0) {
      const fileUrl = res[0].url;
      const fileName = res[0].name || fileUrl;
      const isImage = fileName.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;

      setAttachment(fileUrl);
      setAttachmentType(isImage ? 'image' : 'file');
      setInputValue("Sent an attachment");
      setIsUploading(false);
    }
  };

  const handleUploadError = (error) => {
    showSnackbar(`Error uploading file: ${error.message}`, 'error');
    setIsUploading(false);
  };

  return (
    <div className={`chat-window section-right ${activeChat ? 'active' : 'hidden-on-mobile'}`}>
      <header className="chat-header">
        <div className="chat-header-info">
          <div type="button" className="back-button hidden-on-desktop" onClick={handleSetActiveChat}>
            <ArrowLeft />
          </div>
          <div className="chat-header-avatar-wrapper">
            <img
              src={activeChat?.users[0]?.avatar || DEFAULT_AVATAR}
              onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
              alt="image"
              className="chat-header-avatar"
            />
            {!activeChat.isGroupChannel && isUserOnline(activeChat?.users[0]?._id) && (
              <span className="header-online-dot"></span>
            )}
          </div>
          {activeChat.isGroupChannel ? (
            <div className="chat-header-text">
              <h3>{activeChat?.channelName || "Group Chat"}</h3>
              <p>{activeChat?.users?.length + 1} members</p>
            </div>
          ) : (
            <div className="chat-header-text">
              <h3>{activeChat?.users[0]?.name}</h3>
              <div>@{activeChat?.users[0]?.username}</div>
            </div>
          )}
        </div>
        <div className="chat-header-actions">
          <Info className="header-icon" size={20} onClick={handleOpenChatInfo} />
        </div>
      </header>

      <div className="chat-messages">
        {messages?.length > 0 ? (messages?.map((msg, index) => (
          <MessageBubble
            key={msg._id || index}
            text={msg.content}
            attachment={msg.attachment} // Pass the attachment prop
            time={msg.createdAt}
            isOwnMessage={msg.sender._id === user._id}
            username={msg.sender.username}
            isGroupChat={activeChat.isGroupChannel}
            attachmentType={msg.attachmentType}
            isDelivered={!!msg._id}
          />
        ))) : (
          <div className='date-divider'>
            <span style={{ fontSize: '.8rem' }}>No messages yet. Start the conversation!</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="chat-input-area">
        {/* PREVIEW SECTION */}
        {attachment && (
          <div className="attachment-preview-container">
            <div className="preview-box">
              {attachmentType === 'image' ? (
                <img src={attachment} alt="preview" className="preview-image" />
              ) : (
                <div className="preview-file">
                  <FileText size={24} />
                  <span>Document attached</span>
                </div>
              )}
              <button
                className="remove-attachment-btn"
                onClick={() => { setAttachment(null); setAttachmentType(null); }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="input-wrapper">

          {/* Upload Button Integration */}
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
            {isUploading ? (
              <span style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: 600 }}>Uploading...</span>
            ) : (
              <UploadButton
                endpoint="chatAttachment"
                onUploadBegin={() => setIsUploading(true)}
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                appearance={{
                  button: {
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    padding: 0,
                    width: 'auto',
                    height: 'auto',
                    fontSize: '0', // Hide text
                  },
                  allowedContent: { display: 'none' } // Hide "Images up to 4MB"
                }}
                content={{
                  button: <Paperclip className="header-icon" size={20} style={{ cursor: 'pointer' }} />
                }}
              />
            )}
            {/* Attachment preview after attachment is selected */}
            {/* {attachment && (
                <div className="attachment-preview">
                  <img src={attachment} alt="attachment preview" className="attachment-preview-image" />
                </div>
             )} */}
          </div>

          <form style={{ display: 'flex', flex: 1, alignItems: 'center' }} onSubmit={handleSend}>
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="input-actions">
              <button type="submit" className="send-button"><Send size={20} /></button>
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
};

export function GroupChatWindow({ handleSetActiveChat, handleOpenChatInfo }) {
  // Use global context messages instead of local state
  const { activeChat, messages, messagesLoading, sendMessage } = useChat();
  const { user } = useUser();
  const [inputValue, setInputValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const lastChatIdRef = useRef(null);

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (!messagesLoading) {
      if (lastChatIdRef.current !== activeChat._id) {
        scrollToBottom("auto");
        lastChatIdRef.current = activeChat._id;
      } else {
        scrollToBottom("smooth");
      }
    }
  }, [messagesLoading, messages, activeChat]);

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

  const handleUploadComplete = async (res) => {
    if (res && res.length > 0) {
      const fileUrl = res[0].url;
      const newMessage = {
        content: "Sent an attachment",
        image: fileUrl,
        sender: user._id,
        channelId: activeChat._id,
      };
      await sendMessage(newMessage);
      setIsUploading(false);
      scrollToBottom();
    }
  };

  const handleUploadError = (error) => {
    setIsUploading(false);
  };

  return (
    <div className={`chat-window section-right ${activeChat ? 'active' : 'hidden-on-mobile'}`}>
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
          <Info className="header-icon" size={20} onClick={handleOpenChatInfo} />
        </div>
      </header>

      <div className="chat-messages">
        {messages?.length > 0 ? (messages.map((msg, index) => (
          <MessageBubble
            key={index}
            text={msg.content}
            attachment={msg.attachment} // Pass image prop
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

      <footer className="chat-input-area">
        <div className="input-wrapper">
          {/* Upload Button for Group Chat */}
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
            {isUploading ? (
              <span style={{ fontSize: '10px', color: 'var(--primary)' }}>Uploading...</span>
            ) : (
              <UploadButton
                endpoint="chatAttachment"
                onUploadBegin={() => setIsUploading(true)}
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                appearance={{
                  button: { background: 'transparent', color: 'var(--text-muted)', padding: 0, width: 'auto', height: 'auto', fontSize: '0' },
                  allowedContent: { display: 'none' }
                }}
                content={{
                  button: <Paperclip className="header-icon" size={20} style={{ cursor: 'pointer' }} />
                }}
              />
            )}
          </div>

          <form style={{ display: 'flex', flex: 1, alignItems: 'center' }} onSubmit={handleSend}>
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="input-actions">
              <button type="submit" className="send-button"><Send size={20} /></button>
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
};