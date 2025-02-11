import { getUser } from '@/_actions/getUser';
import db from '@/_lib/db';
import { UserList } from '@/app/(default)/admin/userList';
import { User } from '@prisma/client';
import { redirect } from 'next/navigation';
import { UserStats } from '@/app/(default)/admin/userStats';
import dayjs from 'dayjs';
import Link from 'next/link';

export default async function AdminPage() {
  const currentUser: User | null = await getUser();
  if (!currentUser || !currentUser.isAdmin) {
    return redirect('/auth/sign-in');
  }

  const allUsers = await db.user.findMany();

  const date = dayjs().subtract(10, 'day').startOf('day');
  const comments = await db.comment.findMany({
    where: {
      createdAt: {
        gte: date.toDate(),
      },
    },
    select: {
      createdAt: true,
    },
  });

  return (
    <>
      <section className="mt-10 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className={'flex justify-between'}>
            <h1 className={'text-3xl font-bold mb-5 dark:text-white'}>
              Nutzerübersicht
            </h1>

            <div>
              <Link
                href={'/admin/advanced'}
                className={
                  'flex w-full justify-center rounded-md bg-black dark:bg-gray-700 hover:bg-gray-800 transition-colors px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                }
              >
                Fortgeschritten
              </Link>
            </div>
          </div>

          <UserList defaultUsers={allUsers} />
          <UserStats
            usersCreatedAt={allUsers
              .filter((u) => date.isBefore(u.createdAt))
              .map((u) => u.createdAt)}
            commentsCreatedAt={comments.map((c) => c.createdAt)}
          />
        </div>
      </section>
    </>
  );
}
