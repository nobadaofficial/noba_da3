import { View, ScrollView, Text, Pressable, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Calendar, MessageCircle, Heart } from 'lucide-react-native';
import { COLORS } from '@nobada/constants';
import { ChatHistory } from '@nobada/types';

export default function HistoryScreen() {
  const router = useRouter();
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      // TODO: Replace with actual API call
      const mockHistory: ChatHistory[] = [
        {
          id: '1',
          characterId: '1',
          characterName: '서윤',
          characterImage: 'https://storage.googleapis.com/nobada-media/images/character1-thumb.jpg',
          lastMessage: '오늘 날씨가 정말 좋네요! 카페에서 커피 한잔 어때요?',
          lastMessageTime: new Date('2024-01-20T10:30:00'),
          messageCount: 42,
          relationshipLevel: 3,
          unreadCount: 0,
        },
        {
          id: '2',
          characterId: '2',
          characterName: '지민',
          characterImage: 'https://storage.googleapis.com/nobada-media/images/character2-thumb.jpg',
          lastMessage: '요가 수업 끝났어요. 오늘도 수고했어요!',
          lastMessageTime: new Date('2024-01-19T18:00:00'),
          messageCount: 28,
          relationshipLevel: 2,
          unreadCount: 2,
        },
      ];
      setChatHistory(mockHistory);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleContinueChat = (characterId: string) => {
    router.push(`/chat/${characterId}`);
  };

  const renderChatItem = ({ item }: { item: ChatHistory }) => (
    <Pressable
      onPress={() => handleContinueChat(item.characterId)}
      style={{
        backgroundColor: COLORS.surface,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
      }}
    >
      {/* Character Image */}
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: item.characterImage }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
          }}
        />
        {item.unreadCount > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              backgroundColor: COLORS.primary,
              width: 20,
              height: 20,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 12,
                fontFamily: 'Pretendard-Bold',
              }}
            >
              {item.unreadCount}
            </Text>
          </View>
        )}
      </View>

      {/* Chat Info */}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Pretendard-Bold',
              color: COLORS.text,
            }}
          >
            {item.characterName}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              color: COLORS.textSecondary,
            }}
          >
            {formatTime(item.lastMessageTime)}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Pretendard-Regular',
            color: COLORS.textSecondary,
            marginBottom: 8,
          }}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MessageCircle size={14} color={COLORS.textSecondary} />
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Pretendard-Medium',
                color: COLORS.textSecondary,
                marginLeft: 4,
              }}
            >
              {item.messageCount}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Heart
              size={14}
              color={COLORS.primary}
              fill={item.relationshipLevel >= 3 ? COLORS.primary : 'transparent'}
            />
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Pretendard-Medium',
                color: COLORS.textSecondary,
                marginLeft: 4,
              }}
            >
              Lv.{item.relationshipLevel}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: COLORS.textSecondary, fontFamily: 'Pretendard-Medium' }}>
          로딩 중...
        </Text>
      </View>
    );
  }

  if (chatHistory.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
        <Calendar size={48} color={COLORS.textSecondary} />
        <Text
          style={{
            color: COLORS.textSecondary,
            fontSize: 16,
            fontFamily: 'Pretendard-Medium',
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          아직 대화 기록이 없어요
        </Text>
        <Text
          style={{
            color: COLORS.textSecondary,
            fontSize: 14,
            fontFamily: 'Pretendard-Regular',
            textAlign: 'center',
            paddingHorizontal: 32,
          }}
        >
          홈 화면에서 마음에 드는 캐릭터와 대화를 시작해보세요
        </Text>
        <Pressable
          onPress={() => router.push('/')}
          style={{
            backgroundColor: COLORS.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            marginTop: 24,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              fontFamily: 'Pretendard-Bold',
            }}
          >
            캐릭터 탐색하기
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <FlatList
        data={chatHistory}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
}