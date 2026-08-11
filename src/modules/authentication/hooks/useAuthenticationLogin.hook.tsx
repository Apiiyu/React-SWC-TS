// Axios
import httpClient from '@/plugins/axios/axios';

// Constants
import { AUTHENTICATION_API } from '@/modules/authentication/constants/authentication.constant';

// Interfaces
import type { ILoginResponse } from '@/modules/authentication/interfaces/authentication.interface';

// Schemas
import type { LoginSchema } from '@/modules/authentication/schemas/authentication.schema';

// Stores
import { useSessionStore } from '@/app/store/session.store';

// TanStack
import { useMutation } from '@tanstack/react-query';

/**
 * @description Business logic for the login flow — the view only renders
 * the form and calls `mutate`.
 */
export const useAuthenticationLogin = () => {
  const setSession = useSessionStore((state) => state.setSession);

  return useMutation({
    mutationFn: async (payload: LoginSchema) => {
      const { data } = await httpClient.post<ILoginResponse>(AUTHENTICATION_API.LOGIN, payload);
      return data;
    },
    onSuccess: (data) => {
      setSession(data.accessToken);
    },
  });
};
