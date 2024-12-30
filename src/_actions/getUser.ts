'use server'

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { User } from '@prisma/client';

/**
 * Retrieves the authenticated user from the session cookie.
 *
 * This function reads the `user_session` cookie from the request's cookies, 
 * verifies its JWT signature using a secret key (`APP_KEY`), and returns the decoded user payload 
 * if the verification is successful. If the cookie is missing, the JWT is invalid, 
 * or any error occurs during verification, the function returns `null`.
 *
 * @returns {Promise<User | null>} The user object if the JWT is valid, or `null` if no valid user is found.
 * @throws {Error} If the JWT key (`APP_KEY`) is not provided in the environment variables.
 */
export async function getUser() : Promise<User | null> {
    const cookieJar = await cookies();
    const jwtKey = process.env.APP_KEY ? Buffer.from(process.env.APP_KEY, 'base64') : null;

    if (!jwtKey) {
        throw new Error('JWT key is missing.');
    }

    const cookie = cookieJar.get('user_session');
    if (!cookie) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(cookie.value, jwtKey);
        return payload as User;
    } catch (error) {
        console.error('Error verifying JWT:', error);
        return null;
    }
}