import { View, ScrollView, Text, Pressable, FlatList, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Search, Filter, Star, TrendingUp } from 'lucide-react-native';
import { COLORS } from '@nobada/constants';
import { Character, CharacterCategory } from '@nobada/types';

export default function DiscoverScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<CharacterCategory[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchCharacters();
  }, []);

  const fetchCategories = async () => {
    // TODO: Replace with actual API call
    const mockCategories: CharacterCategory[] = [
      { id: 'romantic', name: '로맨틱', icon: '💕' },
      { id: 'adventure', name: '모험', icon: '🗺️' },
      { id: 'fantasy', name: '판타지', icon: '🦄' },
      { id: 'slice-of-life', name: '일상', icon: '☕' },
      { id: 'comedy', name: '코미디', icon: '😂' },
      { id: 'mysterious', name: '미스터리', icon: '🔮' },
    ];
    setCategories(mockCategories);
  };

  const fetchCharacters = async () => {
    try {
      // TODO: Replace with actual API call
      const mockCharacters: Character[] = [
        {
          id: '1',
          name: '서윤',
          age: 24,
          occupation: '바리스타',
          bio: '커피 향과 함께하는 따뜻한 일상',
          personality: '따뜻하고 친근한',
          interests: ['커피', '음악', '산책'],
          thumbnailUrl: 'https://storage.googleapis.com/nobada-media/images/character1-thumb.jpg',
          categories: ['romantic', 'slice-of-life'],
          rating: 4.8,
          totalChats: 5892,
          isNew: false,
          isTrending: true,
        },
        {
          id: '2',
          name: '지민',
          age: 26,
          occupation: '요가 강사',
          bio: '몸과 마음의 균형을 찾아가는 여정',
          personality: '차분하고 긍정적인',
          interests: ['요가', '명상', '건강'],
          thumbnailUrl: 'https://storage.googleapis.com/nobada-media/images/character2-thumb.jpg',
          categories: ['slice-of-life'],
          rating: 4.6,
          totalChats: 3421,
          isNew: true,
          isTrending: false,
        },
        {
          id: '3',
          name: '하늘',
          age: 22,
          occupation: '대학생',
          bio: '꿈을 향해 달리는 청춘의 이야기',
          personality: '활발하고 열정적인',
          interests: ['독서', '영화', '여행'],
          thumbnailUrl: 'https://storage.googleapis.com/nobada-media/images/character3-thumb.jpg',
          categories: ['romantic', 'adventure'],
          rating: 4.7,
          totalChats: 4123,
          isNew: false,
          isTrending: true,
        },
      ];
      setCharacters(mockCharacters);
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCharacters = characters.filter((character) => {
    const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          character.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || character.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const renderCharacter = ({ item }: { item: Character }) => (
    <Pressable
      onPress={() => router.push(`/chat/${item.id}`)}
      style={{
        width: '48%',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
      }}
    >
      {/* Character Image */}
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: item.thumbnailUrl }}
          style={{
            width: '100%',
            height: 200,
          }}
        />
        {item.isNew && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: COLORS.success,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 10,
                fontFamily: 'Pretendard-Bold',
              }}
            >
              NEW
            </Text>
          </View>
        )}
        {item.isTrending && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: COLORS.primary,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TrendingUp size={10} color="white" />
            <Text
              style={{
                color: 'white',
                fontSize: 10,
                fontFamily: 'Pretendard-Bold',
                marginLeft: 2,
              }}
            >
              HOT
            </Text>
          </View>
        )}
      </View>

      {/* Character Info */}
      <View style={{ padding: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Pretendard-Bold',
            color: COLORS.text,
            marginBottom: 4,
          }}
        >
          {item.name}, {item.age}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Pretendard-Regular',
            color: COLORS.textSecondary,
            marginBottom: 8,
          }}
          numberOfLines={2}
        >
          {item.bio}
        </Text>

        {/* Rating and Stats */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Star size={12} color={COLORS.warning} fill={COLORS.warning} />
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Pretendard-Medium',
                color: COLORS.text,
                marginLeft: 4,
              }}
            >
              {item.rating}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Pretendard-Regular',
              color: COLORS.textSecondary,
            }}
          >
            {item.totalChats.toLocaleString()}회 대화
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: COLORS.surface,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
            alignItems: 'center',
          }}
        >
          <Search size={20} color={COLORS.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="캐릭터 검색..."
            placeholderTextColor={COLORS.textSecondary}
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 14,
              fontFamily: 'Pretendard-Regular',
              color: COLORS.text,
            }}
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 50, paddingHorizontal: 16 }}
      >
        <Pressable
          onPress={() => setSelectedCategory(null)}
          style={{
            backgroundColor: !selectedCategory ? COLORS.primary : COLORS.surface,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            marginRight: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: !selectedCategory ? 'white' : COLORS.text,
              fontSize: 14,
              fontFamily: 'Pretendard-Medium',
            }}
          >
            전체
          </Text>
        </Pressable>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={{
              backgroundColor: selectedCategory === category.id ? COLORS.primary : COLORS.surface,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              marginRight: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ marginRight: 4 }}>{category.icon}</Text>
            <Text
              style={{
                color: selectedCategory === category.id ? 'white' : COLORS.text,
                fontSize: 14,
                fontFamily: 'Pretendard-Medium',
              }}
            >
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Characters Grid */}
      <FlatList
        data={filteredCharacters}
        renderItem={renderCharacter}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingTop: 16 }}
      />
    </View>
  );
}