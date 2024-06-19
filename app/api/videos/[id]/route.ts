import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const videoId = parseInt(params.id, 10);

  try {
    const video = await prisma.videos.findUnique({
      where: { id: videoId },
      include: {
        Courses: true,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json({ message: 'Failed to fetch video' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const videoId = parseInt(params.id, 10);
  const { title, description, course_id, display_order } = await req.json();

  try {
    const video = await prisma.videos.update({
      where: { id: videoId },
      data: {
        title,
        description,
        course_id: parseInt(course_id, 10),
        display_order: parseInt(display_order, 10),
        updated_at: new Date(),
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json({ message: 'Failed to update video' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const videoId = parseInt(params.id, 10);

  try {
    await prisma.videos.delete({
      where: { id: videoId },
    });

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json({ message: 'Failed to delete video' }, { status: 500 });
  }
}
