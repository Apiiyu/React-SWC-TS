// i18n must be initialized before the view renders translated labels

import '@/plugins/i18n/i18n';

// React Router DOM
import { MemoryRouter } from 'react-router-dom';

// TanStack
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Testing
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Views
import { AuthenticationLogin } from '@/modules/authentication/views/authentication-login-main';

// Vite
import { describe, expect, it } from 'vitest';

const renderLoginView = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthenticationLogin />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('AuthenticationLogin', () => {
  it('shows Zod validation errors when submitted with invalid input', async () => {
    const user = userEvent.setup();
    renderLoginView();

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.type(screen.getByLabelText('Kata Sandi'), 'short');
    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    await waitFor(() => {
      expect(screen.getByText('Masukkan alamat email yang valid')).toBeInTheDocument();
      expect(screen.getByText('Kata sandi minimal 8 karakter')).toBeInTheDocument();
    });
  });

  it('submits (enters pending state) once the form passes validation', async () => {
    const user = userEvent.setup();
    renderLoginView();

    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Kata Sandi'), 'supersecret');
    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sedang masuk...' })).toBeInTheDocument();
    });
  });
});
