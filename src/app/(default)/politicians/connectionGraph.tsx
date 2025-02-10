'use client';

import Chart from 'react-apexcharts';
import { useApexConfig } from '@/_lib/hooks/useApexConfig';
import React from 'react';

export function ConnectionGraph({
  partyRatingHash,
}: {
  partyRatingHash: Map<string, number>;
}) {
  const config = useApexConfig([]);

  const createPartyRatingSeries = React.useMemo(() => {
    const series = [];
    const labels = [];

    for (const [party, count] of partyRatingHash) {
      series.push(count);
      labels.push(party);
    }

    return {
      series,
      labels,
    };
  }, [partyRatingHash]);

  return (
    <Chart
      options={{
        ...config,
        labels: createPartyRatingSeries.labels,
        colors: ['rgb(55, 48, 163)'], // TODO
      }}
      series={createPartyRatingSeries.series}
      type={'pie'}
      height={'100%'}
      width={'100%'}
    ></Chart>
  );
}
