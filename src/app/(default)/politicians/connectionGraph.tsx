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

  const partyColors: Record<string, string> = {
    CDU: 'rgb(0, 0, 0)',
    SPD: 'rgb(226, 0, 26)',
    'Bündnis 90/Die Grünen': 'rgb(100, 161, 45)',
    FDP: 'rgb(230, 215, 0)',
    AfD: 'rgb(0, 158, 224)',
    BSW: 'rgb(156, 27, 27)',
    CSU: 'rgb(0, 138, 197)',
    'DIE LINKE': 'rgb(190, 5, 34)',
    SSW: 'rgb(0, 92, 169)',
    'Bürger in Wut (BiW)': 'rgb(213, 43, 30)',
  };
  const DEFAULT_COLOR = 'rgb(160, 160, 160)'; // gray

  partyRatingHash = new Map(
    [...partyRatingHash.entries()].sort((a, b) => b[1] - a[1])
  );

  const createPartyRatingSeries = React.useMemo(() => {
    const series = [];
    const labels = [];
    const colors = [];

    for (const [party, count] of partyRatingHash) {
      series.push(count);
      labels.push(party);
      colors.push(partyColors[party] ?? DEFAULT_COLOR);
    }

    return {
      series,
      labels,
      colors,
    };
  }, [partyRatingHash]);

  return (
    <Chart
      options={{
        ...config,
        labels: createPartyRatingSeries.labels,
        colors: createPartyRatingSeries.colors,
        tooltip: {
          theme: 'light',
        },
      }}
      series={createPartyRatingSeries.series}
      type={'pie'}
      height={'100%'}
      width={'100%'}
    ></Chart>
  );
}
