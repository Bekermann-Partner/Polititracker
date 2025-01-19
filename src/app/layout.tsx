import React from 'react';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Polititracker</title>
        <link rel="icon" href="/img/logo.png" />
      </head>
      <body className={'antialiased bg-white dark:bg-gray-950'}>
        {children}
      </body>
    </html>
  );
}
