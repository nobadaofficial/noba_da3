import { View, ScrollView, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import {
  Settings,
  Heart,
  Diamond,
  Clock,
  Award,
  HelpCircle,
  LogOut,
  ChevronRight,
  User
} from 'lucide-react-native';
import { COLORS } from '@nobada/constants';

export default function ProfileScreen() {
  const router = useRouter();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/sign-in');
  };

  const menuItems = [
    {
      icon: Heart,
      title: '보유 하트',
      value: '120',
      color: COLORS.primary,
      onPress: () => router.push('/purchase'),
    },
    {
      icon: Diamond,
      title: '다이아몬드',
      value: '50',
      color: '#8B5CF6',
      onPress: () => router.push('/purchase'),
    },
    {
      icon: Clock,
      title: '플레이 시간',
      value: '24시간',
      color: COLORS.info,
      onPress: () => router.push('/stats'),
    },
    {
      icon: Award,
      title: '달성 엔딩',
      value: '5개',
      color: COLORS.warning,
      onPress: () => router.push('/achievements'),
    },
  ];

  const settingsItems = [
    {
      icon: Settings,
      title: '설정',
      onPress: () => router.push('/settings'),
    },
    {
      icon: HelpCircle,
      title: '고객 지원',
      onPress: () => router.push('/support'),
    },
  ];

  if (!isSignedIn) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
        <User size={64} color={COLORS.textSecondary} />
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Pretendard-Bold',
            color: COLORS.text,
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          로그인이 필요해요
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Pretendard-Regular',
            color: COLORS.textSecondary,
            marginBottom: 24,
            textAlign: 'center',
            paddingHorizontal: 32,
          }}
        >
          로그인하고 나만의 연애 스토리를 만들어보세요
        </Text>
        <Pressable
          onPress={() => router.push('/sign-in')}
          style={{
            backgroundColor: COLORS.primary,
            paddingHorizontal: 32,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontFamily: 'Pretendard-Bold',
            }}
          >
            로그인
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Profile Header */}
      <View style={{ alignItems: 'center', paddingVertical: 24 }}>
        {user?.imageUrl ? (
          <Image
            source={{ uri: user.imageUrl }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
            }}
          />
        ) : (
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: COLORS.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={40} color={COLORS.textSecondary} />
          </View>
        )}
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Pretendard-Bold',
            color: COLORS.text,
            marginTop: 12,
          }}
        >
          {user?.firstName || user?.username || '사용자'}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Pretendard-Regular',
            color: COLORS.textSecondary,
            marginTop: 4,
          }}
        >
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      {/* Stats Grid */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: 16,
          gap: 12,
        }}
      >
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            onPress={item.onPress}
            style={{
              width: '48%',
              backgroundColor: COLORS.surface,
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: `${item.color}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <item.icon size={20} color={item.color} />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Pretendard-Regular',
                    color: COLORS.textSecondary,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Pretendard-Bold',
                    color: COLORS.text,
                  }}
                >
                  {item.value}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Settings Menu */}
      <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
        {settingsItems.map((item, index) => (
          <Pressable
            key={index}
            onPress={item.onPress}
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <item.icon size={20} color={COLORS.textSecondary} />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Pretendard-Medium',
                  color: COLORS.text,
                  marginLeft: 12,
                }}
              >
                {item.title}
              </Text>
            </View>
            <ChevronRight size={20} color={COLORS.textSecondary} />
          </Pressable>
        ))}
      </View>

      {/* Sign Out Button */}
      <Pressable
        onPress={handleSignOut}
        style={{
          marginHorizontal: 16,
          marginTop: 12,
          marginBottom: 32,
          backgroundColor: COLORS.surface,
          borderRadius: 12,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LogOut size={20} color={COLORS.error} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Pretendard-Medium',
            color: COLORS.error,
            marginLeft: 8,
          }}
        >
          로그아웃
        </Text>
      </Pressable>
    </ScrollView>
  );
}