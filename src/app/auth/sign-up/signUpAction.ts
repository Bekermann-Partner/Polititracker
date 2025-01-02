'use server'

import {zfd} from "zod-form-data";
import {z} from "zod";
import db from "@/_lib/db";
import bcrypt from "bcryptjs";

const createUserValidation = zfd.formData({
    firstName: zfd.text(),
    lastName: zfd.text(),
    email: zfd.text(z.string().email()),
    password: zfd.text(z.string()),
    confirmPassword: zfd.text(z.string()),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirm_password"]
    });

export async function signUp(formData: FormData) {
    const parse = createUserValidation.safeParse(formData);
    console.log(parse, parse.error);
    if (parse.success) {
        // Hash password
        const hashedPassword = await bcrypt.hash(parse.data.password, 10);

        console.log("Hashed password: ", hashedPassword);

        // Create user - TODO: check if exists!
        const r = await db.user.create({
            data: {
                firstName: parse.data.firstName,
                lastName: parse.data.lastName,
                email: parse.data.email,
                password: hashedPassword
            }
        });

        console.log(r);
    }
}