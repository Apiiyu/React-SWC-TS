import { useAppRoutes } from "@/app/routes/app.routes";
import { useAuthenticationRouter } from "@/modules/authentication/router/authentication.router";
import { useDashboardRouter } from "@/modules/dashboard/router/dashboard.router";
import { useRoutes } from "react-router-dom";

const useRouter = () => {
  const app = useAppRoutes();
  const authentication = useAuthenticationRouter();
  const dashboard = useDashboardRouter();
  const routes = useRoutes([...app, ...authentication, ...dashboard]);

  return routes;
};

export { useRouter };
