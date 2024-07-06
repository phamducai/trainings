import Bull from 'bull';

const queue = new Bull('data-processing', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

export const addJobToQueue = (batchSize: number, batchIndex: number) => {
  queue.add({ batchSize, batchIndex });
};

export default queue;
