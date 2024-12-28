'use client'

import React from "react";
import {signIn} from "@/app/auth/sign-in/signInAction";
import Link from "next/link";
import {User} from "@prisma/client";

export default function SignInPage() {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<Omit<User, 'password'> | null>(null);

    const [error, setError] = React.useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        setError(null);

        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        setLoading(true);
        const res = await signIn(formData);
        setLoading(false);
        if (!res) {
            // Failed to get user with these credentials
            setError("Failed to get user with these credentials!");
            return;
        }

        if (res instanceof Error) {
            // Validation failed
            console.error("Failed validation!", res);
            return;
        }

        console.log(res);
        setUser(res);
    }

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Melde dich mit
                    deinem Konto an</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {error &&
                    <div className={"bg-red-600 text-white w-full rounded p-2 mb-3"}>
                        {error}
                    </div>
                }

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">E-Mail
                            Adresse</label>
                        <div className="mt-2">
                            <input type="" name="email" id="email" autoComplete="email" required
                                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password"
                                   className="block text-sm/6 font-medium text-gray-900">Passwort</label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Passwort
                                    vergessen?</a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input type="password" name="password" id="password" autoComplete="current-password"
                                   required
                                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                        </div>
                    </div>

                    <div>
                        {loading ?
                            <button type="submit" disabled
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Loading...
                            </button>
                            :
                            <button type="submit"
                                    className="flex w-full justify-center rounded-md bg-black hover:bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Anmelden
                            </button>
                        }
                    </div>
                </form>

                <div className={"flex flex-row mt-10 justify-center"}>
                    <p className="text-sm/6 text-gray-500">
                        Noch kein Mitglied?
                    </p>
                    <Link href={"/auth/sign-up"} className={"text-indigo-600 hover:text-indigo-500 ml-1"}>
                        Jetzt registrieren
                    </Link>
                </div>
            </div>
        </div>
    )
}