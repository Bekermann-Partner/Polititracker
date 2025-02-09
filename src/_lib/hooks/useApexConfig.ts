import React, { useCallback, useEffect } from 'react';
import { ApexOptions } from 'apexcharts';
import { ETheme, getTheme } from '@/_lib/providers/themeProvider';

const defaultOptions: ApexOptions = {
  chart: {
    id: 'basic-bar',
  },
  theme: {
    mode: 'light',
  },
  colors: ['rgb(55, 48, 163)'],
};

export function useApexConfig(xAxisCategory: string[] | number[]) {
  const [config, setConfig] = React.useState<ApexOptions>({
    ...defaultOptions,
    xaxis: {
      categories: xAxisCategory,
    },
  });

  const handleThemeChange = useCallback((e: CustomEventInit<string>) => {
    if (!e.detail) return;

    switch (e.detail) {
      // This means we are switching FROM light -> dark
      case 'light':
        setConfig({
          ...defaultOptions,
          chart: { background: 'rgb(75, 85, 99)' },
          theme: { mode: 'dark' },
        });
        break;

      case 'dark':
        setConfig({
          ...defaultOptions,
          chart: { background: 'rgb(255,255,255)' },
          theme: { mode: 'light' },
        });
        break;
    }
  }, []);

  useEffect(() => {
    const theme = getTheme();
    console.log(theme);
    if (theme == ETheme.DARK) {
      setConfig({
        ...defaultOptions,
        chart: { background: 'rgb(75,85,99)' },
        theme: { mode: 'dark' },
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('theme-mode-change', handleThemeChange);

    return () => {
      window.removeEventListener('theme-mode-change', handleThemeChange);
    };
  }, [handleThemeChange]);

  return config;
}
