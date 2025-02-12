import React, { useCallback, useEffect } from 'react';
import { ApexOptions } from 'apexcharts';
import { ETheme, getTheme } from '@/_lib/providers/themeProvider';

const defaultOptions: ApexOptions = {
  theme: {
    mode: 'light',
  },
  chart: { background: 'rgb(255,255,255)' },
  colors: ['rgb(55, 48, 163)'],
  legend: {
    labels: {
      colors: '#000000',
    },
    markers: {
      offsetX: -5,
    },
  },
  xaxis: {
    labels: {
      style: {
        colors: '#000000',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: '#000000',
      },
    },
  },
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
          chart: { background: '#111827' },
          legend: {
            labels: {
              colors: '#ffffff',
            },
          },
          xaxis: {
            labels: {
              style: {
                colors: '#ffffff',
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                colors: '#ffffff',
              },
            },
          },
        });
        break;

      case 'dark':
        setConfig({
          ...defaultOptions,
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
