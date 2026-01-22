'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Clock, Compass, User } from 'lucide-react';

const tabs = [
  { path: '', icon: Home, label: '홈' },
  { path: '/history', icon: Clock, label: '히스토리' },
  { path: '/discover', icon: Compass, label: '탐색' },
  { path: '/profile', icon: User, label: '프로필' },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'ko';

  const isActive = (path: string) => {
    const currentPath = pathname?.replace(`/${locale}`, '') || '';
    if (path === '' && (currentPath === '' || currentPath === '/')) return true;
    return currentPath === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-[#2A2A2A] z-50">
      <div className="max-w-[430px] mx-auto">
        <div className="flex items-center justify-around h-14 px-2">
          {tabs.map(({ path, icon: Icon, label }) => {
            const href = `/${locale}${path}`;
            const active = isActive(path);

            return (
              <Link
                key={path}
                href={href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  active ? 'text-[#FF6B6B]' : 'text-[#9CA3AF]'
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] mt-0.5">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}