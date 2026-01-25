import { Box, Typography, Avatar } from '@mui/material';
import { Check, CheckCheck, Paperclip } from 'lucide-react'; // Icons
import { useChat } from '../context/Chat';
import ErrorPage from './ErrorPage';
import { formatTime } from '../utils/formatTime';
import defaultUserAvatar from '../assets/default_user_avatar.jpg';
import { deepOrange, deepPurple } from '@mui/material/colors';

export default function ChatListItems() {
  const { chats, activeChat, chatLoading, chatError } = useChat();
  // console.log("ChatListItems - chats ", chatLoading);
  // if (chats) {
  //   chats.forEach(chat => {
  //     console.log(`${chat.users[0].name} => Latest: ${chat.latestMessage ? chat.latestMessage.content : 'No messages yet.'}`);
  //   })
  // } else {
  //   console.log("Chat is null");
  // }

  if (chatLoading) {
    return (
      <div className="chat-list-items" style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Typography variant="body1" sx={{ color: 'var(--text-dim)', marginTop: '3rem' }}>
          Loading chats...
        </Typography>
      </div>
    )
  }

  if (chatError) {
    return <ErrorPage error={chatError} />;
  }

  if (chats.length === 0) {
    return (
      <div className="chat-list-items" style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        // justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
        <Typography variant="body1" sx={{
          maxWidth: '50%',
          color: 'var(--text-dim)', textAlign: 'center', marginTop: '3rem', fontWeight: 600, marginLeft: '-30px'
        }}>
          Add your first chat to get started!
        </Typography>
      </div>
    )
  }

  return (
    <div className="chat-list-items" style={{
      flex: 1,
      overflowY: 'auto',
    }}>
      {chats.map((contact, index) => {
        return (
          <ChatListItem
            key={index}
            chat={contact}
            isActive={contact._id === activeChat?._id}
            // setActiveChat={setActiveChat}
          />
        )
      })}
    </div>
  )
}


export const ChatListItem = ({ chat, isActive }) => {
  const { setActiveChatId } = useChat();
  
  const handleSetActiveChat = () => {
    setActiveChatId(chat._id);
  };

  // Helper to determine if we should show bold text
  const isUnread = 0;
  let isTyping = false;

  return (
    <Box
      onClick={handleSetActiveChat}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        cursor: 'pointer',
        borderRadius: '12px',
        margin: '4px 8px',
        transition: 'background-color 0.2s ease',
        // 1. Background Color Logic
        backgroundColor: isActive ? 'var(--secondary)' : 'transparent',
        // 2. Hover Effect
        '&:hover': {
          backgroundColor: isActive ? 'var(--secondary)' : 'rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      {/* LEFT: AVATAR & ONLINE STATUS */}
      <Box sx={{ position: 'relative', marginRight: '16px' }}>
        {chat.isGroupChannel ? (
          <Avatar sx={{ bgcolor: deepPurple[500] }}>G</Avatar>
        ) : (
          <Avatar
          src={chat.users[0]?.avatar || defaultUserAvatar}
          alt={chat.icon}
          sx={{ width: 48, height: 48, border: '1px solid var(--border-color)' }}
        />
        )}
        {/* Online Status Dot */}
        {/* {chat.status === 'online' && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 12,
              height: 12,
              backgroundColor: '#10B981', // Emerald Green
              borderRadius: '50%',
              border: '2px solid white',
            }}
          />
        )} */}
      </Box>

      {/* MIDDLE: NAME & MESSAGE PREVIEW */}
      <Box sx={{ flex: 1, minWidth: 0 /* Fixes flex text overflow */ }}>
        {/* Name Row */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: isUnread ? 700 : 600, // Bolder if unread
            color: 'var(--text-main)',
            lineHeight: 1.2,
            marginBottom: '4px'
          }}
        >
          {chat.isGroupChannel ? chat.channelName : chat.users[0].name}
        </Typography>

        {/* Message Preview Row or Latest message */}
        <Typography
          variant="body2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: chat.status === 'typing' ? '#10B981' : 'var(--text-dim)', // Green if typing
            fontWeight: isUnread || chat.status === 'typing' ? 600 : 400,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {isTyping ? (
            'Typing...'
          ) : (
            <>
              {chat.hasAttachment && (
                <Paperclip size={14} style={{ marginRight: 4, flexShrink: 0 }} />
              )}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {chat.latestMessage ? chat.latestMessage.content : 'No messages yet.'}
              </span>
            </>
          )}
        </Typography>
      </Box>

      {/* RIGHT: TIME & UNREAD BADGE */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          marginLeft: '8px',
          minWidth: '50px'
        }}
      >
        {/* Time */}
        <Typography
          variant="caption"
          sx={{
            color: isUnread ? 'var(--primary)' : 'var(--text-dim)',
            fontWeight: isUnread ? 600 : 400,
            marginBottom: '6px'
          }}
        >
          {formatTime(chat.updatedAt)}
        </Typography>

        {/* Unread Count Badge */}
        {chat.unreadCount > 0 ? (
          <Box
            sx={{
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 'bold',
              minWidth: '20px',
              height: '20px',
              borderRadius: '10px', // Pill shape
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 6px',
            }}
          >
            {chat.unreadCount}
          </Box>
        ) : (
          /* Read Receipts (Optional: Only show if it's NOT a group and NO unread messages) */
          !chat.isGroupChannel && (
            <Box sx={{ color: 'var(--text-dim)' }}>
              {/* Logic: You would usually check 'chat.lastMessageIsOwn' here */}
              <CheckCheck size={16} />
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

