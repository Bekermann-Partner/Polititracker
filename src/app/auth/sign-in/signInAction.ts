'use server';

import { zfd } from 'zod-form-data';
import { z, ZodError } from 'zod';
import db from '@/_lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { User } from '@prisma/client';
import { excludeFromObject } from '@/_lib/util';
import * as jwt from 'jose';
import { USER_SESSION_COOKIE_NAME } from '@/app/auth/config';

const signInUserValidation = zfd.formData({
  email: zfd.text(z.string().email()),
  password: zfd.text(z.string()),
});

export async function getXAuthURL() {
  const authUrl = new URL('https://x.com/i/oauth2/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', process.env.X_OAUTH_CLIENT!);
  authUrl.searchParams.set('redirect_uri', process.env.X_OAUTH_REDIRECT!);
  authUrl.searchParams.set('scope', 'users.read tweet.read');
  authUrl.searchParams.set('state', 'state');
  authUrl.searchParams.set('code_challenge', 'challenge');
  authUrl.searchParams.set('code_challenge_method', 'plain');

  return authUrl.toString();
}

/**
 * Attempts to sign in a user based on their email and password.
 * On success, sets session cookies and notifies the frontend in order to redirect to profile page (or current page?)
 * TODO: Change email to username?
 * TODO: Return and display the error
 * @param formData
 */
export async function signIn(
  formData: FormData
): Promise<Omit<User, 'password'> | ZodError | undefined> {
  const cookieStore = await cookies();
  const parse = signInUserValidation.safeParse(formData);
  if (parse.success) {
    const user = await db.user.findFirst({
      where: {
        email: parse.data.email,
      },
    });

    if (!user) {
      return undefined;
    }

    if (await bcrypt.compare(parse.data.password, user.password)) {
      const jwtKey = jwt.base64url.decode(process.env.APP_KEY ?? '');

      const token = await new jwt.SignJWT(excludeFromObject(user, ['password']))
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(jwtKey);

      cookieStore.set(USER_SESSION_COOKIE_NAME, token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        secure: true,
        httpOnly: true,
      });

      return excludeFromObject(user, ['password']);
    }
  }
}
