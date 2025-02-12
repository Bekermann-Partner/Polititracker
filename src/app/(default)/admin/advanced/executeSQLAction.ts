'use server';

import prisma from '@/_lib/db';

export async function executeRequest(query: string) {
  const qLower = query.toLowerCase();

  if (
    qLower.includes('delete') ||
    qLower.includes('update') ||
    qLower.includes('drop') ||
    qLower.includes('truncate') ||
    qLower.includes('create') ||
    qLower.includes('exec') ||
    qLower.includes('insert') ||
    qLower.includes('user')
  ) {
    throw new Error('Invalid SQL keyword provided!');
  }

  // eslint-disable-next-line
  return prisma.$queryRawUnsafe(query) as Promise<any[]>;
}
