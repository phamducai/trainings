import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const courseId = parseInt(params.id, 10);
  
  try {
    const course = await prisma.courses.findUnique({
      where: { id: courseId },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ message: 'Failed to fetch course' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const courseId = +params.id;
  const { title, description, imgSrc, displayOrder } = await req.json();
  
  try {
    const course = await prisma.courses.update({
      where: { id: courseId },
      data: { title, description, imgSrc, display_order: +displayOrder,updated_at: new Date()},
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ message: 'Failed to update course' }, { status: 500 });
  }
}
