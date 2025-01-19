import { User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

export async function UserOverview({ user }: { user: User }) {
    return (
        <>
            <section className={'pt-24'}>
                <div className={'mx-auto max-w-6xl'}>
                    <div className="border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex">
                            {/* TODO: Auf kleineren Bildschirmen wird das aktuell noch sehr hässlich :/ */}
                            <div className="flex flex-col items-center justify-center mr-4">
                                <Image
                                    src={`/user_avatars/${user.profile_image}`}
                                    alt={'Avatar'}
                                    width={150}
                                    height={150}
                                    className={
                                        'rounded-full object-cover aspect-square mb-4'
                                    }
                                />
                                <Link
                                    href={'/dashboard/edit'}
                                    className="bg-black hover:bg-gray-700 transition-colors text-white rounded w-full px-3 py-1.5"
                                >
                                    Profil bearbeiten
                                </Link>
                            </div>

                            <div className="ml-4">
                                <h1 className={'text-3xl font-bold mb-2'}>
                                    Wilkommen, {user.firstName} {user.lastName}!
                                </h1>

                                <div>
                                    Auf dieser Seite findest du einen Überblick
                                    über deine Aktivitäten.
                                </div>

                                <div className="mt-8">
                                    <div className="font-bold">
                                        Deine Statistiken:
                                    </div>

                                    <span>Politikern gefolgt: (TODO)</span>
                                    <span className="ml-8">
                                        Kommentare verfasst: (TODO)
                                    </span>
                                    <span className="ml-8">
                                        Antworten erhalten: (TODO)
                                    </span>
                                </div>
                            </div>

                            <div className={'ml-auto mt-2'}>
                                {user.isAdmin && (
                                    <Link
                                        href={'/admin'}
                                        className={
                                            'bg-black hover:bg-gray-700 transition-colors text-white rounded px-3 py-1.5'
                                        }
                                    >
                                        Zur Administration
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
