// Components
import { AppBaseRouteGuard } from '@/app/components/base/AppBaseRouteGuard';

// React Router DOM
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Stores
import { useSessionStore } from '@/app/store/session.store';

// Testing
import { act, render, screen } from '@testing-library/react';

// Vite
import { afterEach, describe, expect, it } from 'vitest';

const renderGuardedApp = (initialPath: string) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/authentication/login" element={<div>Login page</div>} />
        <Route element={<AppBaseRouteGuard />}>
          <Route path="/protected" element={<div>Protected content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe('AppBaseRouteGuard', () => {
  afterEach(() => {
    act(() => {
      useSessionStore.getState().clearSession();
    });
  });

  it('redirects to login when there is no authenticated session', () => {
    renderGuardedApp('/protected');

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders the protected route when authenticated', () => {
    act(() => {
      useSessionStore.getState().setSession('token-123');
    });

    renderGuardedApp('/protected');

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });
});
