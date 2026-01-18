import { useEffect, useState, useRef } from 'react';
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
import './Settings.css';
import Menu from './Menu.jsx';
import { Button } from '@mui/material';
import Loader from './Loader.jsx';
import ErrorPage from './ErrorPage.jsx';
import { useTheme } from '../context/Theme.jsx';
import axios from 'axios';
import { useSnackbar } from '../context/Snackbar.jsx';


export default function Settings() {
  const [activeTab, setActiveTab] = useState('');
  // const { user, userError } = useUser();
  const { setSpecificTheme } = useTheme();

  // Your Theme Data (For the Appearance Tab)
  const themes = [
    { label: 'Light', color: '#2F80ED', bg: '#F5F7FB' },
    { label: 'Dark', color: '#60A5FA', bg: '#0F172A' },
    { label: 'Forest', color: '#10B981', bg: '#ECFDF5' },
    { label: 'Midnight', color: '#C084FC', bg: '#000000' },
    { label: 'Sunset Orange', color: '#F97316', bg: '#FFEDD5' },
    { label: 'Forest', color: '#10B981', bg: '#ECFDF5' },
    { label: 'Midnight', color: '#C084FC', bg: '#000000' },
    { label: 'Sunset Orange', color: '#F97316', bg: '#FFEDD5' },
  ];

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
          <div className="settings-detail-view tab-section fade-in hidden-on-mobile">
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
          <div className="settings-detail-view tab-section fade-in">
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
                <input type="text" value={user?.name} placeholder="Your name" />
              </div>

              <div className="form-group">
                <label>Status Message</label>
                <input type="text" value={user?.about || "Available"} placeholder="What's happening?" />
              </div>

              <div className="form-actions">
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>

            {/* Section 3: Danger Zone */}
            <div className="settings-section danger-zone">
              <h3>Danger Zone</h3>
              <button className="btn-danger" onClick={handleLogout}>
                <LogOut size={22} />
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

  // if(userError) {
  //   return <ErrorPage 
  //     title="Unable to Load Settings" 
  //     message="There was an issue loading your settings. Please try again later." 
  //     onRetry={() => window.location.reload()} 
  //   />;
  // }

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

  // --- NEW: State for Image Upload ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null); // Reference for the hidden input

  // 5. Update Profile Function
  const updateUserProfile = async () => {
    setUserError(null);
    setIsLoading(true);

    try {
      let responseData;

      // Check if we are sending a file (Multipart) or just Data (JSON)
      if (selectedFile) {
        const formData = new FormData();
        // Append text fields
        formData.append('name', tempUserData.name || '');
        formData.append('email', tempUserData.email || '');
        formData.append('about', tempUserData.about || '');
        // Append the file
        formData.append('avatar', selectedFile);

        // Note: You might need to adjust the Content-Type header depending on your axios setup,
        // but usually axios handles FormData automatically.
        const { data } = await axios.put('/api/user/profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        responseData = data;
      } else {
        // Standard JSON update
        const { data } = await axios.put('/api/user/profile', tempUserData);
        responseData = data;
      }

      setUser(responseData);
      setIsEditing(false);
      
      // Clear upload states on success
      setSelectedFile(null);
      setPreviewUrl(null);
      
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
    setTempUserData(user); // Revert text changes
    setSelectedFile(null); // Clear file
    setPreviewUrl(null);   // Clear preview
    setIsEditing(false);
  };

  // --- NEW: Handle File Selection ---
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optional: Add size validation (e.g., 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar("Image size should be less than 5MB", "warning");
        return;
      }

      setSelectedFile(file);
      // Create a local preview URL
      setPreviewUrl(URL.createObjectURL(file));
      // Automatically switch to edit mode so the user sees "Save Changes"
      setIsEditing(true);
    }
  };

  // --- NEW: Trigger the hidden input ---
  const handleAvatarClick = () => {
    if(fileInputRef.current) {
        fileInputRef.current.click();
    }
  }

  if (isLoading) {
    return <Loader message="Updating User Profile..." overlay={false} />;
  }

  if (userError) {
    return <ErrorPage error={userError} onRetryPath={"/settings"} />;
  }

  return (
    <div className='user-profile-section tab-section fade-in'>
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
          
          {/* --- MODIFIED AVATAR WRAPPER --- */}
          <div 
            className="profile-avatar-wrapper" 
            onClick={handleAvatarClick} 
            style={{ cursor: 'pointer' }}
            title="Click to upload new image"
          >
            {/* Hidden Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleProfilePictureChange} 
                style={{ display: 'none' }} 
                accept="image/png, image/jpeg, image/jpg, image/gif"
            />
            
            <img
              // Priority: Preview URL -> Current User Avatar -> Placeholder
              src={previewUrl || user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
              alt="Profile"
              className="profile-avatar-lg"
            />
            <div className="avatar-overlay">Change</div>
          </div>
          
          <Button 
            variant="outlined" 
            color="error" 
            onClick={() => {
                setPreviewUrl(null);
                setSelectedFile(null);
                // Optionally add logic here to remove avatar from backend immediately
            }}
            disabled={!previewUrl && !user?.avatar}
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
            <label>Name</label> {/* Fixed label from "First Name" to match state "name" */}
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
          
          {/* ... Removed "Last Name" if your tempUserData only has 'name'. 
              If you have split names, ensure your state object reflects that ... */}
          
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
        <div className="form-actions">
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

      <div>
        <Button color="error" variant="outlined" onClick={logout} style={{ textTransform: 'none', fontWeight: '600' }} >
          <LogOut size={22} style={{ marginRight: '.5rem', }} />
          Logout
        </Button>
      </div>
    </div>
  );
}

