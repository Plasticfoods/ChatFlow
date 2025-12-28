import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  MessageSquare,
  Users,
  Settings,
  Moon,
  Sun,
  User
} from 'lucide-react';
import './Navbar.css'; // Import the styles above
import { useTheme } from '../context/Theme';

export default function Menu() {
  const { switchTheme } = useTheme();
  const iconSize = 24;

  // Define your navigation items here
  const navItems = [
    { path: '/', icon: <MessageSquare size={iconSize} />, label: '' },
    { path: '/contacts', icon: <Users size={iconSize} />, label: 'Contacts' },
    { path: '/settings', icon: <Settings size={iconSize} />, label: 'Settings' },
    { path: '/profile', icon: <User size={iconSize} />, label: 'Profile' },
  ];

  return (
    <nav className="menu section-left">

      {/* --- TOP SECTION: APP NAV --- */}
      <div className="nav-section">
        {navItems.map((item) => (
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
        ))}
      </div>

      {/* --- BOTTOM SECTION: UTILITIES --- */}
      <div className="bottom-section hidden-on-mobile">

        {/* Theme Toggle Button */}
        <button
          className="nav-link hidden-on-mobile"
          title="Toggle Theme"
          style={{ border: 'none', background: 'none', cursor: 'pointer' }}
          size={iconSize}
          onClick={switchTheme}
        >
          <Sun />
        </button>
      </div>
    </nav>
  );
};

