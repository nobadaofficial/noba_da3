import { View, ScrollView, Text, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Video } from 'expo-video';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'react-native-linear-gradient';
import { Heart, MessageCircle, Play } from 'lucide-react-native';
import { COLORS } from '@nobada/constants';
import { CharacterPreview } from '@nobada/types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_HEIGHT = screenHeight * 0.6;

export default function HomeScreen() {
  const router = useRouter();
  const [characters, setCharacters] = useState<CharacterPreview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch featured characters
    fetchFeaturedCharacters();
  }, []);

  const fetchFeaturedCharacters = async () => {
    try {
      // TODO: Replace with actual API call
      const mockCharacters: CharacterPreview[] = [
        {
          id: '1',
          name: '서윤',
          age: 24,
          occupation: '바리스타',
          bio: '커피 향과 함께하는 따뜻한 일상',
          thumbnailUrl: 'https://storage.googleapis.com/nobada-media/images/character1-thumb.jpg',
          previewVideoUrl: 'https://storage.googleapis.com/nobada-media/videos/character1-preview.mp4',
          tags: ['로맨틱', '일상', '힐링'],
          likeCount: 2341,
          chatCount: 5892,
        },
        {
          id: '2',
          name: '지민',
          age: 26,
          occupation: '요가 강사',
          bio: '몸과 마음의 균형을 찾아가는 여정',
          thumbnailUrl: 'https://storage.googleapis.com/nobada-media/images/character2-thumb.jpg',
          previewVideoUrl: 'https://storage.googleapis.com/nobada-media/videos/character2-preview.mp4',
          tags: ['스포티', '건강', '긍정적'],
          likeCount: 1892,
          chatCount: 3421,
        },
      ];
      setCharacters(mockCharacters);
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    }
  };

  const handleStartChat = (characterId: string) => {
    router.push(`/chat/${characterId}`);
  };

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.height;
    const index = event.nativeEvent.contentOffset.y / slideSize;
    setCurrentIndex(Math.round(index));
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {characters.map((character) => (
          <View
            key={character.id}
            style={{
              width: screenWidth,
              height: screenHeight,
              position: 'relative',
            }}
          >
            {/* Background Video */}
            <Video
              source={{ uri: character.previewVideoUrl }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: screenWidth,
                height: screenHeight,
              }}
              shouldPlay
              isLooping
              isMuted
            />

            {/* Gradient Overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: screenHeight * 0.4,
              }}
            />

            {/* Character Info */}
            <View
              style={{
                position: 'absolute',
                bottom: 100,
                left: 20,
                right: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 32,
                  fontFamily: 'Pretendard-Bold',
                  color: 'white',
                  marginBottom: 8,
                }}
              >
                {character.name}, {character.age}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Pretendard-Medium',
                  color: 'white',
                  opacity: 0.9,
                  marginBottom: 4,
                }}
              >
                {character.occupation}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Pretendard-Regular',
                  color: 'white',
                  opacity: 0.8,
                  marginBottom: 16,
                }}
              >
                {character.bio}
              </Text>

              {/* Tags */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
                {character.tags.map((tag) => (
                  <View
                    key={tag}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 12,
                        fontFamily: 'Pretendard-Medium',
                      }}
                    >
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Stats */}
              <View style={{ flexDirection: 'row', gap: 20, marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Heart size={16} color="white" fill="white" />
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 14,
                      fontFamily: 'Pretendard-Medium',
                      marginLeft: 6,
                    }}
                  >
                    {character.likeCount.toLocaleString()}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MessageCircle size={16} color="white" />
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 14,
                      fontFamily: 'Pretendard-Medium',
                      marginLeft: 6,
                    }}
                  >
                    {character.chatCount.toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Start Chat Button */}
              <Pressable
                onPress={() => handleStartChat(character.id)}
                style={{
                  backgroundColor: COLORS.primary,
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <Play size={20} color="white" fill="white" />
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    fontFamily: 'Pretendard-Bold',
                    marginLeft: 8,
                  }}
                >
                  대화 시작하기
                </Text>
              </Pressable>
            </View>

            {/* Skip/Next Indicators */}
            <View
              style={{
                position: 'absolute',
                right: 20,
                top: '50%',
                transform: [{ translateY: -50 }],
              }}
            >
              {characters.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 4,
                    height: index === currentIndex ? 24 : 16,
                    backgroundColor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.4)',
                    borderRadius: 2,
                    marginVertical: 4,
                  }}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}