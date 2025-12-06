import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  MessageSquare,
  Phone,
  Users,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';
import './Navbar.css'; // Import the styles above

export default function Menu() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const iconSize = 24;

  // Define your navigation items here
  const navItems = [
    { path: '/', icon: <MessageSquare size={iconSize} />, label: '' },
    { path: '/contacts', icon: <Users size={iconSize} />, label: 'Contacts' },
    { path: '/calls', icon: <Phone size={iconSize} />, label: 'Calls' },
    { path: '/settings', icon: <Settings size={iconSize} />, label: 'Settings' },
  ];

  return (
    <nav className="menu">

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
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="nav-link hidden-on-mobile"
          title="Toggle Theme"
          style={{ border: 'none', background: 'none', cursor: 'pointer' }}
        >
          {isDarkMode ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
        </button>
      </div>
    </nav>
  );
};

