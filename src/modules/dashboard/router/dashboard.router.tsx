// React
import { lazy } from "react";

// React Router DOM
import { RouteObject } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components -- router file intentionally pairs a lazy component with its `use*Router` hook export
const Dashboard = lazy(() =>
  import("../views/dashboard-main").then((module) => ({
    default: module.Dashboard,
  }))
);

export const useDashboardRouter = (): RouteObject[] => {
  return [
    {
      path: "dashboard",
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
      ],
    },
  ];
};
