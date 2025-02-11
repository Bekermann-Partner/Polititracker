'use server';

import prisma from '@/_lib/db';

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

  // Falls das Ergebnis kein Array ist (z. B. bei einer COUNT-Abfrage), packen wir es in ein Array.
  return Array.isArray(result) ? result : [result];
}
