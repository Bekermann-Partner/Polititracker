'use client';

import React, { Suspense } from 'react';
import { CallbackLoadingPage } from '@/app/auth/oauth/callback/callbackLoadingPage';

export default function Page() {
  return (
    <Suspense>
      <CallbackLoadingPage />
    </Suspense>
  );
}
