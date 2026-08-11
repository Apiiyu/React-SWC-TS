// Axios
import type { AxiosError } from 'axios';

// Constants
import { ToastPosition, ToastType } from '@/app/constants/toast.constant';

// i18n
import i18n from '@/plugins/i18n/i18n';

// Mitt
import eventBus from '@/plugins/mitt/mitt';

/**
 * @description Maps known HTTP status codes to localized user-facing error messages.
 */
const STATUS_KEY: Record<number, string> = {
  400: 'errors.badRequest',
  401: 'errors.unauthorized',
  500: 'errors.internalServerError',
};

/**
 * @description Owns UI-facing error presentation (toast dispatch) so the
 * axios plugin can stay a pure HTTP transport. Attach via
 * `httpClient.interceptors.response.use(undefined, handleHttpError)`.
 */
export const handleHttpError = (error: AxiosError<{ message?: string }>) => {
  const status = error.response?.status ?? 0;
  const messageKey = STATUS_KEY[status] ?? 'errors.somethingWentWrong';
  const message = error.response?.data?.message ?? i18n.t(messageKey, { ns: 'app' });

  eventBus.emit('toast', {
    isOpen: true,
    message,
    position: ToastPosition.TOP_RIGHT,
    type: ToastType.DANGER,
  });

  return Promise.reject(error);
};
