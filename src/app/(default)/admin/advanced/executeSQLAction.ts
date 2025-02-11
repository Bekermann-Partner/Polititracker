'use server';

import prisma from '@/_lib/db';

function transformBigInts(value: any): any {
  if (typeof value === 'bigint') {
    return value.toString();
  } else if (Array.isArray(value)) {
    return value.map(transformBigInts);
  } else if (value !== null && typeof value === 'object') {
    const newObj: Record<string, any> = {};
    for (const key in value) {
      newObj[key] = transformBigInts(value[key]);
    }
    return newObj;
  }
  return value;
}

export async function executeRequest(query: string) {
  const qLower = query.toLowerCase();

  if (
    qLower.includes('delete') ||
    qLower.includes('update') ||
    qLower.includes('drop') ||
    qLower.includes('truncate')
  ) {
    throw new Error('Invalid SQL keyword provided!');
  }

  const result = await prisma.$queryRawUnsafe(query);

  const normalizedResult = Array.isArray(result) ? result : [result];

  return transformBigInts(normalizedResult);
}
