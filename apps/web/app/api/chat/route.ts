import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, episodeId, message } = body;

    if (!userId || !episodeId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find or create chat session
    let session = await prisma.chatSession.findFirst({
      where: {
        userId,
        episodeId,
        status: 'ACTIVE',
      },
    });

    if (!session) {
      // Create new session
      session = await prisma.chatSession.create({
        data: {
          userId,
          episodeId,
          messages: [],
          relationshipScore: 0,
          emotionalState: {
            happiness: 50,
            interest: 50,
            trust: 50,
          },
          storyProgress: 0,
          unlockedGallery: [],
          status: 'ACTIVE',
        },
      });
    }

    // TODO: Integrate with Gemini AI for response generation
    // For now, return a placeholder response
    const aiResponse = {
      text: "안녕하세요! 저는 아직 AI 시스템이 연결되지 않았어요. 곧 실제 대화를 나눌 수 있을 거예요!",
      videoUrl: null,
      audioUrl: null,
      emotion: 'neutral',
      relationshipChange: 0,
    };

    // Update session with new messages
    const currentMessages = (session.messages as any[]) || [];
    const updatedMessages = [
      ...currentMessages,
      {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      },
      {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.text,
        videoUrl: aiResponse.videoUrl,
        audioUrl: aiResponse.audioUrl,
        emotion: aiResponse.emotion,
        timestamp: new Date().toISOString(),
      },
    ];

    await prisma.chatSession.update({
      where: { id: session.id },
      data: {
        messages: updatedMessages,
        relationshipScore: session.relationshipScore + aiResponse.relationshipChange,
        lastPlayedAt: new Date(),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      response: aiResponse,
      relationshipScore: session.relationshipScore + aiResponse.relationshipChange,
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        episode: {
          include: {
            character: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error fetching chat session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat session' },
      { status: 500 }
    );
  }
}
