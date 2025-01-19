'use server';

import { cookies } from 'next/headers';
import { USER_SESSION_COOKIE_NAME } from '@/app/auth/config';

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_SESSION_COOKIE_NAME);
}
