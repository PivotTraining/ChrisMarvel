import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colors = {
  success: 'var(--color-success)',
  error: 'var(--color-danger)',
  info: 'var(--color-info)',
};

function ToastItem({ id, message, variant = 'info', onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const Icon = icons[variant] || icons.info;
  const color = colors[variant] || colors.info;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => dismiss(), 3000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(id), 300);
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl max-w-sm w-full"
      style={{
        backgroundColor: 'var(--color-muted)',
        border: `1px solid ${color}33`,
        transform: visible && !exiting ? 'translateY(0)' : 'translateY(100%)',
        opacity: visible && !exiting ? 1 : 0,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
      }}
    >
      <Icon className="w-5 h-5 flex-shrink-0" style={{ color }} />
      <p className="t-body flex-1" style={{ color: 'var(--color-text)' }}>
        {message}
      </p>
      <button
        onClick={dismiss}
        className="flex-shrink-0 p-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" style={{ color: 'var(--color-text-sec)' }} />
      </button>
    </div>
  );
}

export default function Toast({ toasts = [], onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-2 items-center pointer-events-auto">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          variant={toast.variant}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, variant = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, dismissToast };
}
