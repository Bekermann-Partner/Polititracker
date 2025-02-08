'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOutAction } from '@/app/auth/sign-out/signOutAction';

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    async function signOut() {
      await signOutAction();
    }

    signOut().then(() => {
      router.push('/');
      router.refresh();
    });
  });

  return <></>;
}
