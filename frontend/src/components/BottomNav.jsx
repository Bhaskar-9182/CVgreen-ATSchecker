import React from 'react';
import { Scan, History, Bookmark, User } from 'lucide-react';

export default function BottomNav({ activeNav, onNavChange }) {
  const navItems = [
    { id: 'Scanner', icon: Scan, label: 'Scanner' },
    { id: 'History', icon: History, label: 'History' },
    { id: 'Saved', icon: Bookmark, label: 'Saved' },
    { id: 'Profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeNav === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavChange(item.id)}
            className={`bottom-nav-btn ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={18} color={isActive ? '#0052cc' : '#64748b'} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
