// React
import { lazy } from 'react';

// React Router DOM
import type { RouteObject } from 'react-router-dom';

/**
 * @description Lazy-loaded authentication login screen.
 */
const AuthenticationLogin = lazy(() =>
  import('../views/authentication-login-main').then((module) => ({
    default: module.AuthenticationLogin,
  })),
);

/**
 * @description Returns routes owned by the authentication feature module.
 */
export const useAuthenticationRouter = (): RouteObject[] => {
  return [
    {
      path: 'authentication',
      children: [
        {
          path: 'login',
          element: <AuthenticationLogin />,
        },
      ],
    },
  ];
};
