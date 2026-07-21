/**
 * @description Real runtime constants — replaces the old ambient `enum` in a
 * `.d.ts` file, which type-checked but emitted no JS and threw at runtime.
 */
export const ToastType = {
  SUCCESS: "SUCCESS",
  WARNING: "WARNING",
  DANGER: "DANGER",
} as const;

export type ToastType = (typeof ToastType)[keyof typeof ToastType];

export const ToastPosition = {
  TOP_LEFT: "TOP_LEFT",
  TOP_RIGHT: "TOP_RIGHT",
  BOTTOM_LEFT: "BOTTOM_LEFT",
  BOTTOM_RIGHT: "BOTTOM_RIGHT",
} as const;

export type ToastPosition = (typeof ToastPosition)[keyof typeof ToastPosition];
