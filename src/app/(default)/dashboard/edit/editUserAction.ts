'use server';

import { zfd } from 'zod-form-data';
import { z, ZodError } from 'zod';
import db from '@/_lib/db';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import * as jwt from 'jose';
import { cookies } from 'next/headers';
import { excludeFromObject } from '@/_lib/util';
import { USER_SESSION_COOKIE_NAME } from '@/app/auth/config';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { Storage } from '@google-cloud/storage';

const updateUserValidation = zfd
  .formData({
    profileImage: zfd.file(z.instanceof(File).optional()),
    firstName: zfd.text(z.string().min(1)),
    lastName: zfd.text(z.string().min(1)),
    oldEmail: zfd.text(z.string().email().min(1)),
    email: zfd.text(z.string().email().min(1)),
    oldPassword: zfd.text(z.string().optional()),
    newPassword: zfd.text(z.string().optional()),
    confirmPassword: zfd.text(z.string().optional()),
  })
  .refine((data) =>
    data.newPassword && data.confirmPassword
      ? (data.newPassword === data.confirmPassword,
        {
          message: "Passwords don't match",
          path: ['confirm_password'],
        })
      : true
  );

export async function editUser(
  formData: FormData
): Promise<Omit<User, 'password'> | ZodError | Error | undefined> {
  const cookieStore = await cookies();
  const parse = updateUserValidation.safeParse(formData);

  if (parse.success) {
    const {
      profileImage,
      firstName,
      lastName,
      oldEmail,
      email,
      oldPassword,
      newPassword,
    } = parse.data;

    const user = await db.user.findFirst({
      where: {
        email: oldEmail, // TODO: theoretisch ist das bei uns gar nicht unique, verwenden wir in singIn aber auch so
      },
    });

    if (!user) {
      return undefined;
    }

    // update password if newPassword was provided
    if (newPassword) {
      console.log('newPassword provided');
      if (!oldPassword) {
        console.log('Failed updating password: oldPassword was not provided');
        return new Error('Updating password requires oldPassword.');
      }

      // check for correct old password
      if (!(await bcrypt.compare(oldPassword, user.password))) {
        console.log('oldPassword incorrect');
        return new Error('The oldPassword is incorrect.');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.user.update({
        where: { email: oldEmail },
        data: {
          password: hashedPassword,
        },
      });
      console.log('password updated');
    }

    // update other values
    const updatedUser = await db.user.update({
      where: { email: oldEmail },
      data: {
        firstName,
        lastName,
        email,
        profile_image: profileImage
          ? await saveProfileImage(user, profileImage)
          : user.profile_image,
      },
    });

    // update user session cookie
    console.log('updating session cookie');
    const jwtKey = jwt.base64url.decode(process.env.APP_KEY ?? '');
    const token = await new jwt.SignJWT(
      excludeFromObject(updatedUser, ['password'])
    )
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(jwtKey);

    cookieStore.set(USER_SESSION_COOKIE_NAME, token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: false,
      httpOnly: true,
    });

    revalidatePath('/dashboard/edit');
    return excludeFromObject(updatedUser, ['password']);
  }
  console.log(parse.error);
}

async function saveProfileImage(user: User, file: File): Promise<string> {
  const storage = new Storage();
  const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

  const fileExtension = path.extname(file.name);
  const fileName = `${uuidv4()}${fileExtension}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileUpload = bucket.file(`user_avatars/${fileName}`);

  try {
    await fileUpload.save(buffer, {
      contentType: file.type,
    });
    console.log(`File uploaded to GCS: ${fileName}`);

    if (user.profile_image !== 'default_avatar.jpg') {
      const oldFile = bucket.file(`user_avatars/${user.profile_image}`);
      try {
        await oldFile.delete();
        console.log(`Old file deleted from GCS: ${user.profile_image}`);
      } catch (err) {
        console.error(`Failed to delete old file from GCS: ${err}`);
      }
    }
  } catch (err) {
    console.error(`Error uploading file to GCS: ${err}`);
    throw err;
  }

  return fileName;
}
