import Taro from '@tarojs/taro'

const PREFIX = 'taro-weapp-starter:'

export type StorageKey = 'auth.tokens'

function keyWithPrefix(key: StorageKey) {
  return `${PREFIX}${key}`
}

export function getStorage<T>(key: StorageKey): T | null {
  try {
    const value = Taro.getStorageSync(keyWithPrefix(key))
    return (value ?? null) as T | null
  } catch {
    return null
  }
}

export function setStorage(key: StorageKey, value: unknown): void {
  Taro.setStorageSync(keyWithPrefix(key), value)
}

export function removeStorage(key: StorageKey): void {
  try {
    Taro.removeStorageSync(keyWithPrefix(key))
  } catch {
    // ignore
  }
}
