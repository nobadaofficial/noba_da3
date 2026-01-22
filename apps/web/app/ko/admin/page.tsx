'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  BarChart3,
  Video,
  Settings,
  Plus,
  Edit,
  Eye,
  Trash2,
  TrendingUp,
  Star,
  MessageSquare,
  LogOut,
} from 'lucide-react';

interface Character {
  id: string;
  name: string;
  age: number;
  occupation: string;
  profileImage: string;
  thumbnailUrl: string;
  tags: string[];
  likeCount: number;
  chatCount: number;
  rating: number;
  isNew: boolean;
  isTrending: boolean;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCharacters: 0,
    totalChats: 0,
    totalUsers: 0,
    activeCharacters: 0,
  });
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      router.push('/ko/admin/login');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      // Fetch characters
      const response = await fetch('/api/characters?limit=100');
      if (!response.ok) {
        throw new Error('Failed to fetch characters');
      }

      const data = await response.json();
      setCharacters(data.characters);

      // Calculate stats
      const totalChats = data.characters.reduce(
        (sum: number, char: Character) => sum + char.chatCount,
        0
      );

      setStats({
        totalCharacters: data.characters.length,
        totalChats,
        totalUsers: 0, // TODO: Implement user count
        activeCharacters: data.characters.filter(
          (char: Character) => char.isPublished
        ).length,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    router.push('/ko/admin/login');
  };

  const handleTogglePublish = async (characterId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/characters/${characterId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update character');
      }

      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error updating character:', error);
      alert('Failed to update character');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-[#1A1A1A] border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6B6B] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Nobada Admin</h1>
              <p className="text-[#9CA3AF] text-sm">관리자 대시보드</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#3A3A3A] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9CA3AF]">전체 캐릭터</span>
              <Users className="w-5 h-5 text-[#FF6B6B]" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalCharacters}</p>
            <p className="text-sm text-[#9CA3AF] mt-1">
              활성: {stats.activeCharacters}
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9CA3AF]">전체 대화</span>
              <MessageSquare className="w-5 h-5 text-[#4ADE80]" />
            </div>
            <p className="text-3xl font-bold text-white">
              {stats.totalChats.toLocaleString()}
            </p>
            <p className="text-sm text-[#9CA3AF] mt-1">누적 대화 수</p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9CA3AF]">전체 사용자</span>
              <Users className="w-5 h-5 text-[#60A5FA]" />
            </div>
            <p className="text-3xl font-bold text-white">-</p>
            <p className="text-sm text-[#9CA3AF] mt-1">Coming soon</p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9CA3AF]">평균 평점</span>
              <Star className="w-5 h-5 text-[#FBBF24]" />
            </div>
            <p className="text-3xl font-bold text-white">
              {(
                characters.reduce((sum, char) => sum + char.rating, 0) /
                  characters.length || 0
              ).toFixed(1)}
            </p>
            <p className="text-sm text-[#9CA3AF] mt-1">전체 평균</p>
          </div>
        </div>

        {/* Characters Management */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl">
          <div className="p-6 border-b border-[#2A2A2A] flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">캐릭터 관리</h2>
            <Link
              href="/ko/admin/characters/new"
              className="flex items-center gap-2 px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#FF5252] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>새 캐릭터 추가</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  <th className="text-left p-4 text-[#9CA3AF] font-medium">
                    캐릭터
                  </th>
                  <th className="text-left p-4 text-[#9CA3AF] font-medium">
                    정보
                  </th>
                  <th className="text-left p-4 text-[#9CA3AF] font-medium">
                    통계
                  </th>
                  <th className="text-left p-4 text-[#9CA3AF] font-medium">
                    상태
                  </th>
                  <th className="text-left p-4 text-[#9CA3AF] font-medium">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody>
                {characters.map((character) => (
                  <tr
                    key={character.id}
                    className="border-b border-[#2A2A2A] hover:bg-[#0F0F0F] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={character.thumbnailUrl}
                          alt={character.name}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-white font-medium">
                            {character.name}
                          </p>
                          <p className="text-sm text-[#9CA3AF]">
                            {character.age}세 · {character.occupation}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {character.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-[#2A2A2A] text-[#9CA3AF] text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-[#FBBF24]" />
                          <span className="text-white">{character.rating}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare className="w-4 h-4 text-[#9CA3AF]" />
                          <span className="text-[#9CA3AF]">
                            {character.chatCount}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-1 text-xs rounded w-fit ${
                            character.isPublished
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {character.isPublished ? '공개' : '비공개'}
                        </span>
                        {character.isTrending && (
                          <span className="px-2 py-1 bg-[#FF6B6B]/10 text-[#FF6B6B] text-xs rounded w-fit">
                            인기
                          </span>
                        )}
                        {character.isNew && (
                          <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded w-fit">
                            신규
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleTogglePublish(
                              character.id,
                              character.isPublished
                            )
                          }
                          className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                          title={
                            character.isPublished
                              ? '비공개로 전환'
                              : '공개로 전환'
                          }
                        >
                          <Eye
                            className={`w-4 h-4 ${
                              character.isPublished
                                ? 'text-green-500'
                                : 'text-[#9CA3AF]'
                            }`}
                          />
                        </button>
                        <Link
                          href={`/ko/admin/characters/${character.id}`}
                          className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                          title="수정"
                        >
                          <Edit className="w-4 h-4 text-[#9CA3AF]" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
