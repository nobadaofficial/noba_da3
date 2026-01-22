'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  User, Settings, Heart, Diamond, Clock, Award,
  HelpCircle, LogOut, ChevronRight
} from 'lucide-react';

export default function ProfilePage() {
  const [user] = useState({
    id: '1',
    name: '사용자',
    email: 'user@example.com',
    imageUrl: null,
    hearts: 120,
    diamonds: 50,
    playTime: '24시간',
    achievements: 5,
  });

  const menuItems = [
    {
      icon: Heart,
      title: '보유 하트',
      value: user.hearts.toString(),
      color: '#FF6B6B',
      onClick: () => console.log('Purchase hearts'),
    },
    {
      icon: Diamond,
      title: '다이아몬드',
      value: user.diamonds.toString(),
      color: '#8B5CF6',
      onClick: () => console.log('Purchase diamonds'),
    },
    {
      icon: Clock,
      title: '플레이 시간',
      value: user.playTime,
      color: '#3B82F6',
      onClick: () => console.log('View stats'),
    },
    {
      icon: Award,
      title: '달성 엔딩',
      value: `${user.achievements}개`,
      color: '#F59E0B',
      onClick: () => console.log('View achievements'),
    },
  ];

  const settingsItems = [
    {
      icon: Settings,
      title: '설정',
      onClick: () => console.log('Open settings'),
    },
    {
      icon: HelpCircle,
      title: '고객 지원',
      onClick: () => console.log('Open support'),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="sticky top-0 bg-[#0A0A0A] border-b border-[#2A2A2A] px-4 py-4 z-10">
        <h1 className="text-xl font-bold text-white">프로필</h1>
      </div>

      {/* Profile Info */}
      <div className="px-4 py-8">
        <div className="flex flex-col items-center">
          {user.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={user.name}
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#2A2A2A] flex items-center justify-center">
              <User className="w-10 h-10 text-[#9CA3AF]" />
            </div>
          )}
          <h2 className="text-xl font-bold text-white mt-4">{user.name}</h2>
          <p className="text-[#9CA3AF] text-sm">{user.email}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={item.onClick}
              className="bg-[#1A1A1A] rounded-xl p-4 flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[#9CA3AF] text-xs">{item.title}</p>
                <p className="text-white font-semibold">{item.value}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Menu */}
      <div className="px-4 mb-8">
        {settingsItems.map((item) => (
          <button
            key={item.title}
            onClick={item.onClick}
            className="w-full bg-[#1A1A1A] rounded-xl p-4 flex items-center justify-between mb-3 hover:bg-[#2A2A2A] transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-[#9CA3AF]" />
              <span className="text-white font-medium">{item.title}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <div className="px-4 mb-20">
        <button
          onClick={() => console.log('Logout')}
          className="w-full bg-[#1A1A1A] rounded-xl p-4 flex items-center justify-center gap-3 hover:bg-[#2A2A2A] transition-colors"
        >
          <LogOut className="w-5 h-5 text-[#EF4444]" />
          <span className="text-[#EF4444] font-medium">로그아웃</span>
        </button>
      </div>
    </div>
  );
}