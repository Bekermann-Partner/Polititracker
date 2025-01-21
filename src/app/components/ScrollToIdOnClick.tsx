'use client';

import React from 'react';

export function ScrollToIdOnClick({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  function scrollIntoView() {
    const targetElement = document.getElementById(id);
    if (targetElement) {
      const boundingRect = targetElement.getBoundingClientRect();

      console.log(window.scrollY, boundingRect.top);

      window.scrollTo({ left: 0, top: boundingRect.y, behavior: 'smooth' });
      document.location.hash = id;
    }
  }

  return <div onClick={scrollIntoView}>{children}</div>;
}
