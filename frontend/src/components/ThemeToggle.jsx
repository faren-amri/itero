import React, { useState, useEffect } from 'react';
import styles from '../styles/ThemeToggle.module.css';

const ThemeToggle = () => {
  // Check the current theme from <html data-theme="...">
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.getAttribute('data-theme') === 'dark'
  );

  // Apply theme on toggle
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <button
      className={styles.themeToggle}
      onClick={() => setIsDark(!isDark)}
      aria-label="Toggle theme"
    >
      <span>{isDark ? '🌞' : '🌙'}</span>
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default ThemeToggle;
