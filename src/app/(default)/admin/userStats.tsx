'use client';

import Chart from 'react-apexcharts';
import dayjs from 'dayjs';
import React from 'react';
import { useApexConfig } from '@/_lib/hooks/useApexConfig';

const daysToShow = 10;

export function UserStats({
  usersCreatedAt,
  commentsCreatedAt,
}: {
  usersCreatedAt: Date[];
  commentsCreatedAt: Date[];
}) {
  const categories = Array(daysToShow)
    .fill(0)
    .map((_, i) =>
      dayjs()
        .subtract(daysToShow - (i + 1), 'day')
        .format('DD.MM.YYYY')
    );
  const apexOptions = useApexConfig(categories);

  const createdUsersPerDaySeries = React.useMemo<number[]>(() => {
    const createdUsersPerDay: number[] = Array(daysToShow).fill(0);

    for (const creationDate of usersCreatedAt) {
      const createdAt = dayjs(creationDate).startOf('day');

      for (let i = 0; i < daysToShow; i++) {
        const dateCheck = dayjs().subtract(i, 'day').startOf('day');

        if (createdAt.isSame(dateCheck)) {
          createdUsersPerDay[daysToShow - (i + 1)] += 1;
          break;
        }
      }
    }

    return createdUsersPerDay;
  }, [usersCreatedAt]);

  const createdCommentsPerDaySeries = React.useMemo<number[]>(() => {
    const createdCommentsPerDay: number[] = Array(daysToShow).fill(0);

    for (const creationDate of commentsCreatedAt) {
      const createdAt = dayjs(creationDate).startOf('day');

      for (let i = 0; i < daysToShow; i++) {
        const dateCheck = dayjs().subtract(i, 'day').startOf('day');

        if (createdAt.isSame(dateCheck)) {
          createdCommentsPerDay[daysToShow - (i + 1)] += 1;
          break;
        }
      }
    }

    return createdCommentsPerDay;
  }, [commentsCreatedAt]);

  console.log(apexOptions.theme?.mode);

  return (
    <>
      <h1 className={'text-3xl mt-10 font-bold mb-5 dark:text-white'}>
        Nutzerstatistiken
      </h1>

      <div
        className={
          'overflow-hidden rounded-lg border border-gray-200 shadow-md dark:border-gray-700 h-80'
        }
      >
        <Chart
          options={apexOptions}
          series={[
            {
              name: 'Users Created',
              data: createdUsersPerDaySeries,
            },
          ]}
          type={'bar'}
          height={'100%'}
        ></Chart>
      </div>

      <h1 className={'text-3xl mt-10 font-bold mb-5 dark:text-white'}>
        Kommentarstatistiken
      </h1>

      <div
        className={
          'overflow-hidden rounded-lg border border-gray-200 shadow-md dark:border-gray-700 h-80'
        }
      >
        <Chart
          options={apexOptions}
          series={[
            {
              name: 'Comments Created',
              data: createdCommentsPerDaySeries,
            },
          ]}
          type={'bar'}
          height={'100%'}
        ></Chart>
      </div>
    </>
  );
}
