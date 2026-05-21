import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * ToastContext provides a global toast notification system.
 * Any component can trigger a toast via `showToast(title, message, type)`.
 *
 * @param {'success' | 'error'} type - Visual style of the toast. Defaults to 'success'.
 */
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ title: '', message: '', visible: false, type: 'success' });

  const showToast = useCallback((title, message, type = 'success') => {
    setToast({ title, message, visible: true, type });

    // Auto-hide after 4 seconds (sedikit lebih lama untuk pesan error agar sempat dibaca)
    const delay = type === 'error' ? 5000 : 3000;
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, delay);
  }, []);

  const isError = toast.type === 'error';

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast UI — fixed position, slides in from top */}
      <div
        className={`toast-notification bg-white shadow-xl p-4 rounded-r-lg flex items-center gap-3 border-l-4 ${
          isError ? 'border-red-500' : 'border-blush-500'
        } ${toast.visible ? 'show' : ''}`}
        role="alert"
        aria-live="assertive"
      >
        <i className={`text-xl ${isError ? 'fas fa-times-circle text-red-500' : 'fas fa-check-circle text-blush-500'}`}></i>
        <div>
          <p className="font-bold text-gray-800 text-sm">{toast.title}</p>
          <p className="text-gray-600 text-xs">{toast.message}</p>
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
