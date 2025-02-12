'use client';

import { signUp } from '@/app/auth/sign-up/signUpAction';
import React from 'react';
import Link from 'next/link';

export default function SignUpPage() {
  const [loading] = React.useState<boolean>(false);

  return (
    <>
      <div
        className={'fixed w-full h-full top-0 left-0 z-[-2] dark:bg-gray-950'}
      >
        <img
          src={'/img/plenum.jpg'}
          className={'fixed w-full h-full opacity-[5%] dark:opacity-[5%]'}
        />
      </div>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
            Konto Erstellen
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action={signUp}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Vorname
              </label>
              <div className="mt-2">
                <input
                  type=""
                  name="firstName"
                  id="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border  placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-gray-800 dark:border-gray-600 outline-none dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Nachname
              </label>
              <div className="mt-2">
                <input
                  type=""
                  name="lastName"
                  id="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border  placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-gray-800 dark:border-gray-600 outline-none dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                E-Mail Adresse
              </label>
              <div className="mt-2">
                <input
                  type=""
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border  placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-gray-800 dark:border-gray-600 outline-none dark:text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  Passwort
                </label>
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border  placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-gray-800 dark:border-gray-600 outline-none dark:text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  Passwort Bestätigen
                </label>
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  name="confirmPassword"
                  id="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border  placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-gray-800 dark:border-gray-600 outline-none dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="checked-checkbox"
                type="checkbox"
                value=""
                required
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="checked-checkbox"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                <Link
                  href="/user-agreement"
                  className="text-sm font-medium text-blue-600 hover:underline ml-2"
                >
                  Nutzungsvereinbarung
                </Link>
              </label>
            </div>

            <div>
              {loading ? (
                <button
                  type="submit"
                  disabled
                  className="flex w-full justify-center rounded-md bg-black dark:bg-gray-700 hover:bg-gray-800 transition-colors px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Loading...
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-black dark:bg-gray-700 hover:bg-gray-800 transition-colors px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Registrieren
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
