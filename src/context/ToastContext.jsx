import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * ToastContext provides a global toast notification system.
 * Any component can trigger a toast via `showToast(title, message)`.
 */
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ title: '', message: '', visible: false });

  const showToast = useCallback((title, message) => {
    setToast({ title, message, visible: true });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast UI — fixed position, slides in from top */}
      <div
        className={`toast-notification bg-white border-l-4 border-blush-500 shadow-xl p-4 rounded-r-lg flex items-center gap-3 ${
          toast.visible ? 'show' : ''
        }`}
      >
        <i className="fas fa-check-circle text-blush-500 text-xl"></i>
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
