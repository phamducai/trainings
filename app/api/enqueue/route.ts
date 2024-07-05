import { NextRequest, NextResponse } from 'next/server';
import { format } from '@fast-csv/format';
import { PassThrough } from 'stream';
import { addJobToQueue } from '@/lib/queue';
import prisma from '@/utils/prisma';

export async function GET(req: NextRequest) {
  const users = await prisma.users.findMany();
  console.log("users", users); // Kiểm tra xem dữ liệu có được truy vấn đúng không

  const csvStream = format({ headers: true });
  const passThrough = new PassThrough();
  passThrough.write('\uFEFF');

  const chunks: any[] = [];
  passThrough.on('data', chunk => chunks.push(chunk));

  csvStream.pipe(passThrough);

  users.forEach(user => {
    csvStream.write({
      id: user.id,
      user_id: user.user_id,
      name: user.name,
      full_name: user.full_name,
      day_off: user.day_off,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      update_at: user.update_at,
    });
  });

  csvStream.end();

  return new Promise<NextResponse>((resolve, reject) => {
    passThrough.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const headers = new Headers();
      headers.set('Content-Type', 'text/csv; charset=utf-8');
      headers.set('Content-Disposition', 'attachment; filename="users.csv"');

      resolve(new NextResponse(buffer, {
        headers
      }));
    });
    passThrough.on('error', reject);
  });
}

export async function POST(req: NextRequest) {
  addJobToQueue();
  return NextResponse.json({ message: 'Job added to queue' });
}
