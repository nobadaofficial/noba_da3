import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const ADMIN_COOKIE_NAME = 'nobada_admin_auth';

async function verifyAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(ADMIN_COOKIE_NAME);

  if (!authCookie || authCookie.value !== 'authenticated') {
    throw new Error('Unauthorized');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await verifyAuth();

    const body = await request.json();

    // Create character
    const character = await prisma.character.create({
      data: {
        name: body.name,
        age: body.age,
        occupation: body.occupation,
        description: body.description || '',
        personality: body.personality || {
          openness: 50,
          warmth: 50,
          playfulness: 50,
          mysteriousness: 50,
        },
        backstory: body.backstory || '',
        voiceId: body.voiceId || 'default',
        tags: body.tags || [],
        profileImage: body.profileImage || '',
        thumbnailUrl: body.thumbnailUrl || '',
        previewVideoUrl: body.previewVideoUrl || null,
        isPublished: body.isPublished || false,
        isNew: body.isNew !== undefined ? body.isNew : true,
        isTrending: body.isTrending || false,
        likeCount: 0,
        chatCount: 0,
        rating: 4.5,
      },
    });

    return NextResponse.json({ character }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating character:', error);

    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to create character', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    await verifyAuth();

    const characters = await prisma.character.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        episodes: true,
        videoClips: true,
      },
    });

    return NextResponse.json({ characters });
  } catch (error: any) {
    console.error('Error fetching characters:', error);

    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    );
  }
}
