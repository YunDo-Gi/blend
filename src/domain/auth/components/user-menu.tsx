'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../providers/auth-provider';
import { LoginModal } from './login-modal';

export function UserMenu() {
  const { user, logout, isLoading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsDropdownOpen(false);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return <div className="text-gray font-mono text-sm">...</div>;
  }

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-foreground hover:text-primary font-mono text-sm transition-colors"
        >
          {user.nickname}
        </button>

        {isDropdownOpen && (
          <div className="border-line bg-background absolute right-0 top-full mt-2 w-32 border shadow-lg">
            <Link
              href="/write"
              onClick={() => setIsDropdownOpen(false)}
              className="text-foreground hover:bg-gray-2 block px-4 py-2 font-mono text-sm transition-colors"
            >
              WRITE
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsDropdownOpen(false)}
              className="text-foreground hover:bg-gray-2 block px-4 py-2 font-mono text-sm transition-colors"
            >
              SETTINGS
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-foreground hover:bg-gray-2 w-full px-4 py-2 text-left font-mono text-sm transition-colors disabled:opacity-40"
            >
              {isLoggingOut ? 'LOGOUT...' : 'LOGOUT'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsLoginModalOpen(true)}
        className="text-foreground hover:text-primary font-mono text-sm transition-colors"
      >
        LOGIN
      </button>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
