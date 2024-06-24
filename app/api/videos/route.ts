import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Writable } from 'stream';
import { createWriteStream } from 'fs';
import prisma from '@/utils/prisma';

async function pump(reader: ReadableStreamDefaultReader<Uint8Array>, nodeStream: Writable) {
  const { done, value } = await reader.read();
  if (done) {
    nodeStream.end();
    return;
  }
  nodeStream.write(value);
  await pump(reader, nodeStream);
}

export async function POST(req: NextRequest) {
  const uploadDir = path.join(process.cwd(), 'public/videos');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const courseId = formData.get('course_id') as string | null;
    const description = formData.get('description') as string | null;
    const displayOrder = formData.get('display_order') as string | null;

    if (!file || !title || !courseId || !description || !displayOrder) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    console.log(`Uploading file to ${filePath}`); // Log file path

    const writableStream = createWriteStream(filePath);
    const readableStream = file.stream();

    const reader = readableStream.getReader();

    const nodeStream = new Writable({
      write(chunk, encoding, callback) {
        writableStream.write(chunk, encoding, callback);
      },
      final(callback) {
        writableStream.end(callback);
      },
    });

    await pump(reader, nodeStream);
    await prisma.videos.create({
      data: {
        url: `/videos/${fileName}?v=${Date.now()}`,  // Cập nhật URL để phản ánh đường dẫn mới
        title,
        description,
        display_order: parseInt(displayOrder, 10),
        course_id: parseInt(courseId, 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ message: 'File uploaded and data saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file and save data' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const courseId = url.searchParams.get('courseId');

    if (courseId) {
      if (isNaN(Number(courseId))) {
        return NextResponse.json({ message: 'Invalid course ID' }, { status: 400 });
      }

      const course = await prisma.courses.findUnique({
        where: { id: Number(courseId) },
        select: {
          title: true,
          Videos: {
            orderBy: { display_order: 'asc' },
            select: {
              title: true,
              url: true,
              description: true,
              id: true,
            },
          },
          
        },
      });

      if (!course) {
        return NextResponse.json({ message: 'Course not found' }, { status: 404 });
      }

      return NextResponse.json(course);
    } else {
      const videos = await prisma.videos.findMany({
        orderBy: { updated_at: 'desc' },
      });
      return NextResponse.json(videos);
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ message: 'Failed to fetch videos' }, { status: 500 });
  }
}
