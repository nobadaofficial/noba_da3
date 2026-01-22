'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Star, TrendingUp, Heart } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  age: number;
  occupation: string;
  bio: string;
  thumbnailUrl: string;
  categories: string[];
  rating: number;
  totalChats: number;
  isNew: boolean;
  isTrending: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch characters from API
        const response = await fetch('/api/characters?limit=50');
        if (!response.ok) {
          throw new Error('Failed to fetch characters');
        }

        const data = await response.json();

        // Transform API data to component format
        const transformedCharacters: Character[] = data.characters.map((char: any) => ({
          id: char.id,
          name: char.name,
          age: char.age,
          occupation: char.occupation,
          bio: char.description,
          thumbnailUrl: char.thumbnailUrl,
          categories: char.tags,
          rating: char.rating,
          totalChats: char.chatCount,
          isNew: char.isNew,
          isTrending: char.isTrending,
        }));

        // Extract unique tags/categories from characters
        const uniqueTags = new Set<string>();
        transformedCharacters.forEach(char => {
          char.categories.forEach(tag => uniqueTags.add(tag));
        });

        const categoriesFromTags: Category[] = Array.from(uniqueTags).map(tag => ({
          id: tag,
          name: tag,
          icon: getIconForTag(tag),
        }));

        setCategories(categoriesFromTags);
        setCharacters(transformedCharacters);
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getIconForTag = (tag: string): string => {
    const iconMap: Record<string, string> = {
      '로맨틱': '💕',
      '모험': '🗺️',
      '판타지': '🦄',
      '일상': '☕',
      '코미디': '😂',
      '미스터리': '🔮',
      '힐링': '🌿',
      '감성': '🎭',
      '예술': '🎨',
      '건강': '💪',
      '활발': '⚡',
      '고급': '✨',
    };
    return iconMap[tag] || '🌟';
  };

  const filteredCharacters = characters.filter((character) => {
    const matchesSearch =
      character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      character.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      character.occupation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || character.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="sticky top-0 bg-[#0A0A0A] z-10 border-b border-[#2A2A2A]">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-white mb-3">캐릭터 탐색</h1>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="캐릭터 검색..."
              className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] placeholder-[#9CA3AF]"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                !selectedCategory
                  ? 'bg-[#FF6B6B] text-white'
                  : 'bg-[#1A1A1A] text-[#9CA3AF]'
              }`}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors flex items-center gap-1 ${
                  selectedCategory === category.id
                    ? 'bg-[#FF6B6B] text-white'
                    : 'bg-[#1A1A1A] text-[#9CA3AF]'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Characters Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredCharacters.map((character) => (
            <Link
              key={character.id}
              href={`/ko/chat/${character.id}`}
              className="bg-[#1A1A1A] rounded-xl overflow-hidden"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={character.thumbnailUrl}
                  alt={character.name}
                  fill
                  className="object-cover"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {character.isNew && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                      NEW
                    </span>
                  )}
                  {character.isTrending && (
                    <span className="px-2 py-1 bg-[#FF6B6B] text-white text-xs font-bold rounded flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      HOT
                    </span>
                  )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Character Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-bold text-lg">
                    {character.name}, {character.age}
                  </h3>
                  <p className="text-white/80 text-sm">{character.occupation}</p>
                </div>
              </div>

              <div className="p-3">
                <p className="text-[#9CA3AF] text-sm mb-2 line-clamp-2">
                  {character.bio}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" fill="#EAB308" />
                    <span className="text-white text-sm font-medium">
                      {character.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-[#FF6B6B]" />
                    <span className="text-[#9CA3AF] text-sm">
                      {(character.totalChats / 1000).toFixed(1)}k
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}