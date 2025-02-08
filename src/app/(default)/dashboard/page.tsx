import { User } from '@prisma/client';
import { getUser } from '@/_actions/getUser';
import { FollowedPoliticians } from '@/app/(default)/dashboard/followedPoliticians';
import { UserComments } from '@/app/(default)/dashboard/UserComments';
import { UserOverview } from './UserOverview';

export default async function ProfilePage() {
  const user: User | null = await getUser();

  if (!user) {
    return (
      <section className={'pt-24'}>
        <div className={'mx-auto max-w-6xl'}>
          <h1 className={'text-3xl font-bold'}>
            Ein unerwarteter Fehler ist aufgetreten, versuche es bitte später
            erneut!
          </h1>
        </div>
      </section>
    );
  }

  return (
    <>
      <UserOverview user={user} />

      <FollowedPoliticians user={user} />

      <UserComments user={user} />
    </>
  );
}
