import { NextResponse } from 'next/server';
import db from '@/_lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const companyId = parseInt(id, 10);
  if (isNaN(companyId)) {
    return NextResponse.json({ error: 'Invalid company ID' }, { status: 400 });
  }

  const company = await db.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  // Force conversion of all non-plain objects (like Decimal) into plain objects: has yet to work
  const plainCompany = JSON.parse(JSON.stringify(company));

  return NextResponse.json(plainCompany);
}
