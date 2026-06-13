import { Box, Skeleton, Stack } from '@mui/material';

// Represents a single chat item skeleton
const ChatItemSkeleton = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      p: 2,
      // borderBottom: '1px solid var(--border-color)', // Matching your app's border style
      width: '100%',
    }}
  >
    {/* Avatar Skeleton */}
    <Skeleton
      variant="circular"
      width={48}
      height={48}
      sx={{ mr: 2, flexShrink: 0, bgcolor: 'var(--secondary)' }} // Slightly visible grey
    />

    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        {/* Name Skeleton */}
        <Skeleton 
            variant="text" 
            width="60%" 
            height={20} 
            sx={{ bgcolor: 'var(--border-color)' }} 
        />
        {/* Time Skeleton */}
        <Skeleton 
            variant="text" 
            width={40} 
            height={16} 
            sx={{ bgcolor: 'var(--border-color)' }} 
        />
      </Box>
      
      {/* Last Message Skeleton */}
      <Skeleton 
        variant="text" 
        width="85%" 
        height={16} 
        sx={{ bgcolor: 'var(--border-color)' }} 
      />
    </Box>
  </Box>
);

export function SkeletonChatLoader({ count = 6 }) {
  return (
    <Stack spacing={0}>
      {Array.from(new Array(count)).map((_, index) => (
        <ChatItemSkeleton key={index} />
      ))}
    </Stack>
  );
}

// --- Message Bubble Skeleton ---
const MessageSkeleton = ({ align = 'left' }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      mb: 2,
    }}
  >
    <Skeleton
      variant="rounded"
      width={align === 'right' ? '40%' : '35%'}
      height={40}
      sx={{
        borderRadius: 2,
        borderTopLeftRadius: align === 'left' ? 0 : 2,
        borderTopRightRadius: align === 'right' ? 0 : 2,
      }}
    />
  </Box>
);

// --- Chat Window Skeleton ---
export const ChatWindowSkeleton = () => (
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'var(--bg-main)',
      height: '100%',
    }}
  >
    {/* Chat Header */}
    <Box
      sx={{
        height: 70,
        p: 2,
        borderBottom: '1px solid var(--border-color)',
        bgcolor: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
      <Box>
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="text" width={80} height={16} />
      </Box>
    </Box>

    {/* Message Area */}
    <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <MessageSkeleton align="left" />
      <MessageSkeleton align="left" />
      <MessageSkeleton align="right" />
      <MessageSkeleton align="left" />
      <MessageSkeleton align="right" />
      <MessageSkeleton align="right" />
      <MessageSkeleton align="right" />
    </Box>

    {/* Input Area */}
    <Box sx={{ p: 2, bgcolor: 'var(--bg-surface)' }}>
      <Skeleton variant="rounded" height={30} sx={{ borderRadius: '25px' }} />
    </Box>
  </Box>
);

