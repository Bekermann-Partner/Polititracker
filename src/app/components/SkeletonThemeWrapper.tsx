'use client';

import React, { useEffect } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import {
  ETheme,
  getTheme,
  LOCALSTORAGE_THEME_KEY,
} from '@/_lib/providers/themeProvider';

export function SkeletonThemeWrapper({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  const [baseColor, setBaseColor] = React.useState<string>('#ebebeb');
  const [highlightColor, setHighlightColor] = React.useState<string>('#f5f5f5');

  function handleStorageChange(e: StorageEvent) {
    console.log('e');

    if (e.key === LOCALSTORAGE_THEME_KEY) {
      const selectedTheme = getTheme();

      switch (selectedTheme) {
        case ETheme.LIGHT:
          setBaseColor('#ebebeb');
          setHighlightColor('#f5f5f5');
          break;

        case ETheme.DARK:
          setBaseColor('rgb(75 85 99)');
          setHighlightColor('rgb(108,120,135)');
      }
    }
  }

  useEffect(() => {
    const selectedTheme = getTheme();

    console.log(selectedTheme);

    switch (selectedTheme) {
      case ETheme.LIGHT:
        setBaseColor('#ebebeb');
        setHighlightColor('#f5f5f5');
        break;

      case ETheme.DARK:
        setBaseColor('rgb(75 85 99)');
        setHighlightColor('rgb(108,120,135)');
    }

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      {children}
    </SkeletonTheme>
  );
}
