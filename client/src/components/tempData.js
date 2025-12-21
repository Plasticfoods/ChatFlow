export const chatData = [
  {
    id: 1,
    name: "Sarah Jenkins",
    avatar: "https://i.pravatar.cc/150?u=1", // Random avatar generator
    lastMessage: "Hi there! I was reviewing the new project proposal...",
    time: "10:42 AM",
    unreadCount: 0,
    status: "typing", // Special status
    isGroup: false,
  },
  {
    id: 2,
    name: "Design Team",
    avatar: "https://ui-avatars.com/api/?name=DT&background=random", // Initials for group
    lastMessage: "Alex: Can you share the Figma file?",
    time: "09:30 AM",
    unreadCount: 3, // Unread!
    status: "none",
    isGroup: true,
  },
  {
    id: 3,
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?u=3",
    lastMessage: "Sounds good, let's meet then.",
    time: "Yesterday",
    unreadCount: 0,
    status: "online",
    isGroup: false,
  },
  {
    id: 4,
    name: "Project Alpha",
    avatar: "https://ui-avatars.com/api/?name=PA&background=2F80ED&color=fff",
    lastMessage: "You: I've uploaded the assets.",
    time: "Yesterday",
    unreadCount: 0,
    status: "none",
    isGroup: true,
  },
  {
    id: 5,
    name: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?u=5",
    lastMessage: "Sent an attachment.",
    time: "Mon",
    unreadCount: 1,
    status: "offline",
    isGroup: false,
    hasAttachment: true, // Optional detail
  },
  {
    id: 2,
    name: "Design Team",
    avatar: "https://ui-avatars.com/api/?name=DT&background=random", // Initials for group
    lastMessage: "Alex: Can you share the Figma file?",
    time: "09:30 AM",
    unreadCount: 3, // Unread!
    status: "none",
    isGroup: true,
  },
  {
    id: 3,
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?u=3",
    lastMessage: "Sounds good, let's meet then.",
    time: "Yesterday",
    unreadCount: 0,
    status: "online",
    isGroup: false,
  },
  {
    id: 4,
    name: "Project Alpha",
    avatar: "https://ui-avatars.com/api/?name=PA&background=2F80ED&color=fff",
    lastMessage: "You: I've uploaded the assets.",
    time: "Yesterday",
    unreadCount: 0,
    status: "none",
    isGroup: true,
  },
  {
    id: 5,
    name: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?u=5",
    lastMessage: "Sent an attachment.",
    time: "Mon",
    unreadCount: 1,
    status: "offline",
    isGroup: false,
    hasAttachment: true, // Optional detail
  },
  {
    id: 6,
    name: "Design Team",
    avatar: "https://ui-avatars.com/api/?name=DT&background=random", // Initials for group
    lastMessage: "Alex: Can you share the Figma file?",
    time: "09:30 AM",
    unreadCount: 3, // Unread!
    status: "none",
    isGroup: true,
  },
  {
    id: 7,
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?u=3",
    lastMessage: "Sounds good, let's meet then.",
    time: "Yesterday",
    unreadCount: 0,
    status: "online",
    isGroup: false,
  },
  {
    id: 8,
    name: "Project Alpha",
    avatar: "https://ui-avatars.com/api/?name=PA&background=2F80ED&color=fff",
    lastMessage: "You: I've uploaded the assets.",
    time: "Yesterday",
    unreadCount: 0,
    status: "none",
    isGroup: true,
  },
  {
    id: 9,
    name: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?u=5",
    lastMessage: "Sent an attachment.",
    time: "Mon",
    unreadCount: 1,
    status: "offline",
    isGroup: false,
    hasAttachment: true, // Optional detail
  },
  {
    id: 9,
    name: "Design Team",
    avatar: "https://ui-avatars.com/api/?name=DT&background=random", // Initials for group
    lastMessage: "Alex: Can you share the Figma file?",
    time: "09:30 AM",
    unreadCount: 3, // Unread!
    status: "none",
    isGroup: true,
  },
  {
    id: 10,
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?u=3",
    lastMessage: "Sounds good, let's meet then.",
    time: "Yesterday",
    unreadCount: 0,
    status: "online",
    isGroup: false,
  },
  {
    id: 11,
    name: "Project Alpha",
    avatar: "https://ui-avatars.com/api/?name=PA&background=2F80ED&color=fff",
    lastMessage: "You: I've uploaded the assets.",
    time: "Yesterday",
    unreadCount: 0,
    status: "none",
    isGroup: true,
  },
  {
    id: 12,
    name: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?u=5",
    lastMessage: "Sent an attachment.",
    time: "Mon",
    unreadCount: 1,
    status: "offline",
    isGroup: false,
    hasAttachment: true, // Optional detail
  },
];

export const groupChatData = {
  name: "Marketing Team",
  avatar: "https://ui-avatars.com/api/?name=MT&background=random",
  messages: [
    {
      sender: "user_101",
      text: "Hey everyone, are we still on for the design review at 3 PM?",
    },
    {
      sender: "user_102",
      text: "Yes, I am finalizing the slide deck right now.",
    },
    {
      sender: "me",
      text: "I might be a few minutes late, finishing up a client call.",
    },
    {
      sender: "user_101",
      text: "No worries! We can start with the frontend updates while we wait.",
    },
    {
      sender: "me",
      text: "Has anyone checked the latest Figma file? The new color palette is in.",
    },
    {
      sender: "user_102",
      text: "I just saw it. The 'Sunset Orange' theme looks great.",
    },
    {
      sender: "user_105",
      text: "I'll start updating the CSS variables to match the new hex codes.",
    },
    {
      sender: "user_104",
      text: "Awesome. Let me know if you need the assets exported.",
    },
    {
      sender: "me",
      text: "Okay, jumping on the call now. See you in a bit!",
    },
    {
      sender: "user_101",
      text: "Great, see you there.",
    },
  ],
};
