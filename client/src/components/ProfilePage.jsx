import React, { useState } from 'react';
import {
  User,
  QrCode,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Mail,
  BadgeCheck
} from 'lucide-react';
import { useUser } from '../context/User.jsx';
import Menu from './Menu.jsx';
import { Button } from '@mui/material';
import './Settings.css'; // Reusing settings styles for consistency
import { QRCodeSVG } from 'qrcode.react'; 


export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(''); // 'info' or 'qr'
  const { user, logout } = useUser();

  const menuItems = [
    { id: 'info', icon: <User size={20} />, label: 'Profile Info' },
    { id: 'qr', icon: <QrCode size={20} />, label: 'My QR Code' },
  ];

  // --- SUB-COMPONENT: PROFILE INFO ---
  const ProfileInfo = () => (
    <div className="settings-detail-view tab-section fade-in">
      <header className="tab-section-header">
        <div type="button" className="back-button hidden-on-desktop" onClick={() => setActiveTab('')}>
          <ChevronLeft size={36} color='var(--text-main)' />
        </div>
        <div>
          <h2>Profile Info</h2>
          <p>This is how others see you on the platform.</p>
        </div>
      </header>

      <div className="settings-section">
        {/* Unified Card Container - Simplified */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          //   border: '1px solid var(--border-color)',
          overflow: 'hidden',
          padding: '2rem'
        }}>

          {/* Combined Header & Status */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <img
                src={user?.avatar || "https://i.pravatar.cc/150?u=default"}
                alt="Profile"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid var(--bg-main)'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                width: '16px',
                height: '16px',
                backgroundColor: '#22c55e',
                borderRadius: '50%',
                border: '2px solid var(--bg-surface)'
              }}></div>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.25rem 0', color: 'var(--text-main)' }}>
              {user?.name || "User Name"}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>@{user?.username || "username"}</p>

            {/* Status Pill */}
            <div style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--bg-main)',
              borderRadius: '999px',
              fontSize: '0.9rem',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              maxWidth: '80%'
            }}>
              {user?.about || "Available"}
            </div>
          </div>

          {/* Details Section - Merged directly below */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Email Item */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                padding: '0.5rem',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-main)',
                marginRight: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Mail size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email Address</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-main)', wordBreak: 'break-all' }}>
                  {user?.email || "No email available"}
                </span>
              </div>
            </div>

            {/* Role Item */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                padding: '0.5rem',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-main)',
                marginRight: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BadgeCheck size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Account Type</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-main)', textTransform: 'capitalize' }}>
                  {user?.role || "Standard User"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  // --- SUB-COMPONENT: QR CODE ---
  const QRCodeSection = () => {
    const { user } = useUser();
    const [copied, setCopied] = useState(false);
    // Using a reliable public API to generate QR code without installing extra libraries
    // const qrValue = `${window.location.origin}/add/${user?._id}`;
    const qrValue = JSON.stringify({ action: 'add_user', user : user });

    const handleCopyId = () => {
      navigator.clipboard.writeText(user.username);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // Reset after 2 seconds
    };

    return (
      <div className="settings-detail-view tab-section fade-in">
        <header className="tab-section-header">
          <div type="button" className="back-button hidden-on-desktop" onClick={() => setActiveTab('')}>
            <ChevronLeft size={36} color='var(--text-main)' />
          </div>
          <div>
            <h2>My QR Code</h2>
            <p>Share this code for others to add you quickly.</p>
          </div>
        </header>

        <div className="settings-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            padding: '2rem',
            backgroundColor: 'white', // QR codes usually scan best on white
            borderRadius: '1rem',
            marginBottom: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            {/* <img src={qrImage} alt="User QR Code" style={{ width: '250px', height: '250px', display: 'block' }} /> */}
            <QRCodeSVG 
              value={qrValue} 
              size={250} 
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              level="H" // High error correction level
            />
          </div>

          <div className="section-header" style={{ textAlign: 'center' }}>
            <h3>Your User ID</h3>
            <p>Scan the code above or copy your ID below</p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--bg-surface)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}>
            <code style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}>{`@${user?.username || 'user'}`}</code>
            <div onClick={handleCopyId} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: '0.5rem' }}>
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // The RenderContent Word is Capital for a reason
  // It looks like you are calling a function like renderContent() inside your component, and that function is trying to render the QR code. In React, if a function starts with a lowercase letter and you call it like a regular function (e.g., {renderContent()}), React doesn't treat it as a component, which messes up the "Hook" context that qrcode.react needs.
  const RenderContent = () => {
    switch (activeTab) {
      case 'info':
        return <ProfileInfo />;
      case 'qr':
        return <QRCodeSection />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div className="settings page-layout"> {/* Reuse 'settings' class for consistent styling */}

      {/* 1. MENU (Far Left Navigation) */}
      <Menu />

      {/* 2. SIDEBAR (Profile Navigation) */}
      <div className={`settings-sidebar section-middle ${activeTab ? 'hidden-on-mobile' : ''}`}>
        <div className="sidebar-header" style={{ marginBottom: '1rem' }}>
          <h2>My Profile</h2>
        </div>

        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="item-icon">{item.icon}</div>
              <span>{item.label}</span>
              <ChevronRight size={16} className="arrow" />
            </div>
          ))}
        </div>

        {/* LOGOUT BUTTON AT THE BOTTOM OF SIDEBAR */}
        <div style={{ padding: '1rem', marginTop: 'auto', borderTop: '1px solid var(--border-color)' }}>
          <Button
            color="error"
            variant="outlined"
            onClick={logout}
            fullWidth
            style={{
              textTransform: 'none',
              fontWeight: '600',
              justifyContent: 'flex-start',
              padding: '0.75rem'
            }}
          >
            <LogOut size={20} style={{ marginRight: '0.75rem' }} />
            Logout
          </Button>
        </div>
      </div>

      {/* 3. SECTION (Content Area) */}
      <div className={`settings-content section-right ${activeTab ? 'active' : 'hidden-on-mobile'}`}>
        <RenderContent />
      </div>
    </div>
  );
}