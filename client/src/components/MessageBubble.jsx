import { Check, CheckCheck } from 'lucide-react'; // Import icons
import './MessageBubble.css'; // Import the styles

const MessageBubble = ({ text, time, isOwnMessage, isRead }) => {
  // Decide which class to apply based on who sent it
  const containerClass = isOwnMessage ? 'sent' : 'received';

  return (
    <div className={`message-bubble-container ${containerClass}`}>
      <div className="message-bubble">
        
        {/* 1. The Main Message Text */}
        <div className="message-text">{text}</div>
        
        {/* 2. Timestamp & Read Status */}
        <div className="message-meta">
          <span className="timestamp">{time}</span>
          
          {/* Only show read receipts on MY messages */}
          {/* {isOwnMessage && (
            <span className="read-receipt">
              {isRead ? (
                <CheckCheck size={14} /> 
              ) : (
                <Check size={14} color="var(--text-dim)" />
              )}
            </span>
          )} */}
        </div>

      </div>
    </div>
  );
};

export default MessageBubble;