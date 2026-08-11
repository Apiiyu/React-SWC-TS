// React
import { lazy } from 'react';

// React Router DOM
import type { RouteObject } from 'react-router-dom';

/**
 * @description Lazy-loaded dashboard screen.
 */
const Dashboard = lazy(() =>
  import('../views/dashboard-main').then((module) => ({
    default: module.Dashboard,
  })),
);

/**
 * @description Returns routes owned by the dashboard feature module.
 */
export const useDashboardRouter = (): RouteObject[] => {
  return [
    {
      path: 'dashboard',
      children: [
        {
          path: '',
          element: <Dashboard />,
        },
      ],
    },
  ];
};
