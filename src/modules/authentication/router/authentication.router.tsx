// React
import { lazy } from "react";

// React Router DOM
import { RouteObject } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components -- router file intentionally pairs a lazy component with its `use*Router` hook export
const AuthenticationLogin = lazy(() =>
  import("../views/authentication-login-main").then((module) => ({
    default: module.AuthenticationLogin,
  }))
);

export const useAuthenticationRouter = (): RouteObject[] => {
  return [
    {
      path: "authentication",
      children: [
        {
          path: "login",
          element: <AuthenticationLogin />,
        },
      ],
    },
  ];
};
