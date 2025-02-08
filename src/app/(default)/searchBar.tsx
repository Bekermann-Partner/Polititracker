'use client';

import { findPolitician } from '@/_actions/findPolitician';
import React from 'react';
import { Party, Politician } from '@prisma/client';
import { useDebounce } from '@/_lib/hooks/useDebounce';
import Image from 'next/image';
import Link from 'next/link';

export function SearchBar({ politician }: { politician: Politician }) {
  const [search, setSearch] = React.useState<string>('');
  const debouncedSearch = useDebounce(search, 500);

  const [politicians, setPoliticians] = React.useState<
    (Politician & { party?: Party })[]
  >([]);

  React.useEffect(() => {
    async function getResults() {
      return await findPolitician(debouncedSearch);
    }

    getResults().then((res) => setPoliticians(res));
  }, [debouncedSearch]);

  return (
    <div className={'relative mt-4'}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        className={'h-6 mt-3.5 ml-3.5 absolute stroke-gray-50 opacity-80'}
      >
        <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
      </svg>
      <input
        onChange={(e) => setSearch(e.currentTarget.value)}
        className={
          'h-12 w-full border rounded-xl pl-14 transition-colors focus:border-indigo-600 dark:bg-gray-800 dark:border-gray-600 outline-none dark:text-white'
        }
        type={'text'}
        placeholder={politician.first_name + ' ' + politician.last_name}
      />

      {search.length > 0 && politicians.length > 0 && (
        <div
          className={
            'absolute w-full bg-white dark:bg-gray-800 shadow-lg rounded z-20 mt-2 overflow-scroll max-h-72'
          }
        >
          {politicians.map((politician, index, array) => {
            return (
              <Link
                key={politician.uuid}
                href={`/politicians/${politician.uuid}`}
              >
                <div
                  className={
                    'flex p-3 w-full text-left hover:bg-gray-200 dark:hover:bg-gray-700 dark:border-gray-500 transition-colors hover:cursor-pointer ' +
                    (index !== array.length - 1 ? 'border-b' : '')
                  }
                >
                  <Image
                    className={'rounded-full max-w-[52px] max-h-[52px]'}
                    src={`/pol_profile_img/${politician.profile_image}`}
                    alt={''}
                    width={52}
                    height={100}
                  />
                  <div className={'ml-3'}>
                    <h3 className={'text-lg font-semibold dark:text-white'}>
                      {politician.first_name} {politician.last_name} &bull;{' '}
                      {politician.party?.short}
                    </h3>
                    <p className={'dark:text-gray-300'}>
                      {politician.occupation}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
