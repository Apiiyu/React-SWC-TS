// React Router DOM
import { Navigate, Outlet } from "react-router-dom";

// Store
import { useSessionStore } from "@/app/store/session.store";

/**
 * @description Layout-route guard — wrap protected routes with this element:
 * `<Route element={<AppBaseRouteGuard />}><Route path="settings" .../></Route>`.
 * Redirects to the login page when there's no authenticated session.
 */
export const AppBaseRouteGuard = () => {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/authentication/login" replace />;
  }

  return <Outlet />;
};
