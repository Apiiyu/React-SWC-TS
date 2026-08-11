// Constants
import { ToastPosition, type ToastType } from '@/app/constants/toast.constant';

// Mitt
import eventBus from '@/plugins/mitt/mitt';

/**
 * @description Input required to publish a typed toast notification.
 */
interface IShowToastOptions {
  message: string;
  type: ToastType;
  position?: ToastPosition;
}

/**
 * @description Typed convenience wrapper around the toast event bus channel
 * — consumers call `showToast(...)` instead of reaching into `eventBus` directly.
 */
export const useToast = () => {
  const showToast = ({ message, type, position = ToastPosition.TOP_RIGHT }: IShowToastOptions) => {
    eventBus.emit('toast', { isOpen: true, message, type, position });
  };

  return { showToast };
};
