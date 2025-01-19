'use server';

import { getUser } from '@/_actions/getUser';
import { User } from '@prisma/client';
import { redirect } from 'next/navigation';
import ProfileEditor from '@/app/(default)/dashboard/edit/ProfileEditor';

export default async function EditProfilePage() {
    const user: User | null = await getUser();

    if (!user) {
        return redirect('/auth/sign-in');
    }

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Profil Bearbeiten
                </h2>
            </div>

            <ProfileEditor user={user}></ProfileEditor>
        </div>
    );
}
