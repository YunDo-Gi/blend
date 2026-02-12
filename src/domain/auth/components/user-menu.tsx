'use client';

import { useState } from 'react';
import { useAuth } from '../providers/auth-provider';
import { LoginModal } from './login-modal';

export function UserMenu() {
  const { user, logout, isLoading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
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
      <div className="flex items-center gap-3">
        <span className="text-foreground font-mono text-sm">{user.nickname}</span>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-gray hover:text-foreground font-mono text-sm transition-colors disabled:opacity-40"
        >
          {isLoggingOut ? 'LOGIN' : 'LOGOUT'}
        </button>
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
