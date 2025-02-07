import { NextResponse } from 'next/server';
import db from '@/_lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyIdParam = searchParams.get('companyId');
  const politicianIdParam = searchParams.get('politicianId');

  if (companyIdParam) {
    const ratings = await db.rating.findMany({
      where: {
        company_id: parseInt(companyIdParam, 10),
      },
      include: {
        politician: true,
      },
    });
    return NextResponse.json(ratings);
  } else if (politicianIdParam) {
    const ratings = await db.rating.findMany({
      where: {
        politician_id: parseInt(politicianIdParam, 10),
      },
      include: {
        company: true,
      },
    });
    return NextResponse.json(ratings);
  } else {
    const ratings = await db.rating.findMany({
      include: {
        company: true,
        politician: true,
      },
    });
    return NextResponse.json(ratings);
  }
}
