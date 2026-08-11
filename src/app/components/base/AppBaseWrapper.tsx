// React
import { memo } from 'react';

// React Router DOM
import { Outlet } from 'react-router-dom';

/**
 * @description Provides the router outlet wrapper used by the shared route layout.
 */
export const AppBaseWrapper = memo(() => {
  return <Outlet />;
});
