'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const REFRESH_INTERVAL_MS = 10_000;

/**
 * Keeps server-rendered dashboard data (e.g. click counts) fresh without a
 * manual reload: re-runs the server render via router.refresh() when the tab
 * regains focus/visibility and on a light polling interval while visible.
 * Client state (open dialogs, form inputs) is preserved across refreshes.
 */
export function LiveRefresh() {
  const router = useRouter();

  useEffect(() => {
    function refreshIfVisible() {
      if (document.visibilityState === 'visible') {
        router.refresh();
      }
    }

    const interval = setInterval(refreshIfVisible, REFRESH_INTERVAL_MS);
    window.addEventListener('focus', refreshIfVisible);
    document.addEventListener('visibilitychange', refreshIfVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', refreshIfVisible);
      document.removeEventListener('visibilitychange', refreshIfVisible);
    };
  }, [router]);

  return null;
}
