import { SUPPORT } from './support'

export const dragConfigResolver = {
  lock(value = false) {
    return SUPPORT.lock && value
  },
  touch(value = false) {
    return SUPPORT.touch && value
  },
  r3f: false,
  device() {
    if (this.r3f) return 'pointer'
    if (this.touch) return 'touch'
    if (this.lock) return 'mouse'
    if (SUPPORT.pointer) return 'pointer'
    if (SUPPORT.touch) return 'touch'
    return 'mouse'
  },
  capture(value = true) {
    return !this.lock && this.device === 'pointer' && value
  }
}