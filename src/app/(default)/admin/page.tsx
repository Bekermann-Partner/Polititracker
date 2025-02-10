import { getUser } from '@/_actions/getUser';
import db from '@/_lib/db';
import { UserList } from '@/app/(default)/admin/userList';
import { User } from '@prisma/client';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const currentUser: User | null = await getUser();
  if (!currentUser || !currentUser.isAdmin) {
    return redirect('/auth/sign-in');
  }

  const allUsers = await db.user.findMany();

  return (
    <>
      <section className="pt-24 pb-24">
        <div className="mx-auto max-w-6xl">
          <h1 className={'text-3xl font-bold mb-5 dark:text-white'}>
            Nutzerübersicht
          </h1>

          <UserList defaultUsers={allUsers} />
        </div>
      </section>
    </>
  );
}
