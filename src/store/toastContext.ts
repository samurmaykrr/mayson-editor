import { createContext } from 'react';
import { generateId } from '@/lib/utils';

// ============================================
// Types
// ============================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

export interface ToastOptions {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

export interface ToastContextValue {
  toasts: Toast[];
  addToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  // Convenience methods
  success: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
}

// ============================================
// Context
// ============================================

export const ToastContext = createContext<ToastContextValue | null>(null);

// ============================================
// Toast creation helper
// ============================================

const DEFAULT_DURATION = 5000; // 5 seconds

export function createToast(options: ToastOptions): Toast {
  return {
    id: generateId(),
    type: options.type ?? 'info',
    title: options.title,
    message: options.message,
    duration: options.duration ?? DEFAULT_DURATION,
    dismissible: options.dismissible ?? true,
  };
}
