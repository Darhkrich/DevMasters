'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-btn ${theme === 'dark' ? 'dark' : 'light'}`}
      aria-label="Toggle Theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          {theme === 'dark' ? (
            <i className="fas fa-moon moon-icon"></i>
          ) : (
            <i className="fas fa-sun sun-icon"></i>
          )}
        </div>
      </div>

      <style jsx>{`
        .theme-toggle-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          outline: none;
          transition: transform 0.2s ease;
        }

        .theme-toggle-btn.dark:hover {
          transform: scale(1.05);
        }

        .toggle-track {
          width: 50px;
          height: 26px;
          border-radius: 30px;
          background-color: var(--bg-secondary, rgba(0,0,0,0.1));
          border: 1px solid var(--border-primary, rgba(255,255,255,0.1));
          position: relative;
          display: flex;
          align-items: center;
          padding: 0 4px;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .theme-toggle-btn.light .toggle-track {
          background-color: rgba(0, 0, 0, 0.05);
          border-color: rgba(0, 0, 0, 0.1);
        }

        .theme-toggle-btn.dark .toggle-track {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .toggle-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          transition: transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), background-color 0.3s ease;
        }

        .theme-toggle-btn.dark .toggle-thumb {
          transform: translateX(22px);
          background: #1e293b;
        }

        .theme-toggle-btn.light .toggle-thumb {
          transform: translateX(0);
          background: #fff;
        }

        .sun-icon {
          color: #f59e0b;
          font-size: 11px;
        }

        .moon-icon {
          color: #f8fafc;
          font-size: 11px;
        }
      `}</style>
    </button>
  );
}
