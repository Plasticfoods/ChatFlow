import { useEffect, useState } from 'react';
import {
  User,
  Bell,
  Lock,
  Palette,
  HelpCircle,
  LogOut,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  ArrowLeft
} from 'lucide-react';
import { useUser } from '../context/User.jsx';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import Menu from './Menu.jsx';
import { Button } from '@mui/material';
// import defaultAvatar from '../assets/';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('');
  const [sectionClassName, setSectionClassName] = useState('hidden-on-mobile');
  const { user, logout } = useUser();
  const navigate = useNavigate();

  // Your Theme Data (For the Appearance Tab)
  const themes = [
    { label: 'Light', color: '#2F80ED', bg: '#F5F7FB' },
    { label: 'Dark', color: '#60A5FA', bg: '#0F172A' },
    { label: 'Forest', color: '#10B981', bg: '#ECFDF5' },
    { label: 'Midnight', color: '#C084FC', bg: '#000000' },
    { label: 'Sunset', color: '#F97316', bg: '#FFEDD5' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'account', icon: <User size={20} />, label: 'Account' },
    { id: 'privacy & Security', icon: <Lock size={20} />, label: 'Privacy' },
    { id: 'appearance', icon: <Palette size={20} />, label: 'Appearance' },
    { id: 'notifications', icon: <Bell size={20} />, label: 'Notifications' },
    { id: 'help', icon: <HelpCircle size={20} />, label: 'Help' },
  ];

  // --- RENDER CONTENT SECTIONS ---
  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <UserProfileSection user={user} setActiveTab={setActiveTab} />;
      case 'appearance':
        return (
          <div className="settings-detail-view fade-in user-profile-section">
            <h2 className="content-title">Appearance</h2>

            {/* Section 1: Theme Selection */}
            <div className="settings-section">
              <div className="section-header">
                <h3>Theme</h3>
                <p>Customize the look and feel of the application</p>
              </div>

              <div className="theme-grid">
                {themes.map((theme) => (
                  <div key={theme.label} className="theme-card">
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
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="settings-detail-view user-profile-section fade-in">
            <h2 className="content-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <div className="settings-section">
              <p className="placeholder-text">Settings for tabs will appear here.</p>
            </div>
          </div>
        );
    }
  };

  const renderContent2 = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="settings-detail-view fade-in">
            <h2 className="content-title">Account</h2>

            {/* Section 1: Profile Card */}
            <div className="settings-section">
              <div className="section-header">
                <h3>Profile</h3>
                <p>Manage your public profile information</p>
              </div>

              <div className="profile-card">
                <div className="profile-avatar-wrapper">
                  <img
                    src={user?.avatar || "https://i.pravatar.cc/150?u=default"}
                    alt="Profile"
                    className="profile-avatar-lg"
                  />
                  <div className="avatar-overlay">Change</div>
                </div>
                <div className="profile-info">
                  <h3>{user?.name || "User Name"}</h3>
                  <p>{user?.email || "user@example.com"}</p>
                  <span className="badge">
                    {user?.role === 'admin' ? 'Administrator' : 'Free Plan'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Personal Details */}
            <div className="settings-section">
              <div className="section-header">
                <h3>Personal Details</h3>
                <p>Edit your name and status</p>
              </div>

              <div className="form-group">
                <label>Display Name</label>
                <input type="text" defaultValue={user?.name} placeholder="Your name" />
              </div>

              <div className="form-group">
                <label>Status Message</label>
                <input type="text" defaultValue={user?.about || "Available"} placeholder="What's happening?" />
              </div>

              <div className="form-actions">
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>

            {/* Section 3: Danger Zone */}
            <div className="settings-section danger-zone">
              <h3>Danger Zone</h3>
              <button className="btn-danger" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="settings-detail-view fade-in">
            <h2 className="content-title">Appearance</h2>

            {/* Section 1: Theme Selection */}
            <div className="settings-section">
              <div className="section-header">
                <h3>Theme</h3>
                <p>Customize the look and feel of the application</p>
              </div>

              <div className="theme-grid">
                {themes.map((theme) => (
                  <div key={theme.label} className="theme-card">
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
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="settings-detail-view fade-in">
            <h2 className="content-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <div className="settings-section">
              <p className="placeholder-text">Settings for {activeTab} will appear here.</p>
            </div>
          </div>
        );
    }
  };

  useEffect(() => {
    if (activeTab !== null && activeTab.length > 0) {
      setSectionClassName('active');
    } else {
      setSectionClassName('hidden-on-mobile');
    }
  }, [activeTab]);

  return (
    <div className="settings page-layout"> {/* Uses App.css grid layout */}

      {/* 1. MENU (Far Left Navigation) */}
      <Menu />

      {/* 2. SIDEBAR (Settings Categories) */}
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

      {/* 3. SECTION (Content Area) */}
      <div className={`settings-content section-right ${sectionClassName}`}>
        {renderContent()}
      </div>

    </div>
  );
};


export function UserProfileSection({ user, setActiveTab }) {

  return (
    <div className='user-profile-section'>
      <header className="section-header2">
        <div type="button" className="back-button hidden-on-desktop" onClick={() => setActiveTab(null)}>
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
          <div className="profile-avatar-wrapper">
            <img
              src={user?.avatar || "https://i.pravatar.cc/150?u=default"}
              alt="Profile"
              className="profile-avatar-lg"
            />
            <div className="avatar-overlay">Change</div>
          </div>
          <Button variant="outlined" color="error">
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
            <label>First Name</label>
            <input type="text" defaultValue={user?.name} placeholder="Your name" />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" defaultValue={user?.name} placeholder="Your last name" />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input type="text" defaultValue={user?.username} placeholder="@username" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="text" defaultValue={user?.email} placeholder="Your email" />
          </div>
          <div className="form-group about-me">
            <label>Bio</label>
            <textarea rows={6} defaultValue={user?.bio} placeholder="Your bio" />
          </div>
        </div>
      </div>
    </div>
  );
}


