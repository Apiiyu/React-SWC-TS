// React
import { useEffect, useMemo } from 'react';

/**
 * @description Provides an `AbortController` tied to the component's
 * lifecycle — pass `.signal` to axios/`fetch` calls so in-flight requests
 * cancel automatically on unmount.
 */
export const useHttpAbort = () => {
  const controller = useMemo(() => new AbortController(), []);

  useEffect(() => {
    return () => controller.abort();
  }, [controller]);

  return controller;
};
