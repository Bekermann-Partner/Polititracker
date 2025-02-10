import React from 'react';
import { Header } from '@/app/(default)/header';
import { Footer } from '@/app/(default)/footer';
import 'react-loading-skeleton/dist/skeleton.css';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <main className={'overflow-hidden pt-12 lg:pt-16'}>{children}</main>

      <Footer />
    </>
  );
}
