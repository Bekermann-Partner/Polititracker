'use server';

import prisma from '@/_lib/db';

function transformBigInts(value: unknown): unknown {
  if (typeof value === 'bigint') {
    return value.toString();
  } else if (Array.isArray(value)) {
    return value.map(transformBigInts);
  } else if (value !== null && typeof value === 'object') {
    const newObj: Record<string, unknown> = {};
    for (const key in value as Record<string, unknown>) {
      newObj[key] = transformBigInts((value as Record<string, unknown>)[key]);
    }
    return newObj;
  }
  return value;
}

export async function executeRequest(query: string): Promise<unknown[]> {
  const qLower = query.toLowerCase();

  if (
    qLower.includes('delete') ||
    qLower.includes('update') ||
    qLower.includes('drop') ||
    qLower.includes('truncate')
  ) {
    throw new Error('Invalid SQL keyword provided!');
  }

  const result: unknown = await prisma.$queryRawUnsafe(query);

  const normalizedResult: unknown[] = Array.isArray(result) ? result : [result];

  return transformBigInts(normalizedResult) as unknown[];
}
