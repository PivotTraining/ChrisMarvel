import { useState, useRef, useCallback } from 'react'

const THRESHOLD = 80

export function usePullToRefresh(onRefresh) {
  const [pulling, setPulling] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const isActive = useRef(false)

  const onTouchStart = useCallback((e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      isActive.current = true
    }
  }, [])

  const onTouchMove = useCallback((e) => {
    if (!isActive.current) return
    const diff = e.touches[0].clientY - startY.current
    if (diff > 0) {
      setPulling(true)
      setPullDistance(Math.min(diff * 0.5, 120))
    }
  }, [])

  const onTouchEnd = useCallback(async () => {
    if (!isActive.current) return
    isActive.current = false

    if (pullDistance >= THRESHOLD) {
      setRefreshing(true)
      setPullDistance(50)
      await onRefresh()
      setRefreshing(false)
    }

    setPulling(false)
    setPullDistance(0)
  }, [pullDistance, onRefresh])

  const pullProps = {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }

  const indicator = (pulling || refreshing) ? (
    <div
      className="flex justify-center transition-all duration-200 overflow-hidden"
      style={{ height: pullDistance }}
    >
      <div className={`flex items-center justify-center ${refreshing ? 'animate-spin' : ''}`}>
        <div className={`w-6 h-6 border-2 border-blue border-t-transparent rounded-full ${
          pullDistance >= THRESHOLD ? 'opacity-100' : 'opacity-50'
        }`} />
      </div>
    </div>
  ) : null

  return { pullProps, indicator, refreshing }
}
