import db from '@/_lib/db';
import { UserList } from '@/app/(default)/admin/userList';
import { UserStats } from '@/app/(default)/admin/userStats';
import dayjs from 'dayjs';

export default async function AdminPage() {
  const users = await db.user.findMany();

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

          <UserList defaultUsers={users} />

          <UserStats
            usersCreatedAt={users
              .filter((u) => date.isBefore(u.createdAt))
              .map((u) => u.createdAt)}
            commentsCreatedAt={comments.map((c) => c.createdAt)}
          />
        </div>
      </section>
    </>
  );
}
