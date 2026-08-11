// Components — explicit: not auto-imported, see auto-imports.helper.ts

// Components
import { AppBaseErrorBoundary } from '@/app/components/base/AppBaseErrorBoundary';

// Modules
import { queryClient, useRouter } from '@/plugins';

// React
import { Suspense, useEffect } from 'react';

// Stores
import { useThemeStore } from '@/app/store/theme.store';

// TanStack
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/**
 * @description Composes the shared error boundary, query provider, router, theme, and toast UI.
 */
export const AppCommonEntryPoint = () => {
  const routes = useRouter();
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <AppBaseErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          {routes}
          <AppBaseToast />
        </Suspense>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </AppBaseErrorBoundary>
  );
};
