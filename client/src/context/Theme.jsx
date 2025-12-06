import { createContext, useContext, useState, useEffect } from 'react';

// --- 2. THE CONTEXT ---
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // We manage state via INDEX now, but we initialize by checking localStorage for the ID string
  const [themeIndex, setThemeIndex] = useState(() => {
    let savedThemeIndex = localStorage.getItem('app-theme');
    if (savedThemeIndex !== null && savedThemeIndex < themes.length) {
      return savedThemeIndex;
    }
    return 0;
  });

  // Derived state for easy access
  const currentTheme = themes[themeIndex];

  useEffect(() => {
    console.log("Switching theme to:", currentTheme.label);

    // 1. Apply styles to body
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      document.body.style.setProperty(key, value);
    });

    // 2. Persist the ID (string) to local storage
    localStorage.setItem('app-theme', themeIndex);
  }, [themeIndex]); // Run whenever the index changes

  // --- NEW METHOD: CYCLE TO NEXT THEME ---
  const switchTheme = () => {
    setThemeIndex((prevIndex) => (prevIndex + 1) % themes.length);
  };

  // Helper to jump to a specific theme (useful for a settings dropdown)
  const setSpecificTheme = (id) => {
    const index = themes.findIndex(t => t.id === id);
    if (index !== -1) {
      setThemeIndex(index);
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme: currentTheme.id,     // The current ID string (e.g., 'light')
        themeLabel: currentTheme.label, // The current display name
        switchTheme,                // The cycler function
        setSpecificTheme,           // The specific setter
        themes                      // The entire array (for building UI lists)
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// --- 3. THE HOOK ---
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// --- 1. THE DATA ---
// Array structure: Order matters for cycling (Light -> Dark -> Forest -> Midnight -> Light)
const themes = [
  {
    label: 'Light',
    colors: {
      '--primary': '#2F80ED',
      '--primary-hover': '#1F7AE0',
      '--secondary': '#E3F2FF',
      '--bg-main': '#F5F7FB',
      '--bg-surface': '#FFFFFF',
      '--border-color': '#e5e7eb',
      '--text-main': '#1C1F26',
      '--text-dim': '#6B7280',
      '--text-muted': '#9CA3AF',
      '--text-inverse': '#FFFFFF',
      '--radius-md': '12px',
      '--radius-full': '999px',
    },
  },
  {
    label: 'Dark',
    colors: {
      '--primary': '#60A5FA',
      '--primary-hover': '#3B82F6',
      '--secondary': '#1E3A8A',
      '--bg-main': '#0F172A',
      '--bg-surface': '#1E293B',
      '--border-color': '#334155',
      '--text-main': '#F1F5F9',
      '--text-dim': '#94A3B8',
      '--text-muted': '#64748B',
      '--text-inverse': '#FFFFFF',
      '--radius-md': '12px',
      '--radius-full': '999px',
    },
  },
  {
    label: 'Forest',
    colors: {
      '--primary': '#10B981',
      '--primary-hover': '#059669',
      '--secondary': '#D1FAE5',
      '--bg-main': '#ECFDF5',
      '--bg-surface': '#FFFFFF',
      '--border-color': '#A7F3D0',
      '--text-main': '#064E3B',
      '--text-dim': '#047857',
      '--text-muted': '#6EE7B7',
      '--text-inverse': '#FFFFFF',
      '--radius-md': '12px',
      '--radius-full': '999px',
    },
  },
  {
    label: 'Midnight',
    colors: {
      '--primary': '#C084FC',
      '--primary-hover': '#A855F7',
      '--secondary': '#4C1D95',
      '--bg-main': '#000000',
      '--bg-surface': '#121212',
      '--border-color': '#2D2D2D',
      '--text-main': '#E9D5FF',
      '--text-dim': '#A855F7',
      '--text-muted': '#581C87',
      '--text-inverse': '#FFFFFF',
      '--radius-md': '12px',
      '--radius-full': '999px',
    },
  },
  {
    label: 'Sunset Orange',
    colors: {
      '--primary': '#F97316',       // Vibrant Orange
      '--primary-hover': '#EA580C', // Darker Orange
      '--secondary': '#FFEDD5',     // Pale Orange (Bubbles)
      '--bg-main': '#F5F7FB',       // Very light warm background
      '--bg-surface': '#FFFFFF',    // White panels
      '--border-color': '#e5e7eb',  // Soft Orange Border
      '--text-main': '#431407',     // Dark Brown/Black for warmth
      '--text-dim': '#9A3412',      // Muted Orange-Brown
      '--text-muted': '#D4D4D4',
      '--text-inverse': '#FFFFFF',
      '--radius-md': '12px',
      '--radius-full': '999px',
    },
  },
];