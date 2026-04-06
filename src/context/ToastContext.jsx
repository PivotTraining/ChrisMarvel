import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

function Toast({ message, type, onClose }) {
  const bgColors = {
    success: 'var(--color-success-tint)',
    error: 'var(--color-danger-tint)',
    info: 'var(--color-info-tint)',
  }
  const textColors = {
    success: 'var(--color-success)',
    error: 'var(--color-danger)',
    info: 'var(--color-info)',
  }

  return (
    <div
      className="t-body"
      style={{
        position: 'fixed',
        top: 'var(--space-3)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        padding: 'var(--space-1) var(--space-2)',
        borderRadius: 'var(--radius-btn)',
        backgroundColor: bgColors[type] || bgColors.info,
        border: `1px solid ${textColors[type] || textColors.info}`,
        color: textColors[type] || textColors.info,
        fontWeight: 500,
        cursor: 'pointer',
        animation: 'toastSlideIn 0.3s ease-out',
      }}
      onClick={onClose}
    >
      {message}
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
