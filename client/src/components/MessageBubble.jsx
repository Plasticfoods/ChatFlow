import { Check, CheckCheck } from 'lucide-react'; // Import icons
import './MessageBubble.css'; // Import the styles
import { formatTime } from "../utils/formatTime.js";

const MessageBubble = ({ text, attachment, time, isOwnMessage, username, isGroupChat, attachmentType, isDelivered }) => {
  const containerClass = isOwnMessage ? 'sent' : 'received';

  return (
    <div className={`message-bubble-container ${containerClass}`}>
      {(username && !isOwnMessage && isGroupChat) && <div className='message-username'>{`@${username}`}</div>}

      <div className="message-bubble">

        {/* Render Attachment */}
        {attachment && (
          attachmentType != 'file' ? (<div className="message-attachment">
            <a href={attachment} target="_blank" rel="noopener noreferrer" className="file-attachment-link">
              <img src={attachment} alt="image" />
            </a>
          </div>) : (
            <div className="file-preview-box">
              <a href={attachment} target="_blank" rel="noopener noreferrer" className="file-attachment-link">
                <div className="pdf-attachment">
                  <span role="img" aria-label="pdf">📄</span>
                  <span className="pdf-text">View PDF Document</span>
                </div>
              </a>
            </div>
          )
        )}

        {/* The Main Message Text */}
        {text && <div className="message-text">{text}</div>}

        {/* Timestamp & Delivery Status */}
        <div className="message-meta">
          <span className="timestamp">{formatTime(time)}</span>

          {/* Delivery tick — only on own messages */}
          {isOwnMessage && (
            <span className={`read-receipt ${isDelivered ? 'delivered' : 'pending'}`}>
              {isDelivered ? (
                <CheckCheck size={14} />
              ) : (
                <Check size={14} />
              )}
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

export default MessageBubble;