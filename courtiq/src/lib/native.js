import { Capacitor } from '@capacitor/core'

export const isNative = Capacitor.isNativePlatform()
export const platform = Capacitor.getPlatform() // 'ios', 'android', 'web'

// Haptic feedback
let Haptics = null
if (isNative) {
  import('@capacitor/haptics').then(mod => { Haptics = mod.Haptics })
}

export async function hapticImpact(style = 'Light') {
  if (!Haptics) return
  try {
    await Haptics.impact({ style })
  } catch {}
}

export async function hapticNotification(type = 'SUCCESS') {
  if (!Haptics) return
  try {
    await Haptics.notification({ type })
  } catch {}
}

export async function hapticSelection() {
  if (!Haptics) return
  try {
    await Haptics.selectionStart()
    await Haptics.selectionChanged()
    await Haptics.selectionEnd()
  } catch {}
}

// Status Bar
export async function setStatusBarStyle(style = 'Dark') {
  if (!isNative) return
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar')
    await StatusBar.setStyle({ style: style === 'Dark' ? Style.Dark : Style.Light })
  } catch {}
}

export async function hideStatusBar() {
  if (!isNative) return
  try {
    const { StatusBar } = await import('@capacitor/status-bar')
    await StatusBar.hide()
  } catch {}
}

export async function showStatusBar() {
  if (!isNative) return
  try {
    const { StatusBar } = await import('@capacitor/status-bar')
    await StatusBar.show()
  } catch {}
}

// Keyboard
export async function setupKeyboardListeners(onShow, onHide) {
  if (!isNative) return () => {}
  try {
    const { Keyboard } = await import('@capacitor/keyboard')
    const showListener = await Keyboard.addListener('keyboardWillShow', onShow)
    const hideListener = await Keyboard.addListener('keyboardWillHide', onHide)
    return () => {
      showListener.remove()
      hideListener.remove()
    }
  } catch {
    return () => {}
  }
}

// App lifecycle
export async function setupAppListeners(onResume, onPause) {
  if (!isNative) return () => {}
  try {
    const { App } = await import('@capacitor/app')
    const resumeListener = await App.addListener('appStateChange', (state) => {
      if (state.isActive) onResume?.()
      else onPause?.()
    })
    return () => resumeListener.remove()
  } catch {
    return () => {}
  }
}

// Back button handler (mostly Android but good to have)
export async function setupBackButton(handler) {
  if (!isNative) return () => {}
  try {
    const { App } = await import('@capacitor/app')
    const listener = await App.addListener('backButton', handler)
    return () => listener.remove()
  } catch {
    return () => {}
  }
}
