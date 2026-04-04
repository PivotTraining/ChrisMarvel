import { useState, useRef, useEffect } from 'react'
import { Trash2 } from 'lucide-react'

const ACTION_WIDTH = 88

export default function SwipeableRow({ children, onDelete, className = '', disabled = false }) {
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startXRef = useRef(0)
  const startOffsetRef = useRef(0)
  const rowRef = useRef(null)

  // Close when tapping outside
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
    // Only left-click for mouse
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
    // Clamp: can't swipe right past 0, max left is ACTION_WIDTH
    if (next > 0) next = 0
    if (next < -ACTION_WIDTH * 1.3) next = -ACTION_WIDTH * 1.3
    setOffset(next)
  }

  function handlePointerUp(e) {
    if (!dragging) return
    setDragging(false)
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
    // Snap: if swiped more than 40% of action width, open; else close
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
      {/* Delete action underneath */}
      <button
        onClick={handleDeleteClick}
        aria-label="Delete"
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
          gap: '0.25rem',
          backgroundColor: '#DC2626',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.75rem',
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <Trash2 size={20} />
        Delete
      </button>

      {/* Content (swipable) */}
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
