'use client';

import React from 'react';
import { LOCALSTORAGE_THEME_KEY } from '@/_lib/providers/themeProvider';

export function Test({ children }: { children: React.ReactNode }) {
  if (
    typeof window !== 'undefined' &&
    localStorage.getItem(LOCALSTORAGE_THEME_KEY) == 'dark'
  ) {
    document.getElementsByTagName('html')[0].classList.add('dark');
  }

  return <>{children}</>;
}
