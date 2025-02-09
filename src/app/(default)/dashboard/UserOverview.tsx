import { User } from '@prisma/client';
import Link from 'next/link';
import db from '@/_lib/db';
import { GCS_AVATAR_URL_BASE } from '@/app/config';

export async function UserOverview({ user }: { user: User }) {
  const followedPoliticians = await db.follow.count({
    where: {
      userId: user.id,
    },
  });

  const comments = await db.comment.findMany({
    where: {
      userId: user.id,
    },
    include: {
      replies: true,
    },
  });

  const replyCount = comments.reduce(
    (curr, comment) => curr + comment.replies.length,
    0
  );

  return (
    <>
      <section className={'mt-10'}>
        <div className={'mx-auto max-w-6xl'}>
          <div className="border rounded-lg shadow-md p-4 duration-200 dark:bg-gray-900 dark:border-gray-700">
            <div className="flex">
              {/* TODO: Auf kleineren Bildschirmen wird das aktuell noch sehr hässlich :/ */}
              <div className="flex flex-col items-center justify-center mr-4">
                <img
                  src={`${GCS_AVATAR_URL_BASE}/${user.profile_image}`}
                  alt={'Avatar'}
                  width={150}
                  height={150}
                  className={'rounded-full object-cover aspect-square mb-4'}
                />
                <Link
                  href={'/dashboard/edit'}
                  className="flex w-full justify-center rounded-md bg-black dark:bg-gray-700 hover:bg-gray-800 transition-colors px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Profil bearbeiten
                </Link>
              </div>

              <div className="ml-4">
                <h1 className={'text-3xl font-bold mb-2 dark:text-white'}>
                  Wilkommen, {user.firstName} {user.lastName}!
                </h1>

                <div className={'dark:text-gray-300'}>
                  Auf dieser Seite findest du einen Überblick über deine
                  Aktivitäten.
                </div>

                <div className="mt-8 dark:text-gray-300">
                  <div className="font-bold">Deine Statistiken:</div>

                  <span>Politikern gefolgt: {followedPoliticians}</span>
                  <span className="ml-8">
                    Kommentare verfasst: {comments.length}
                  </span>
                  <span className="ml-8">Antworten erhalten: {replyCount}</span>
                </div>
              </div>

              <div className={'ml-auto mt-2'}>
                {user.isAdmin && (
                  <Link
                    href={'/admin'}
                    className={
                      'flex w-full justify-center rounded-md bg-black dark:bg-gray-700 hover:bg-gray-800 transition-colors px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    }
                  >
                    Zur Administration
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
