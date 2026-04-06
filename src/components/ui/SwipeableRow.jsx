import { useState, useRef, useEffect } from 'react'
import { Trash2 } from 'lucide-react'

const ACTION_WIDTH = 88

export default function SwipeableRow({ children, onDelete, className = '', disabled = false }) {
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startXRef = useRef(0)
  const startOffsetRef = useRef(0)
  const rowRef = useRef(null)

  useEffect(() => {
    if (offset === 0) return
    function handleOutside(e) {
      if (rowRef.current && !rowRef.current.contains(e.target)) {
        setOffset(0)
      }
    }
    document.addEventListener('pointerdown', handleOutside)
    return () => document.removeEventListener('pointerdown', handleOutside)
  }, [offset])

  function handlePointerDown(e) {
    if (disabled) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    startXRef.current = e.clientX
    startOffsetRef.current = offset
    setDragging(true)
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* ignore */ }
  }

  function handlePointerMove(e) {
    if (!dragging) return
    const delta = e.clientX - startXRef.current
    let next = startOffsetRef.current + delta
    if (next > 0) next = 0
    if (next < -ACTION_WIDTH * 1.3) next = -ACTION_WIDTH * 1.3
    setOffset(next)
  }

  function handlePointerUp(e) {
    if (!dragging) return
    setDragging(false)
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
    if (offset < -ACTION_WIDTH * 0.4) {
      setOffset(-ACTION_WIDTH)
    } else {
      setOffset(0)
    }
  }

  function handleDeleteClick(e) {
    e.stopPropagation()
    setOffset(0)
    onDelete?.()
  }

  return (
    <div
      ref={rowRef}
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      <button
        onClick={handleDeleteClick}
        aria-label="Delete"
        className="t-caption"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: `${ACTION_WIDTH}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-1)',
          backgroundColor: 'var(--color-danger)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        <Trash2 size={20} />
        Delete
      </button>

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          transform: `translateX(${offset}px)`,
          transition: dragging ? 'none' : 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  )
}
