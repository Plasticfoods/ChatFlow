import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Define the media query to match your CSS
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

    // 2. Function to update state
    const handleChange = (event) => {
      setIsMobile(event.matches);
    };

    // 3. Set initial value
    setIsMobile(mediaQuery.matches);

    // 4. Listen for changes
    // Modern browsers support addEventListener on MediaQueryList
    mediaQuery.addEventListener('change', handleChange);

    // 5. Cleanup listener on unmount
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;