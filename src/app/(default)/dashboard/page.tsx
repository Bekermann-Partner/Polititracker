import { User } from '@prisma/client';
import { getUser } from '@/_actions/getUser';
import { FollowedPoliticians } from '@/app/(default)/dashboard/followedPoliticians';
import Link from 'next/link';

export default async function DashboardPage() {
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
      <section className={'pt-24'}>
        <div className={'mx-auto max-w-6xl'}>
          <h1 className={'text-3xl font-bold dark:text-white'}>
            {user.firstName} {user.lastName}
          </h1>

          {user.isAdmin && (
            <div className={'mt-5'}>
              <Link
                href={'/admin'}
                className={
                  'bg-black dark:bg-gray-700 hover:bg-gray-800 transition-colors text-white rounded px-3 py-1.5'
                }
              >
                Zur Administration
              </Link>
            </div>
          )}
        </div>
      </section>
      <FollowedPoliticians user={user} />
    </>
  );
}
