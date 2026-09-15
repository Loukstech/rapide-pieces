'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, type, message, duration };
    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    return {
      showToast: (message: string, type?: ToastType) => {
        // Fallback for SSR or when provider is not available
        console.log(`[${type || 'info'}] ${message}`);
      },
      removeToast: () => {},
    };
  }
  return context;
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  const getTypeStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500 border-emerald-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'warning':
        return 'bg-amber-500 border-amber-600';
      default:
        return 'bg-blue-500 border-blue-600';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getTypeStyles(toast.type)} text-white px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 animate-slide-in`}
        >
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/80 hover:text-white"
          >
            ✕
          </button>
          <span className="text-sm">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
