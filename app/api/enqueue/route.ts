import { NextRequest, NextResponse } from 'next/server';
import { format } from '@fast-csv/format';
import { PassThrough } from 'stream';
import prisma from '@/utils/prisma';
import { UserVideoDTO } from '@/dto/userVideo.dto';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId');
  if (!courseId) {
    return NextResponse.json({ message: 'Course ID is required' }, { status: 400 });
  }

  const course = await prisma.courses.findUnique({ where: { id: +courseId } });
  if (!course) {
    return NextResponse.json({ message: 'Course not found' }, { status: 404 });
  }

  const usersVideos: UserVideoDTO[] = await prisma.$queryRaw<UserVideoDTO[]>`
    SELECT 
      u.user_id AS UserID,
      u.name AS UserName,
      c.title AS CourseName,
      GROUP_CONCAT(v.id ORDER BY v.id ASC SEPARATOR ', ') AS VideosWatched
    FROM usersVideo uv
    JOIN Users u ON uv.user_id = u.user_id
    JOIN Courses c ON uv.course_id = c.id
    JOIN Videos v ON uv.video_id = v.id
    WHERE uv.course_id = ${courseId}
    GROUP BY u.user_id, u.name, c.title;
  `;

  const videos = await prisma.videos.findMany({ where: { course_id: +courseId } });
  const videoHeaders = videos.map(video => video.title);
  const videoIdToTitleMap = videos.reduce((acc, video) => {
    acc[video.id.toString()] = video.title;
    return acc;
  }, {} as { [key: string]: string });

  const csvStream = format({ headers: true });
  const passThrough = new PassThrough();
  passThrough.write('\uFEFF');

  const chunks: any[] = [];
  passThrough.on('data', chunk => chunks.push(chunk));

  csvStream.pipe(passThrough);

  // Tạo header động và viết vào CSV
  const headers = ['UserID', 'UserName', 'CourseName', ...videoHeaders];
  csvStream.write(headers);

  // Viết dữ liệu vào CSV
  usersVideos.forEach((row) => {
    const videosWatched = row.VideosWatched.split(',').map((id: string) => id.trim());
    const videoData = videoHeaders.reduce((acc: { [key: string]: number }, videoTitle: string) => {
      const videoId = Object.keys(videoIdToTitleMap).find(key => videoIdToTitleMap[key] === videoTitle);
      if (videoId) {
        acc[videoTitle] = videosWatched.includes(videoId) ? 1 : 0;
      }
      return acc;
    }, {});
    csvStream.write({
      UserID: row.UserID,
      UserName: row.UserName,
      CourseName: row.CourseName,
      ...videoData
    });
  });

  csvStream.end();

  return new Promise<NextResponse>((resolve, reject) => {
    passThrough.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const headers = new Headers();
      headers.set('Content-Type', 'text/csv; charset=utf-8');
      headers.set('Content-Disposition', `attachment; filename="course_${courseId}.csv"`);

      resolve(new NextResponse(buffer, { headers }));
    });

    passThrough.on('error', (error) => {
      console.error("Stream error:", error);
      reject(error);
    });
  });
}
