import queue from '@/lib/queue';
import { format } from '@fast-csv/format';
import { PassThrough } from 'stream';
import prisma from '@/utils/prisma';

queue.process(async (job) => {
  const { batchSize, batchIndex } = job.data;

  const users = await prisma.users.findMany({
    skip: batchIndex * batchSize,
    take: batchSize,
  });

  const csvStream = format({ headers: true });
  const passThrough = new PassThrough();

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

  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    passThrough.on('data', chunk => chunks.push(chunk));
    passThrough.on('end', () => resolve(Buffer.concat(chunks)));
    passThrough.on('error', reject);
    csvStream.pipe(passThrough);
  });
});
