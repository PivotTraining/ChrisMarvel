import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

function Toast({ message, type, onClose }) {
  const bgColors = {
    success: 'rgba(34,197,94,0.15)',
    error: 'rgba(239,68,68,0.15)',
    info: 'rgba(59,130,246,0.15)',
  }
  const borderColors = {
    success: 'rgba(34,197,94,0.4)',
    error: 'rgba(239,68,68,0.4)',
    info: 'rgba(59,130,246,0.4)',
  }
  const textColors = {
    success: '#22c55e',
    error: '#ef4444',
    info: '#3b82f6',
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        padding: '0.75rem 1.25rem',
        borderRadius: '0.5rem',
        backgroundColor: bgColors[type] || bgColors.info,
        border: `1px solid ${borderColors[type] || borderColors.info}`,
        color: textColors[type] || textColors.info,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.875rem',
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
