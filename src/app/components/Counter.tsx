'use client';

import React, { useEffect } from 'react';

const DURATION = 500; // This means we need to make finalValue - initialValue / DURATION changes per ms

export function Counter({
  initialValue,
  finalValue,
  text,
}: {
  initialValue: number;
  finalValue: number;
  text?: string;
}) {
  const [count, setCount] = React.useState<number>(initialValue);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setCount((prevCount) => {
          if (prevCount < finalValue) {
            return prevCount + 1;
          }

          clearInterval(interval);
          return prevCount;
        });
      },
      DURATION / (finalValue - initialValue)
    );
  }, [finalValue, initialValue]);

  return (
    <h1 className={'text-3xl font-semibold'}>
      {count}
      {text}
    </h1>
  );
}
