'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, MessageCircle, Heart } from 'lucide-react';

interface ChatHistory {
  id: string;
  characterId: string;
  characterName: string;
  characterImage: string;
  lastMessage: string;
  lastMessageTime: Date;
  messageCount: number;
  relationshipLevel: number;
  unreadCount: number;
}

export default function HistoryPage() {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // TODO: Get actual userId from Clerk auth
        const userId = 'temp-user-id';

        const response = await fetch(`/api/chat/history?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch chat history');
        }

        const data = await response.json();
        setChatHistory(data.chatHistory.map((chat: any) => ({
          ...chat,
          lastMessageTime: new Date(chat.lastMessageTime),
        })));
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    );
  }

  if (chatHistory.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6">
        <Clock className="w-16 h-16 text-[#9CA3AF] mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">대화 기록이 없어요</h2>
        <p className="text-[#9CA3AF] text-center mb-6">
          홈 화면에서 마음에 드는 캐릭터와 대화를 시작해보세요
        </p>
        <Link
          href="/ko"
          className="px-6 py-3 bg-[#FF6B6B] text-white rounded-full font-medium"
        >
          캐릭터 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="sticky top-0 bg-[#0A0A0A] border-b border-[#2A2A2A] px-4 py-4 z-10">
        <h1 className="text-xl font-bold text-white">대화 기록</h1>
      </div>

      <div className="px-4 py-2">
        {chatHistory.map((chat) => (
          <Link
            key={chat.id}
            href={`/ko/chat/${chat.characterId}`}
            className="flex items-center gap-3 p-3 hover:bg-[#1A1A1A] rounded-xl transition-colors"
          >
            <div className="relative">
              <Image
                src={chat.characterImage}
                alt={chat.characterName}
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
              {chat.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B6B] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {chat.unreadCount}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-white">{chat.characterName}</h3>
                <span className="text-xs text-[#9CA3AF]">
                  {formatTime(chat.lastMessageTime)}
                </span>
              </div>
              <p className="text-sm text-[#9CA3AF] truncate">{chat.lastMessage}</p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-[#9CA3AF]" />
                  <span className="text-xs text-[#9CA3AF]">{chat.messageCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart
                    className="w-3 h-3 text-[#FF6B6B]"
                    fill={chat.relationshipLevel >= 3 ? '#FF6B6B' : 'transparent'}
                  />
                  <span className="text-xs text-[#9CA3AF]">Lv.{chat.relationshipLevel}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}