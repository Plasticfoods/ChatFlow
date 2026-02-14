import { useEffect, useState, useRef } from 'react';
import {
  User,
  Bell,
  Lock,
  Palette,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useUser } from '../context/User.jsx';
import './Settings.css';
import Menu from './Menu.jsx';
import { Button } from '@mui/material';
import Loader from './Loader.jsx';
import ErrorPage from './ErrorPage.jsx';
import { useTheme } from '../context/Theme.jsx';
import axios from 'axios';
import { useSnackbar } from '../context/Snackbar.jsx';
import { UploadButton } from "../utils/uploadthing";
import "@uploadthing/react/styles.css";

export default function Settings() {
  const [activeTab, setActiveTab] = useState('');
  const { setSpecificTheme } = useTheme();

  // Your Theme Data (For the Appearance Tab)
  const themes = [
    { label: 'Light', color: '#2F80ED', bg: '#F5F7FB' },
    { label: 'Dark', color: '#60A5FA', bg: '#0F172A' },
    { label: 'Forest', color: '#10B981', bg: '#ECFDF5' },
    { label: 'Midnight', color: '#C084FC', bg: '#000000' },
    { label: 'Sunset Orange', color: '#F97316', bg: '#FFEDD5' },
    { label: 'Rose', color: '#E11D48', bg: '#FFE4E6' },
  ];

  const menuItems = [
    { id: 'account', icon: <User size={20} />, label: 'Account' },
    { id: 'privacy & security', icon: <Lock size={20} />, label: 'Privacy' },
    { id: 'appearance', icon: <Palette size={20} />, label: 'Appearance' },
    { id: 'notifications', icon: <Bell size={20} />, label: 'Notifications' },
    { id: 'help', icon: <HelpCircle size={20} />, label: 'Help' },
  ];

  // --- RENDER CONTENT SECTIONS ---
  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <UserProfileSection setActiveTab={setActiveTab} />;
      case 'appearance':
        return (
          <div className="settings-detail-view fade-in tab-section">
            <header className="tab-section-header">
              <div type="button" className="back-button hidden-on-desktop" onClick={() => setActiveTab('')}>
                <ChevronLeft size={36} color='var(--text-main)' />
              </div>
              <div>
                <h2>Appearance</h2>
                <p>Set your theme and display preferences</p>
              </div>
            </header>

            {/* Section 1: Theme Selection */}
            <div className="settings-section">
              <div className="section-header">
                <h3>Theme</h3>
                <p>Customize the look and feel of the application</p>
              </div>

              <div className="theme-grid">
                {themes.map((theme) => (
                  <div key={theme.label} className="theme-card" onClick={() => setSpecificTheme(null, theme.label)}>
                    <div
                      className="theme-preview"
                      style={{ backgroundColor: theme.bg, borderColor: theme.color }}
                    >
                      <div className="theme-bubble-1" style={{ backgroundColor: theme.color }}></div>
                      <div className="theme-bubble-2" style={{ backgroundColor: theme.color, opacity: 0.5 }}></div>
                    </div>
                    <span>{theme.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Display Options */}
            <div className="settings-section">
              <div className="section-header">
                <h3>Display Options</h3>
                <p>Adjust layout and density</p>
              </div>
              <div className="toggle-row">
                <div className="toggle-info">
                  <h4>Dark Mode</h4>
                  <p>Reduce eye strain with a dark interface</p>
                </div>
                <label className="switch">
                  <input type="checkbox" onChange={() => setSpecificTheme(null, 'Dark')} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="settings-detail-view tab-section fade-in">
            <header className="tab-section-header">
              <div type="button" className="back-button hidden-on-desktop" onClick={() => setActiveTab('')}>
                <ChevronLeft size={36} color='var(--text-main)' />
              </div>
              <div>
                <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                <p>Manage your {activeTab} settings</p>
              </div>
            </header>
            <div className="settings-section">
              <p className="placeholder-text">Settings for tabs will appear here.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="settings page-layout">
      {/* 1. MENU */}
      <Menu />

      {/* 2. SIDEBAR */}
      <div className="settings-sidebar section-middle">
        <div className="sidebar-header">
          <h2>Settings</h2>
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
      </div>

      {/* 3. SECTION */}
      <div className={`settings-content section-right ${activeTab ? 'active' : 'hidden-on-mobile'}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export function UserProfileSection({ setActiveTab }) {
  const { user, logout, userError, setUserError, setUser } = useUser();
  const { showSnackbar } = useSnackbar();

  const [isEditing, setIsEditing] = useState(false);
  const [tempUserData, setTempUserData] = useState(user);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const defaultUserAvatar = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  // 5. Update Profile Function (Simplified for UploadThing)
  const updateUserProfile = async () => {
    setUserError(null);
    setIsLoading(true);

    try {
      // Since UploadThing handles the file upload separately and gives us a URL,
      // we can just send the updated tempUserData (which contains the new avatar URL) as JSON.
      const { data } = await axios.put('/api/user/profile', tempUserData);

      setUser(data);
      setIsEditing(false);
      showSnackbar("User profile updated successfully!!", "success");
    } catch (err) {
      if (err.response && err.response.status >= 500) {
        setUserError(err);
        return;
      }
      if (err.response && err.status !== "404") {
        showSnackbar(err.response.statusText, "info");
      } else {
        console.log(err);
        setUserError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setTempUserData((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setTempUserData(user); // Revert all changes
    setIsEditing(false);
  };

  // --- UploadThing Handlers ---
  const handleAvatarUploadComplete = (res) => {
    if (res && res.length > 0) {
      const fileUrl = res[0].url;
      console.log("Avatar Uploaded:", fileUrl);

      // Update local state to show the new image immediately
      setTempUserData(prev => ({ ...prev, avatar: fileUrl }));
      setIsUploading(false);
      setIsEditing(true); // Switch to edit mode to allow saving
      showSnackbar("Image uploaded. Click 'Save Changes' to confirm.", "success");
    }
  };

  const handleAvatarUploadError = (error) => {
    showSnackbar(`Upload failed: ${error.message}`, "error");
    setIsUploading(false);
  };

  const handleRemoveAvatar = () => {
    setTempUserData(prev => ({ ...prev, avatar: defaultUserAvatar }));
    setIsEditing(true); // Switch to edit mode to allow saving
  }

  if (isLoading) {
    return <Loader message="Updating User Profile..." overlay={false} />;
  }

  if (userError) {
    return <ErrorPage error={userError} onRetryPath={"/settings"} />;
  }

  return (
    <div className='user-profile-section tab-section fade-in' style={{ paddingBottom: '5rem' }}>
      <header className="tab-section-header">
        <div type="button" className="back-button hidden-on-desktop" onClick={() => setActiveTab('')}>
          <ChevronLeft size={36} color='var(--text-main)' />
        </div>
        <div>
          <h2>Public Profile</h2>
          <p>Manage your public profile information</p>
        </div>
      </header>

      <div className="profile-picture-section settings-section">
        <div>
          <h3 className="section-title">Profile Picture</h3>
          <p className="section-subtitle">Update your profile picture to personalize your account</p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>

          {/* --- AVATAR WRAPPER --- */}
          <div
            className="profile-avatar-wrapper"
            title="Click to upload new image"
          >
            <img
              // Show temp avatar if changed, otherwise current user avatar, otherwise fallback
              src={tempUserData?.avatar || user?.avatar}
              alt="Profile"
              className="profile-avatar-lg"
            />

            {/* Overlay with UploadButton */}
            <div className="avatar-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isUploading ? (
                <span style={{ fontSize: '12px', color: 'white' }}>Uploading...</span>
              ) : (
                <UploadButton
                  endpoint="chatAttachment" // Using your existing endpoint (images allowed)
                  onUploadBegin={() => setIsUploading(true)}
                  onClientUploadComplete={handleAvatarUploadComplete}
                  onUploadError={handleAvatarUploadError}
                  appearance={{
                    button: {
                      background: 'transparent',
                      color: 'white',
                      padding: 0,
                      width: '100%',
                      height: '100%',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                    },
                    allowedContent: { display: 'none' },
                    container: { width: '100%', height: '100%' }
                  }}
                  content={{
                    button: "Change" // Text inside the overlay
                  }}
                />
              )}
            </div>
          </div>

          <Button
            variant="outlined"
            color="error"
            onClick={handleRemoveAvatar}
            disabled={!tempUserData?.avatar && !user?.avatar}
          >
            Remove
          </Button>
        </div>
      </div>

      <div className="personal-information-section settings-section">
        <div>
          <h3 className="section-title">Personal Information</h3>
          <p className="section-subtitle">Update your personal information to keep your account up to date</p>
        </div>
        <div className="form-groups">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={tempUserData?.name || ''}
              placeholder="Your name"
              name='name'
              onChange={handleUserInfoChange}
              style={{ backgroundColor: `${isEditing ? 'var(--bg-surface)' : 'var(--bg-main)'}` }}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={tempUserData?.username || ''} placeholder="@username" name='username' onChange={handleUserInfoChange} disabled={true} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="text" value={tempUserData?.email || ''} placeholder="Your email" name='email' onChange={handleUserInfoChange} style={{ backgroundColor: `${isEditing ? 'var(--bg-surface)' : 'var(--bg-main)'}` }} disabled={!isEditing} />
          </div>
          <div className="form-group about-me">
            <label>Bio</label>
            <textarea rows={6} value={tempUserData?.about || ''} placeholder="Your bio" name='about' onChange={handleUserInfoChange} style={{ backgroundColor: `${isEditing ? 'var(--bg-surface)' : 'var(--bg-main)'}` }} disabled={!isEditing} />
          </div>
        </div>
      </div>

      <div>
        {isEditing ? (
          <>
            <button className="btn-primary" style={{ fontWeight: '600', marginRight: '1.2rem' }} onClick={updateUserProfile}>Save Changes</button>
            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <button className="btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
      </div>
    </div>
  );
}