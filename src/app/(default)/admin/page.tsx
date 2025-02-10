import { getUser } from '@/_actions/getUser';
import db from '@/_lib/db';
import { UserList } from '@/app/(default)/admin/userList';
import { User } from '@prisma/client';
import { redirect } from 'next/navigation';
import { UserStats } from '@/app/(default)/admin/userStats';
import dayjs from 'dayjs';

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
          <h1 className={'text-3xl font-bold mb-5 dark:text-white'}>
            Nutzerübersicht
          </h1>

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
