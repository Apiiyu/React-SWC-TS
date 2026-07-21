// React
import { Component, type ErrorInfo, type ReactNode } from "react";

// Constants
import { ToastPosition, ToastType } from "@/app/constants/toast.constant";

// i18n
import i18n from "@/plugins/i18n/i18n";

// Mitt
import eventBus from "@/plugins/mitt/mitt";

interface IProps {
  children: ReactNode;
}

interface IState {
  hasError: boolean;
}

/**
 * @description Catches render-time errors that would otherwise blank the
 * screen in dev/prod, surfaces them through the existing toast pipeline
 * (class components can't use hooks, so this calls `i18n.t` directly —
 * same pattern as `plugins/errorHandler`), and lets the user retry.
 */
export class AppBaseErrorBoundary extends Component<IProps, IState> {
  state: IState = { hasError: false };

  static getDerivedStateFromError(): IState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error(error, info);
    }

    eventBus.emit("toast", {
      isOpen: true,
      message:
        error.message || i18n.t("errors.somethingWentWrong", { ns: "app" }),
      type: ToastType.DANGER,
      position: ToastPosition.TOP_RIGHT,
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-dark-1 px-4 text-center">
          <div>
            <p className="text-xl font-semibold text-white">
              {i18n.t("errorBoundary.title", { ns: "app" })}
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="mt-4 rounded-lg bg-champ-green px-5 py-2 font-semibold text-dark-2"
            >
              {i18n.t("errorBoundary.retry", { ns: "app" })}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
