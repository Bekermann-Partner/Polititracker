import { redirect, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { oauthSignIn } from '@/app/auth/oauth/callback/handleOAuthCallbackAction';

export function CallbackLoadingPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleLogin() {
      await oauthSignIn(searchParams.get('code') ?? undefined);
    }

    handleLogin().then(() => {
      redirect('/dashboard');
    });
  }, [searchParams]);

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
            Wir melden Dich gerade mit deinem X-Account an!
          </h2>

          <h5 className={'text-lg text-gray-600 mt-3 text-center'}>
            Habe bitte kurz Geduld. Dies kann einige Sekunden in Anspruch
            nehmen.
          </h5>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <button
            type="submit"
            disabled
            className="flex w-full justify-center rounded-md bg-black dark:bg-gray-700 hover:bg-gray-800 transition-colors px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Loading...
          </button>
        </div>
      </div>
    </>
  );
}