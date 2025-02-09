'use server';

import { redirect } from 'next/navigation';
import db from '@/_lib/db';
import * as jwt from 'jose';
import { excludeFromObject } from '@/_lib/util';
import { cookies } from 'next/headers';
import { USER_SESSION_COOKIE_NAME } from '@/app/auth/config';

export async function oauthSignIn(code?: string) {
  const cookieStore = await cookies();

  if (!code) {
    return redirect('/auth/sign-in?error=true');
  }

  const clientIdSecret = `${process.env.X_OAUTH_CLIENT!}:${process.env.X_OAUTH_SECRET!}`;
  const authHeader = 'Basic ' + Buffer.from(clientIdSecret).toString('base64');

  try {
    const clientCredentials: { access_token: string } = await fetch('https://api.x.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${authHeader}`,
      },
      body: new URLSearchParams({
        code: code,
        grant_type: 'authorization_code',
        client_id: process.env.X_OAUTH_CLIENT!,
        redirect_uri: process.env.X_OAUTH_REDIRECT!,
        code_verifier: 'challenge',
      }),
    }).then(res => res.json());

    const accessToken = clientCredentials.access_token;

    const user = await fetch('https://api.x.com/2/users/me', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }).then(res => res.json());

    // Try to find user with ext_twitter_id or create one otherwise
    const dbUser = await db.user.findFirst({
      where: {
        ext_twitter_id: user.data.id,
      },
    });

    let signInUser;

    if (dbUser != null) {
      signInUser = dbUser;
    } else {
      const fullName = user.data.name;
      let nameArr = ['', ''];
      if (fullName.split(' ').length > 1) {
        nameArr = fullName.split(' ');
      } else {
        nameArr[0] = fullName;
      }

      signInUser = await db.user.create({
        data: {
          ext_twitter_id: user.data.id,
          firstName: nameArr[0],
          lastName: nameArr[1],
          email: `${user.data.id}-ext-x@politracker.de`,
          password: '',
        },
      });
    }

    const jwtKey = jwt.base64url.decode(process.env.APP_KEY ?? '');

    const token = await new jwt.SignJWT(excludeFromObject(signInUser, ['password']))
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(jwtKey);

    cookieStore.set(USER_SESSION_COOKIE_NAME, token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
      httpOnly: true,
    });

    // eslint-disable-next-line
  } catch (err: any) {
    console.error('Failed to login user! Error: ' + err);
    console.error(err);
    redirect('/auth/sign-in?error=true');
  }
}