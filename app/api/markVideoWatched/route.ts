// app/api/markVideoWatched/route.ts
import { NextResponse } from 'next/server';
import prisma from "@/utils/prisma";

export async function POST(request: Request) {
  const { userId, videoId ,courseId} = await request.json();
  try {
    await prisma.usersVideo.upsert({
      where: {
        user_id_video_id: {
          user_id: userId,
          video_id: videoId,
        },
      },
      update: {
        updated_at: new Date(),
      },
      create: {
        user_id: userId,
        video_id: videoId,
        is_watched: true,
        course_id: courseId,
        updated_at: new Date(),
      },
    });
    return NextResponse.json({ message: 'Video watch status updated' }, { status: 200 });
  } catch (error) {
    console.error('Error marking video as watched:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
