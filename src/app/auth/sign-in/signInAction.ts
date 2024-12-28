'use server'

import {zfd} from "zod-form-data";
import {z, ZodError} from "zod";
import db from "@/_lib/db";
import bcrypt from "bcrypt";
import {cookies} from "next/headers";
import {User} from "@prisma/client";
import {excludeFromObject} from "@/_lib/util";
import {redirect} from "next/navigation";
import * as jwt from "jose";
import {USER_SESSION_COOKIE_NAME} from "@/app/auth/config";

const signInUserValidation = zfd.formData({
    email: zfd.text(z.string().email()),
    password: zfd.text(z.string()),
});

/**
 * Attempts to sign in a user based on their email and password.
 * On success, sets session cookies and notifies the frontend in order to redirect to profile page (or current page?)
 * TODO: Change email to username?
 * TODO: Return and display the error
 * @param formData
 */
export async function signIn(formData: FormData): Promise<Omit<User, 'password'> | ZodError | undefined> {
    const cookieStore = await cookies();
    const parse = signInUserValidation.safeParse(formData);
    if (parse.success) {
        const user = await db.user.findFirst({
            where: {
                email: parse.data.email
            },
        });

        if (!user) {
            return undefined;
        }

        if (await bcrypt.compare(parse.data.password, user.password)) {
            const jwtKey = jwt.base64url.decode(process.env.APP_KEY ?? "");

            const token = await new jwt.SignJWT(excludeFromObject(user, ['password']))
                .setProtectedHeader({alg: "HS256"})
                .setIssuedAt()
                .setExpirationTime('7d')
                .sign(jwtKey);

            cookieStore.set(USER_SESSION_COOKIE_NAME, token);
            redirect('/');
        }
    }
}