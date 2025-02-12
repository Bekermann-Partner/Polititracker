import { getUser } from '@/_actions/getUser';
import { User } from '@prisma/client';
import { redirect } from 'next/navigation';
import { SqlForm } from './sqlForm';

export default async function Page() {
  const currentUser: User | null = await getUser();
  if (!currentUser || !currentUser.isAdmin) {
    return redirect('/auth/sign-in');
  }

  return <SqlForm />;
}
