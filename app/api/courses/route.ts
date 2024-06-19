import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const courses = await prisma.courses.findMany();
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ message: 'Failed to fetch courses'}, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, imgSrc, displayOrder } = await req.json();
    const data = {
      title,
      description,
      imgSrc:imgSrc,
      display_order: +displayOrder,
      created_at: new Date(),
      updated_at: new Date(),
      created_by:1001,
      total_videos:0,
    }
    const course = await prisma.courses.create({
      data: data,
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ message: 'Failed to create course' }, { status: 500 });
  }
}
