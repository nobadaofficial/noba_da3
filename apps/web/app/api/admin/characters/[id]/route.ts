import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'nobada_admin_token_2026';

function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (token !== ADMIN_TOKEN) {
    throw new Error('Unauthorized');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    verifyAuth(request);

    const { id } = await params;
    const body = await request.json();

    // Update character
    const character = await prisma.character.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ character });
  } catch (error: any) {
    console.error('Error updating character:', error);

    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to update character' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    verifyAuth(request);

    const { id } = await params;

    // Delete character (cascade will handle related records)
    await prisma.character.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting character:', error);

    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to delete character' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    verifyAuth(request);

    const { id } = await params;

    const character = await prisma.character.findUnique({
      where: { id },
      include: {
        episodes: true,
        videoClips: true,
      },
    });

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ character });
  } catch (error: any) {
    console.error('Error fetching character:', error);

    if (error.message === 'Unauthorized' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch character' },
      { status: 500 }
    );
  }
}
