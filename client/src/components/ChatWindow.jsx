import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  Video, 
  Info, 
  Smile, 
  Paperclip, 
  Mic, 
  Send,
  ArrowLeft  
} from 'lucide-react';
import MessageBubble from './MessageBubble'; 
import './ChatWindow.css';

// Constants to simulate user identities
const CURRENT_USER_ID = "me";
const CHAT_PARTNER_ID = "Sarah Jenkins";

const ChatWindow = () => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Updated Data Structure: Only text, sender, receiver, time
  const [messages, setMessages] = useState([
    { 
      text: "Hi there! I was reviewing the new project proposal you sent over.", 
      sender: CHAT_PARTNER_ID, 
      receiver: CURRENT_USER_ID, 
      time: "10:30 AM" 
    },
    { 
      text: "It looks really solid, especially the timeline section.", 
      sender: CHAT_PARTNER_ID, 
      receiver: CURRENT_USER_ID, 
      time: "10:31 AM" 
    },
    { 
      text: "Glad you liked it! I put a lot of focus on realistic deadlines this time.", 
      sender: CURRENT_USER_ID, 
      receiver: CHAT_PARTNER_ID, 
      time: "10:32 AM" 
    },
    { 
      text: "Also, here are the updated assets for the landing page.", 
      sender: CHAT_PARTNER_ID, 
      receiver: CURRENT_USER_ID, 
      time: "10:35 AM" 
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Create new message strictly following the requested attributes
    const newMessage = {
      text: inputValue,
      sender: CURRENT_USER_ID,
      receiver: CHAT_PARTNER_ID,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  return (
    <div className="chat-window hidden-on-mobile">
      
      {/* HEADER */}
      <header className="chat-header">
        <div className="chat-header-info">
          {/* Clickable back arrow button for mobile view */}
          <div type="button" className="back-button hidden-on-desktop">
            <ArrowLeft /> 
          </div>
          <img 
            src="https://i.pravatar.cc/150?u=1" 
            alt="Sarah" 
            className="chat-header-avatar" 
          />
          <div className="chat-header-text">
            <h3>{CHAT_PARTNER_ID}</h3>
            <p>Online</p>
          </div>
        </div>

        <div className="chat-header-actions">
          <Info className="header-icon" size={20} />
        </div>
      </header>

      {/* MESSAGES LIST */}
      <div className="chat-messages">
        <div className="date-divider">
          <span>Today</span>
        </div>

        {messages.map((msg, index) => (
          <MessageBubble
            // Using index as key because 'id' was removed from the data structure
            key={index} 
            text={msg.text}
            time={msg.time}
            // Derive ownership by comparing sender to current user
            isOwnMessage={msg.sender === CURRENT_USER_ID}
            // Note: isRead is not in the data, so we omit passing it (or pass logic if needed)
          />
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT FOOTER */}
      <footer className="chat-input-area">
        <form className="input-wrapper" onSubmit={handleSend}>
          <Paperclip 
            className="header-icon" 
            size={20} 
            style={{ cursor: 'pointer' }} 
          />
          
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <div className="input-actions">
            <Smile 
              className="header-icon" 
              size={20} 
              style={{ cursor: 'pointer', marginRight: 8 }} 
            />
            
            {inputValue.trim() ? (
              <button type="submit" className="send-button">
                <Send size={18} />
              </button>
            ) : (
              <Mic 
                className="header-icon" 
                size={22} 
                style={{ cursor: 'pointer', marginRight: 8 }} 
              />
            )}
          </div>
        </form>
      </footer>

    </div>
  );
};

export default ChatWindow;