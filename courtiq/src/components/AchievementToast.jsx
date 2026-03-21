import { useEffect, useState } from 'react'
import { Trophy, Flame, Target, Star, Zap, Award, X } from 'lucide-react'
import { hapticNotification } from '../lib/native'

const ICON_MAP = {
  trophy: Trophy,
  flame: Flame,
  target: Target,
  star: Star,
  zap: Zap,
  award: Award,
}

export default function AchievementToast({ achievement, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!achievement) return
    // Animate in
    requestAnimationFrame(() => setVisible(true))
    hapticNotification('SUCCESS')

    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, 4000)

    return () => clearTimeout(timer)
  }, [achievement, onDismiss])

  if (!achievement) return null

  const Icon = ICON_MAP[achievement.icon] || Trophy

  return (
    <div className={`fixed top-6 left-4 right-4 z-[100] transition-all duration-300 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className="mx-auto max-w-sm rounded-2xl bg-bg-card border border-gold/30 shadow-2xl shadow-gold/10 overflow-hidden">
        {/* Gold accent bar */}
        <div className="h-1 bg-gradient-to-r from-gold via-warning to-gold" />
        <div className="flex items-center gap-3 p-4">
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <Icon size={22} className="text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-gold uppercase tracking-wider">Achievement Unlocked</p>
            <p className="text-sm font-semibold text-text-primary truncate">{achievement.title}</p>
            {achievement.body && (
              <p className="text-[10px] text-text-muted truncate">{achievement.body}</p>
            )}
          </div>
          <button onClick={() => { setVisible(false); setTimeout(onDismiss, 300) }} className="p-1 text-text-muted hover:text-text-primary shrink-0">
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
