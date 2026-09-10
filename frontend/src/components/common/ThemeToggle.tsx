import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#1B2028] transition-colors duration-150 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#FF4400]"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      aria-label={`Toggle theme, current is ${theme}`}
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-3.5 h-3.5 text-[#4B5563]" />
          <span className="hidden sm:inline">DARK MODE</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-[#FF4400]" />
          <span className="hidden sm:inline">LIGHT MODE</span>
        </>
      )}
      <span className="w-1.5 h-1.5 rounded-full bg-[#FF4400]"></span>
    </button>
  );
};
