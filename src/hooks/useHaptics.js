import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

// Detect if running inside a Capacitor native app
const isNative = () => typeof window !== 'undefined' && !!window.Capacitor?.isNativePlatform?.()

export function useHaptics() {
  const impact = async (style = 'medium') => {
    if (!isNative()) return
    const styleMap = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    }
    try {
      await Haptics.impact({ style: styleMap[style] || ImpactStyle.Medium })
    } catch { /* not supported */ }
  }

  const notification = async (type = 'success') => {
    if (!isNative()) return
    const typeMap = {
      success: NotificationType.Success,
      warning: NotificationType.Warning,
      error: NotificationType.Error,
    }
    try {
      await Haptics.notification({ type: typeMap[type] || NotificationType.Success })
    } catch { /* not supported */ }
  }

  const selection = async () => {
    if (!isNative()) return
    try {
      await Haptics.selectionStart()
      await Haptics.selectionEnd()
    } catch { /* not supported */ }
  }

  return { impact, notification, selection }
}
