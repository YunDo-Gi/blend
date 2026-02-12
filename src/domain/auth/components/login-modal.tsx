'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../providers/auth-provider';
import { ApiException } from '@/shared/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AUTH_ERROR_MESSAGES: Record<number, string> = {
  100: '비밀번호가 일치하지 않습니다.',
  101: '존재하지 않는 사용자입니다.',
  5003: '인증에 실패했습니다.',
};

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Focus email input on open
  useEffect(() => {
    if (isOpen) {
      emailInputRef.current?.focus();
    }
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      // Success - close modal and reset form
      onClose();
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof ApiException) {
        setError(AUTH_ERROR_MESSAGES[err.code] || '로그인 중 오류가 발생했습니다.');
      } else {
        setError('네트워크 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
        <div className="border-line bg-background border p-6">
          <h2 className="text-foreground mb-6 font-mono text-lg">LOGIN</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-foreground mb-2 block font-mono text-xs">Email</label>
              <input
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="border-line bg-background text-foreground placeholder:text-gray w-full border px-3 py-2 text-sm outline-none"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-gray-foreground mb-2 block font-mono text-xs">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-line bg-background text-foreground placeholder:text-gray w-full border px-3 py-2 text-sm outline-none"
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="border border-red-400 bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-foreground text-background flex-1 px-4 py-2 font-mono text-sm transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="border-line text-foreground hover:bg-gray-2 flex-1 border px-4 py-2 font-mono text-sm transition-colors disabled:opacity-40"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
