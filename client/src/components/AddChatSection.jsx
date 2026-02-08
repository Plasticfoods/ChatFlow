import {
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText, Avatar, Modal, Box, Typography, Drawer
} from '@mui/material';
import { useState } from 'react';
import { MessageCircleCode, MessageSquarePlus, ChevronLeft, AtSign, Users, Mail, ChevronRight, Camera } from 'lucide-react';
import { ChatListSearch } from './ChatList.jsx';
import UserSearchDrawer from './UserSearchDrawer.jsx';
import CreateGroupDrawer from './CreateGroupDrawer.jsx';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';
import { useSnackbar } from '../context/Snackbar.jsx';
import axios from 'axios';
import ErrorPage from './ErrorPage.jsx';
import { useChat } from '../context/Chat.jsx';
import Loader from './Loader.jsx';

export default function AddChatSection({ chats, setShowAddChatSection }) {

  const [searchTerm, setSearchTerm] = useState('')
  const [openUserSearchDrawer, setOpenUserSearchDrawer] = useState(false);
  const [oepnGroupDrawer, setOpenGroupDrawer] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [error, setError] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const { setNewChatAdded } = useChat();

  if (error) {
    return <ErrorPage error={error} />;
  }

  if(isAddingUser) {
    return <Loader message="Adding user to contacts..." />;
  }

  // const [filterType, setFilterType] = useState('all'); // 'all', 'unread', 'groupchat'

  // // 1. Handle Tab Change
  // const handleTabChange = (event, newValue) => {
  //     setFilterType(newValue);
  // };

  // // 2. The Smart Filter Logic
  // const filteredChats = chats.filter(chat => {
  //     // First, check if it matches the search text
  //     const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase());

  //     // Then, check if it matches the active Tab
  //     if (filterType === 'unread') {
  //         return matchesSearch && chat.unreadCount > 0;
  //     }
  //     if (filterType === 'groupchat') {
  //         return matchesSearch && chat.isGroup === true;
  //     }
  //     // Default 'all'
  //     return matchesSearch;
  // });

  const handleAddUser = async (otherUser) => {
    setError(null);
    setIsAddingUser(true);
    try {
      const { data } = await axios.post('/api/channel', { otherUser });
      setOpenUserSearchDrawer(false);
      showSnackbar(`${data.message}`, "success");
      setNewChatAdded(true); // Trigger chat list refresh
    } catch (err) {
      if (err.response && err.response.status >= 500) {
        // Catch 500, 502, 503, 504, etc.
        setError(err);
        return;
      }
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/login');
        showSnackbar("Session expired. Please log in again.", "info");
        return;
      }
      if (err.response && err.status != "404") {
        showSnackbar(err.response.statusText, "info");
      } else {
        setError(err);
      }
    } finally {
      setIsAddingUser(false);
    }
  }

  const handleQRScanSuccess = async (decodedText, decodedResult) => {
    //setShowQRScanner(false);
    const data = JSON.parse(decodedText);
    if (data.action === 'add_user' && data.user) {
      handleAddUser(data.user);
    } else {
      console.warn("Invalid QR code data:", data);
      showSnackbar("Something Went Wrong", "info");
    }
  }

  return (
    <div className="chat-list new-chat-section" style={{
      display: 'flex',
      flexDirection: 'column',
    }}>
      <header>
        <div className='hidden-on-mobile' style={{ display: 'flex', justifyContent: 'start', padding: '1rem 1.4rem', gap: '15px', alignItems: 'center' }}>
          <ChevronLeft color='var(--text-main)' size={30} sx={{ cursor: 'pointer' }} onClick={() => setShowAddChatSection(false)} />
          <h4 style={{ fontSize: '1.5rem', fontWeight: '500', color: 'var(--text-main)' }}>New Chat</h4>
        </div>
        <ChatListSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} style={{ cursor: 'pointer' }} />
      </header>

      <List sx={{ px: 1 }}>
        {[
          { icon: AtSign, label: "Find by Username", onClick: () => setOpenUserSearchDrawer(true) },
          { icon: Mail, label: "Find by Email", onClick: () => setOpenUserSearchDrawer(true) },
          { icon: Users, label: "Create Group", onClick: () => setOpenGroupDrawer(true) },
          { icon: Camera, label: "Scan QR Code", onClick: () => setShowQRScanner(true) },
        ].map((opt, idx) => (
          <ListItemButton
            key={idx}
            sx={{ borderRadius: 'var(--radius-md)', mb: 0.5, '&:hover': { bgcolor: 'var(--secondary)' } }}
            onClick={opt.onClick}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'var(--secondary)', color: 'var(--primary)', width: 40, height: 40 }}>
                <opt.icon size={20} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={opt.label} primaryTypographyProps={{ fontWeight: 500, color: 'var(--text-main)' }} />
            <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
          </ListItemButton>
        ))}
      </List>

      <UserSearchDrawer openUserSearchDrawer={openUserSearchDrawer} setOpenUserSearchDrawer={setOpenUserSearchDrawer} />
      <CreateGroupDrawer open={oepnGroupDrawer} onClose={() => setOpenGroupDrawer(false)} />
      {showQRScanner && <QRScanner onScanSuccess={handleQRScanSuccess} onClose={() => setShowQRScanner(false)} />}
    </div>
  )
}

const QRScanner = ({ onScanSuccess, onClose }) => {
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    // Note: 'reader' matches the ID in the HTML below
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 15,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    });

    scanner.render(onScanSuccess, (error) => {
      // Internal library errors (usually just "QR not found in frame")
      onClose(); // Close scanner on any error to avoid trapping user
      console.warn("QR Scan Error:", error);
      showSnackbar("Failed to scan QR code", "error");
    });

    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner", err));
    };
  }, [onScanSuccess]);

  return (
    <div className="scanner-overlay">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Scan QR Code</h2>
        <p className="text-sm opacity-80">Align the QR code inside the scanning box</p>
      </div>

      {/* This is where the camera feed injects */}
      <div id="reader"></div>

      <button className="close-scanner-btn" onClick={onClose}>
        Cancel
      </button>
    </div>
  );
};
