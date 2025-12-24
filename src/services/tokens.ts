import { getStorage, removeStorage, setStorage } from './storage'

export type AuthTokens = {
  accessToken: string
  refreshToken?: string
  expiresAt?: number
}

const STORAGE_KEY = 'auth.tokens' as const

export function getTokens(): AuthTokens | null {
  return getStorage<AuthTokens>(STORAGE_KEY)
}

export function getAccessToken(): string | null {
  return getTokens()?.accessToken ?? null
}

export function setTokens(tokens: AuthTokens): void {
  setStorage(STORAGE_KEY, tokens)
}

export function clearTokens(): void {
  removeStorage(STORAGE_KEY)
}
