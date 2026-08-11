// TanStack
import { QueryClient } from '@tanstack/react-query';

/**
 * @description Single shared client — wrap the app with
 * `QueryClientProvider` in AppCommonEntryPoint, not per-module.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
