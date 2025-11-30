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
];