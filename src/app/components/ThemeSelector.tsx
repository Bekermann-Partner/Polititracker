'use client';

import React, { useEffect } from 'react';
import {
  ETheme,
  getTheme,
  LOCALSTORAGE_THEME_KEY,
} from '@/_lib/providers/themeProvider';
import { FaMoon, FaSun } from 'react-icons/fa6';

export function ThemeSelector() {
  const [theme, setTheme] = React.useState<ETheme>(ETheme.LIGHT);

  useEffect(() => {
    const selectedTheme = getTheme();

    switch (selectedTheme) {
      case ETheme.LIGHT:
        setTheme(ETheme.LIGHT);
        break;

      case ETheme.DARK:
        setTheme(ETheme.DARK);
        const htmlRootNode = document.getElementsByTagName('html')[0];
        htmlRootNode.classList.add('dark');
        break;
    }
  }, []);

  function toggleTheme() {
    const htmlRootNode = document.getElementsByTagName('html')[0];

    const ev = new CustomEvent('theme-mode-change', { detail: theme });
    window.dispatchEvent(ev);

    if (theme === ETheme.LIGHT) {
      setTheme(ETheme.DARK);
      htmlRootNode.classList.add('dark');
      localStorage.setItem(LOCALSTORAGE_THEME_KEY, ETheme.DARK);
    } else {
      setTheme(ETheme.LIGHT);
      htmlRootNode.classList.remove('dark');
      localStorage.setItem(LOCALSTORAGE_THEME_KEY, ETheme.LIGHT);
    }
  }

  return (
    <div
      onClick={toggleTheme}
      className={
        'hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-full transition-colors w-fit'
      }
    >
      {theme === ETheme.LIGHT && (
        <FaMoon size={20} className={'text-gray-700'} />
      )}
      {theme === ETheme.DARK && <FaSun size={20} className={'text-gray-300'} />}
    </div>
  );
}
