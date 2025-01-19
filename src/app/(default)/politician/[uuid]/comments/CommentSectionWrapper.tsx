'use server';

import { Politician } from '@prisma/client';
import { getUser } from '@/_actions/getUser';
import CommentSection from '@/app/(default)/politician/[uuid]/comments/CommentSection';

export default async function CommentSectionWrapper({
  politicianPromise,
}: {
  politicianPromise: Promise<Politician | null>;
}) {
  const politician = await politicianPromise;
  const user = await getUser();

  return <CommentSection currentUser={user} politician={politician!} />;
}
