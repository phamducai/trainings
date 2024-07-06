import queue, { addJobToQueue } from '@/lib/queue';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import prisma from '@/utils/prisma';

export async function GET(req: NextRequest) {
  const passThrough = new Readable({
    read() {}
  });
  const batchSize = 10000; // Điều chỉnh kích thước batch theo nhu cầu

  passThrough.push('\uFEFF'); // UTF-8 BOM cho tương thích với Excel
  const totalUsers = await prisma.users.count();
  console.log('Total users:', totalUsers);
  let completedBatches = 0;
  const totalBatches = Math.ceil(totalUsers / batchSize);

  queue.on('completed', (job, result) => {
    passThrough.push(result);
    completedBatches += 1;
    console.log('Completed batches:', completedBatches);
    if (completedBatches === totalBatches) {
      passThrough.push(null);
    }
  });

  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    console.log('Adding job to queue:', batchIndex);
    addJobToQueue(batchSize, batchIndex);
  }

  return new NextResponse(passThrough as any, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="users.csv"',
    },
  });
}

export async function POST(req: NextRequest) {
  const batchSize = 10000; // Điều chỉnh kích thước batch theo nhu cầu
  const totalUsers = await prisma.users.count();
  const totalBatches = Math.ceil(totalUsers / batchSize);
  
  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    addJobToQueue(batchSize, batchIndex);
  }

  return NextResponse.json({ message: 'Jobs added to queue' });
}
