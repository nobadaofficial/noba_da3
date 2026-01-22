import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-expo';
import { COLORS } from '@nobada/constants';

export default function SignInScreen() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
      router.replace('/');
    } catch (err: any) {
      setError(err.errors?.[0]?.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: COLORS.background }}
    >
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <Text
          style={{
            fontSize: 32,
            fontFamily: 'Pretendard-Bold',
            color: COLORS.text,
            marginBottom: 8,
          }}
        >
          다시 만나요!
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Pretendard-Regular',
            color: COLORS.textSecondary,
            marginBottom: 32,
          }}
        >
          계정에 로그인하여 대화를 이어가세요
        </Text>

        {/* Email Input */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Pretendard-Medium',
              color: COLORS.text,
              marginBottom: 8,
            }}
          >
            이메일
          </Text>
          <TextInput
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="email@example.com"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              fontFamily: 'Pretendard-Regular',
              color: COLORS.text,
            }}
          />
        </View>

        {/* Password Input */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Pretendard-Medium',
              color: COLORS.text,
              marginBottom: 8,
            }}
          >
            비밀번호
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={COLORS.textSecondary}
            secureTextEntry
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              fontFamily: 'Pretendard-Regular',
              color: COLORS.text,
            }}
          />
        </View>

        {/* Error Message */}
        {error ? (
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Pretendard-Regular',
              color: COLORS.error,
              marginBottom: 16,
            }}
          >
            {error}
          </Text>
        ) : null}

        {/* Sign In Button */}
        <Pressable
          onPress={handleSignIn}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? COLORS.textSecondary : COLORS.primary,
            paddingVertical: 16,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontFamily: 'Pretendard-Bold',
            }}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Text>
        </Pressable>

        {/* Sign Up Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Pretendard-Regular',
              color: COLORS.textSecondary,
            }}
          >
            계정이 없으신가요?{' '}
          </Text>
          <Pressable onPress={() => router.push('/sign-up')}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Pretendard-Bold',
                color: COLORS.primary,
              }}
            >
              회원가입
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}