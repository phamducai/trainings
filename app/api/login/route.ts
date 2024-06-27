import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers'

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = await prisma.users.findUnique({
    where: { email },
  });
  if (user && user.password === password) {
    cookies().set('session', JSON.stringify({ user }), {
      httpOnly: true,
      maxAge: 60 * 60, 
      path: '/',
    })
    return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role });  }
else {
    return NextResponse.json({ message: 'Email hoặc mật khẩu không đúng' }, { status: 401 });
  }
}
