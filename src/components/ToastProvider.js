"use client";

import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(() => {});

// The color of each kind of toast
const KINDS = { success: "bg-emerald-700", error: "bg-red-600" };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, kind = "success") => {
    const id = crypto.randomUUID();
    setToasts((list) => [...list, { id, message, kind }]);
    // Remove it after 3 seconds
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext value={toast}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 space-y-2"
      >
        {toasts.map((t) => (
          <p
            key={t.id}
            className={`rounded-lg px-4 py-2 text-sm text-white ${KINDS[t.kind]}`}
          >
            {t.message}
          </p>
        ))}
      </div>
    </ToastContext>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
