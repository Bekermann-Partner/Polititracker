import { NextResponse } from 'next/server';
import db from '@/_lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const politicianId = parseInt(id, 10);
  if (isNaN(politicianId)) {
    return NextResponse.json(
      { error: 'Invalid politician ID' },
      { status: 400 }
    );
  }

  const politician = await db.politician.findUnique({
    where: { ext_abgeordnetenwatch_id: politicianId },
  });

  if (!politician) {
    return NextResponse.json(
      { error: 'Politician not found' },
      { status: 404 }
    );
  }

  const plainPolitician = JSON.parse(JSON.stringify(politician));

  return NextResponse.json(plainPolitician);
}