export function UserProfileSection2({ setActiveTab }) {
  const { user, logout, userError, setUserError, setUser } = useUser();
  const { showSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const [tempUserData, setTempUserData] = useState(user);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null); // Reference for the hidden input

  // 5. Update Profile Function
  const updateUserProfile = async () => {
    setUserError(null);
    setIsLoading(true);
    try {
      const { data } = await axios.put('/api/user/profile', tempUserData);
      setUser(data);
      setIsEditing(false);
      showSnackbar("User profile updated successfully!!", "success");
    } catch (err) {
      if (err.response && err.response.status >= 500) {
        // Catch 500, 502, 503, 504, etc.
        setUserError(err);
        return;
      }
      if (err.response && err.status != "404") {
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
  }

  const handleCancel = () => {
    setTempUserData(user); // Revert changes
    setIsEditing(false);
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optional: Add size validation (e.g., 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar("Image size should be less than 5MB", "warning");
        return;
      }

      setProfilePicFile(file);
      // Create a local preview URL
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (isLoading) {
    return <Loader message="Updating User Profile..." overlay={false} />;
  }

  if (userError) {
    return <ErrorPage error={userError} onRetryPath={"/settings"} />;
  }

  return (
    <div className='user-profile-section tab-section fade-in'>
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
          <div className="profile-avatar-wrapper">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePictureChange}
              // style={{ display: 'none' }}
              accept="image/png, image/jpeg, image/jpg"
            />
            <img
              src={user?.avatar}
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
            <input type="text" value={tempUserData?.name} placeholder="Your name" name='name' onChange={handleUserInfoChange} style={{ backgroundColor: `${isEditing ? 'var(--bg-surface)' : 'var(--bg-main)'}` }} disabled={!isEditing} />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" value={tempUserData?.name} placeholder="Your last name" name='name' disabled={!isEditing} style={{ backgroundColor: `${isEditing ? 'var(--bg-surface)' : 'var(--bg-main)'}` }} />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={tempUserData?.username} placeholder="@username" name='username' onChange={handleUserInfoChange} disabled={true} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="text" value={tempUserData?.email} placeholder="Your email" name='email' onChange={handleUserInfoChange} style={{ backgroundColor: `${isEditing ? 'var(--bg-surface)' : 'var(--bg-main)'}` }} disabled={!isEditing} />
          </div>
          <div className="form-group about-me">
            <label>Bio</label>
            <textarea rows={6} value={tempUserData?.about} placeholder="Your bio" name='about' onChange={handleUserInfoChange} style={{ backgroundColor: `${isEditing ? 'var(--bg-surface)' : 'var(--bg-main)'}` }} disabled={!isEditing} />
          </div>
        </div>
        <div className="form-actions">
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

      <div>
        <Button color="error" variant="outlined" onClick={logout} style={{ textTransform: 'none', fontWeight: '600' }} >
          <LogOut size={22} style={{ marginRight: '.5rem', }} />
          Logout
        </Button>
      </div>
    </div>
  );
}


