import { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const config = {
  success: {
    border: 'border-l-success',
    icon: <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />,
  },
  error: {
    border: 'border-l-danger',
    icon: <XCircle className="h-5 w-5 text-danger flex-shrink-0" />,
  },
  info: {
    border: 'border-l-accent-secondary',
    icon: <Info className="h-5 w-5 text-accent-secondary flex-shrink-0" />,
  },
};

export default function Toast({ message, type = 'info', onClose, visible }) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  const { border, icon } = config[type] || config.info;

  return (
    <div
      className={`
        fixed left-4 right-4 bottom-20 z-50
        mx-auto max-w-md
        transition-all duration-300 ease-out
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}
      `}
    >
      <div
        className={`
          flex items-center gap-3
          rounded-xl bg-bg-surface-elevated border border-border-subtle
          border-l-4 ${border}
          px-4 py-3 shadow-xl
        `}
      >
        {icon}
        <p className="text-sm text-text-primary">{message}</p>
      </div>
    </div>
  );
}
