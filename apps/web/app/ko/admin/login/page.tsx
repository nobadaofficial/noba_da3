'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/ko/admin');
        router.refresh();
      } else {
        setError('비밀번호가 올바르지 않습니다');
      }
    } catch {
      setError('오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-[320px]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FF6B6B] rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">관리자 로그인</h1>
          <p className="text-[#9CA3AF]">Nobada Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white placeholder:text-[#9CA3AF] rounded-lg px-4 py-3 focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B] transition-colors text-center text-lg tracking-widest"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full py-3 bg-[#FF6B6B] text-white rounded-lg font-semibold hover:bg-[#FF5252] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
