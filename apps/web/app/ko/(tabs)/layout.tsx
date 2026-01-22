'use client';

import { usePathname } from 'next/navigation';
import { BottomNavigation } from '@/components/layout/BottomNavigation';

interface TabsLayoutProps {
  children: React.ReactNode;
}

export default function TabsLayout({ children }: TabsLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/ko' || pathname === '/ko/';

  return (
    <>
      <div className={isHomePage ? '' : 'pb-14'}>{children}</div>
      <BottomNavigation />
    </>
  );
}