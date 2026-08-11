// React Router DOM
import { useRoutes } from 'react-router-dom';

// Routers
import { useAuthenticationRouter } from '@/modules/authentication/router/authentication.router';
import { useDashboardRouter } from '@/modules/dashboard/router/dashboard.router';

// Routes
import { useAppRoutes } from '@/app/routes/app.routes';

/**
 * @description Merges application and feature route trees for the browser router.
 */
const useRouter = () => {
  const app = useAppRoutes();
  const authentication = useAuthenticationRouter();
  const dashboard = useDashboardRouter();
  const routes = useRoutes([...app, ...authentication, ...dashboard]);

  return routes;
};

export { useRouter };
