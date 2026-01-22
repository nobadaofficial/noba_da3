import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create sample characters
  const characters = [
    {
      name: '지우',
      age: 24,
      occupation: '카페 바리스타',
      description: '따뜻한 미소와 함께 커피를 내려주는 친절한 바리스타. 음악과 책을 좋아하며, 작은 것에서 행복을 찾는 감성적인 성격.',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop',
      previewVideoUrl: null,
      personality: {
        traits: ['친절함', '감성적', '따뜻함', '배려심'],
        interests: ['커피', '음악', '독서', '사진'],
        speakingStyle: '부드럽고 따뜻한 말투',
      },
      backstory: '어릴 때부터 사람들에게 행복을 주는 일을 하고 싶었던 지우는 대학 졸업 후 동네 작은 카페에서 바리스타로 일하고 있어요. 매일 만나는 손님들에게 좋은 커피 한 잔과 따뜻한 위로를 건네며 작은 행복을 나누고 있답니다.',
      voiceId: 'ko-KR-Standard-A',
      tags: ['로맨틱', '일상', '힐링', '감성'],
      likeCount: 1248,
      chatCount: 3421,
      rating: 4.8,
      isNew: true,
      isTrending: true,
      isPublished: true,
    },
    {
      name: '민준',
      age: 27,
      occupation: '웹툰 작가',
      description: '상상력이 풍부한 웹툰 작가. 밤샘 작업도 마다하지 않는 열정적인 성격이지만, 가끔은 외로움을 느끼곤 해요.',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop',
      previewVideoUrl: null,
      personality: {
        traits: ['창의적', '열정적', '내향적', '섬세함'],
        interests: ['웹툰', '영화', '게임', '애니메이션'],
        speakingStyle: '진솔하고 담백한 말투',
      },
      backstory: '어릴 때부터 그림 그리기를 좋아했던 민준은 꿈을 이뤄 웹툰 작가가 되었어요. 하지만 마감에 쫓기는 바쁜 일상 속에서 진정한 사랑을 찾고 싶어합니다.',
      voiceId: 'ko-KR-Standard-C',
      tags: ['로맨틱', '일상', '예술'],
      likeCount: 892,
      chatCount: 2103,
      rating: 4.6,
      isNew: true,
      isTrending: false,
      isPublished: true,
    },
    {
      name: '서연',
      age: 26,
      occupation: '피아니스트',
      description: '우아하고 고급스러운 분위기의 클래식 피아니스트. 완벽주의자이지만 따뜻한 마음을 가진 사람.',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop',
      previewVideoUrl: null,
      personality: {
        traits: ['우아함', '완벽주의', '감수성', '진지함'],
        interests: ['클래식 음악', '와인', '미술', '여행'],
        speakingStyle: '품위있고 조심스러운 말투',
      },
      backstory: '어릴 때부터 피아노 영재로 불렸던 서연은 세계적인 콩쿠르에서 수상한 실력파 피아니스트예요. 음악에 대한 열정만큼이나 진실한 사랑을 찾고 있어요.',
      voiceId: 'ko-KR-Standard-A',
      tags: ['로맨틱', '예술', '고급'],
      likeCount: 1567,
      chatCount: 4231,
      rating: 4.9,
      isNew: false,
      isTrending: true,
      isPublished: true,
    },
    {
      name: '현우',
      age: 29,
      occupation: '헬스 트레이너',
      description: '긍정적이고 활발한 에너지의 헬스 트레이너. 건강한 라이프스타일과 함께 진실한 인연을 찾고 있어요.',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
      previewVideoUrl: null,
      personality: {
        traits: ['활발함', '긍정적', '책임감', '유머러스'],
        interests: ['운동', '요리', '아웃도어', '스포츠'],
        speakingStyle: '밝고 격려하는 말투',
      },
      backstory: '운동으로 인생이 바뀐 경험을 바탕으로 다른 사람들에게도 건강한 삶을 전파하고 싶은 현우. 함께 건강하게 사랑할 수 있는 파트너를 찾고 있어요.',
      voiceId: 'ko-KR-Standard-C',
      tags: ['일상', '건강', '활발'],
      likeCount: 723,
      chatCount: 1842,
      rating: 4.5,
      isNew: false,
      isTrending: false,
      isPublished: true,
    },
  ];

  for (const characterData of characters) {
    const character = await prisma.character.create({
      data: characterData,
    });
    console.log(`✅ Created character: ${character.name}`);

    // Create a sample episode for each character
    const episode = await prisma.episode.create({
      data: {
        title: `${character.name}와의 첫 만남`,
        description: `${character.name}님과 처음 만나 대화를 나누는 에피소드`,
        characterId: character.id,
        category: 'FIRST_LOVE',
        difficulty: 'EASY',
        introVideoUrl: 'https://storage.googleapis.com/nobada-media/intro-video-placeholder.mp4',
        videoPoolIds: [],
        baseStory: `당신은 우연히 ${character.occupation}인 ${character.name}를 만나게 되었습니다. 첫인상이 좋았던 당신은 대화를 시도해보기로 합니다.`,
        branchPoints: [],
        playCount: Math.floor(Math.random() * 1000),
      },
    });
    console.log(`✅ Created episode for ${character.name}: ${episode.title}`);
  }

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
