import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  MessageSquare,
  Users,
  Settings,
  Moon,
  Sun,
  User,
  LogOut
} from 'lucide-react';
import './Navbar.css'; // Import the styles above
import { useTheme } from '../context/Theme';
import { useUser } from '../context/User';

export default function Menu() {
  const { switchTheme } = useTheme();
  const { logout } = useUser();
  const iconSize = 24;

  // Define your navigation items here
  const navItems = [
    { path: '/', icon: <MessageSquare size={iconSize} />, label: '' },
    // { path: '/contacts', icon: <Users size={iconSize} />, label: 'Contacts' },
    { path: null, icon: <Sun size={iconSize} />, label: 'Theme' },
    { path: '/settings', icon: <Settings size={iconSize} />, label: 'Settings' },
    { path: '/profile', icon: <User size={iconSize} />, label: 'Profile' },
  ];

  return (
    <nav className="menu section-left">

      {/* --- TOP SECTION: APP NAV --- */}
      <div className="nav-section">
        {navItems.map((item) => {
          if (item.path) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                title={item.label} // Tooltip on hover
              >
                {item.icon}
              </NavLink>
            );
          } else {
            return (
              <button
                key={item.label}
                className="nav-link"
                title={item.label}
                onClick={switchTheme}
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
              >
                {item.icon}
              </button>
            );
          }
        })}
      </div>

      {/* --- BOTTOM SECTION: UTILITIES --- */}
      <div className="bottom-section hidden-on-mobile">

        {/* Theme Toggle Button */}
        <button
          className="nav-link hidden-on-mobile"
          title="Toggle Theme"
          style={{ border: 'none', background: 'none', cursor: 'pointer' }}
          size={iconSize}
          onClick={logout}
        >
          <LogOut />
        </button>
      </div>
    </nav>
  );
};

