// Hooks
import { useAuthenticationLogin } from '@/modules/authentication/hooks/useAuthenticationLogin.hook';

// i18n
import { useTranslation } from 'react-i18next';

// React
import type { FormEvent } from 'react';

// React Hook Form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// React Router DOM
import { useNavigate } from 'react-router-dom';

// Schemas
import {
  loginSchema,
  type LoginSchema,
} from '@/modules/authentication/schemas/authentication.schema';

/**
 * @description Renders the authentication login form and delegates submission to its feature hook.
 */
export const AuthenticationLogin = () => {
  const { t } = useTranslation('authentication');
  const navigate = useNavigate();
  const { mutate, isPending } = useAuthenticationLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    void handleSubmit((values) => {
      mutate(values, {
        onSuccess: () => {
          void navigate('/');
        },
      });
    })(event);
  };

  return (
    <section className="font-be-vietnam bg-dark-1 min-h-screen flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5" noValidate>
        <h1 className="text-2xl font-bold text-white">{t('login.title')}</h1>

        <div>
          <label htmlFor="email" className="block text-sm text-tile-grey mb-1">
            {t('login.email')}
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-lg px-3 py-2 bg-transparent border border-border-grey text-white"
            {...register('email')}
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{t('login.emailInvalid')}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-tile-grey mb-1">
            {t('login.password')}
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-lg px-3 py-2 bg-transparent border border-border-grey text-white"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{t('login.passwordTooShort')}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 rounded-lg bg-champ-green text-dark-2 font-semibold disabled:opacity-50"
        >
          {isPending ? t('login.submitting') : t('login.submit')}
        </button>
      </form>
    </section>
  );
};
