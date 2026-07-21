// React
import { lazy } from "react";

// React Router DOM
import { RouteObject } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components -- routes file intentionally pairs a lazy component with its `use*Routes` hook export
const Dashboard = lazy(() =>
  import("@/modules/dashboard/views/dashboard-main").then((module) => ({
    default: module.Dashboard,
  }))
);

const useAppRoutes = (): RouteObject[] => {
  return [
    {
      path: "/",
      element: <Dashboard />,
    },
  ];
};

export { useAppRoutes };
