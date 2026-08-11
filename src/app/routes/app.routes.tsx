// React
import { lazy } from 'react';

// React Router DOM
import type { RouteObject } from 'react-router-dom';

/**
 * @description Lazy-loaded landing screen used by the root route.
 */
const Dashboard = lazy(() =>
  import('@/modules/dashboard/views/dashboard-main').then((module) => ({
    default: module.Dashboard,
  })),
);

/**
 * @description Returns application-level routes that are not owned by a feature module.
 */
const useAppRoutes = (): RouteObject[] => {
  return [
    {
      path: '/',
      element: <Dashboard />,
    },
  ];
};

export { useAppRoutes };
