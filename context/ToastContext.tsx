// ToastContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from './Toast';

type ToastType = 'success' | 'error' | 'info';

interface ToastData {
  id: number;
  message: string;
  type: ToastType;
  action?: {
    label: string;
    onPress: () => void;
  };
  position?: 'top' | 'bottom' | 'center';
}

const ToastContext = createContext<{
  showToast: (toast: Omit<ToastData, 'id'>) => void;
} | null>(null);

export const useToast = () => useContext(ToastContext)!;

let toastId = 0;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (toast: Omit<ToastData, 'id'>) => {
    const newToast = { ...toast, id: toastId++ };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};
