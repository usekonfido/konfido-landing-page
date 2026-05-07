'use client';

import { useEffect } from 'react';

export function ScrollReset() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);
  return null;
}
