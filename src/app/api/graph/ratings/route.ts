import { NextResponse } from 'next/server';
import db from '@/_lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const politicianIdParam = searchParams.get('politicianId');

  const ratings = politicianIdParam
    ? await db.rating.findMany({
        where: {
          politician_id: parseInt(politicianIdParam, 10),
        },
      })
    : await db.rating.findMany();

  return NextResponse.json(ratings);
}
