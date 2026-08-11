// Constants
import { ToastPosition, ToastType } from '@/app/constants/toast.constant';

// Mitt
import eventBus from '@/plugins/mitt/mitt';

// React
import { useState, useMemo, useEffect } from 'react';

/**
 * @description Define the props interface
 */
interface IToastProps {
  isOpen: boolean;
  message: string;
  position: ToastPosition;
  type: ToastType;
}

/**
 * @description Subscribes to toast events and renders the current dismissible notification.
 */
export const AppBaseToast = () => {
  /**
   * @description Reactive data binding
   */
  const [toast, setToast] = useState<IToastProps>({
    isOpen: false,
    message: '',
    position: ToastPosition.TOP_RIGHT,
    type: ToastType.SUCCESS,
  });

  /**
   * @description Handle business logic for determine class name based on type toast
   */
  const toast_dynamicClassNameBasedOnTypeToast = useMemo((): string => {
    switch (toast.type) {
      case ToastType.DANGER:
        return 'text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200';
      case ToastType.WARNING:
        return 'text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200';
      case ToastType.SUCCESS:
        return 'text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200';
      default:
        return '';
    }
  }, [toast.type]);

  /**
   * @description Handle business logic for determine class name based on position toast
   */
  const toast_dynamicClassNameBasedOnPositionToast = useMemo((): string => {
    switch (toast.position) {
      case ToastPosition.TOP_LEFT:
        return 'top-5 left-5';
      case ToastPosition.TOP_RIGHT:
        return 'top-5 right-5';
      case ToastPosition.BOTTOM_LEFT:
        return 'bottom-5 left-5';
      case ToastPosition.BOTTOM_RIGHT:
        return 'bottom-5 right-5';
      default:
        return '';
    }
  }, [toast.position]);

  /**
   * @description Handle business logic for determine data target attribute based on type toast
   */
  const toast_dynamicDataTarget = useMemo(() => {
    switch (toast.type) {
      case ToastType.DANGER:
        return '#toasts-danger';
      case ToastType.WARNING:
        return '#toast-warning';
      case ToastType.SUCCESS:
        return '#toast-success';
      default:
        return '';
    }
  }, [toast.type]);

  /**
   * @description Handle business logic for determine icon name based on type toast
   */
  const toast_dynamicIconName = useMemo((): string => {
    switch (toast.type) {
      case ToastType.DANGER:
        return 'Error icon';
      case ToastType.WARNING:
        return 'Warning icon';
      default:
        return 'Check icon';
    }
  }, [toast.type]);

  /**
   * @description Handle business logic for determine id element toast based on position
   */
  const toast_dynamicId = useMemo((): string => {
    switch (toast.position) {
      case ToastPosition.TOP_LEFT:
        return 'toast-top-left';
      case ToastPosition.TOP_RIGHT:
        return 'toast-top-right';
      case ToastPosition.BOTTOM_LEFT:
        return 'toast-bottom-left';
      case ToastPosition.BOTTOM_RIGHT:
        return 'toast-bottom-right';
      default:
        return '';
    }
  }, [toast.position]);

  /**
   * @description Handle business logic for handle event close toast
   */
  const toast_onClose = (): void => {
    setToast((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    const onToast = (params: unknown) => {
      setToast(params as IToastProps);
    };

    eventBus.on('toast', onToast);

    return () => {
      eventBus.off('toast', onToast);
    };
  }, []);

  if (!toast.isOpen) {
    return null;
  }

  return (
    <section
      id={toast_dynamicId}
      className={`fixed flex items-center w-full max-w-xs p-4 space-x-4 divide-gray-200 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 space-x ${toast_dynamicClassNameBasedOnPositionToast}`}
      role="alert"
    >
      <section
        id="toast-icon"
        className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${toast_dynamicClassNameBasedOnTypeToast}`}
      >
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
        </svg>
        <span className="sr-only">{toast_dynamicIconName}</span>
      </section>

      <section id="toast-content" className="ml-3 text-sm font-normal w-full">
        {toast.message}
      </section>

      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        data-dismiss-target={toast_dynamicDataTarget}
        aria-label="Close"
        onClick={toast_onClose}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </section>
  );
};
