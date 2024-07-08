// app/api/markVideoWatched/route.ts
import { NextResponse } from 'next/server';
import prisma from "@/utils/prisma";

export async function POST(request: Request) {
  const { userId, videoId ,courseId} = await request.json();
  try {
    const existingRecord = await prisma.usersVideo.findUnique({
      where: {
        user_id_video_id: {
          user_id: userId,
          video_id: videoId,
        },
      },
    });

    if (!existingRecord) {
      await prisma.usersVideo.create({
        data: {
          user_id: userId,
          video_id: videoId,
          is_watched: true,
          course_id:courseId
        },
      });
      return NextResponse.json({ message: 'Video marked as watched' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Video already marked as watched' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error marking video as watched:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
