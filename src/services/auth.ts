import Taro from '@tarojs/taro'
import { z } from 'zod'

import { env, isWeapp } from '@/config/env'

import { logger } from './logger'
import { requestJsonWithSchema } from './request'
import { clearTokens, setTokens, type AuthTokens } from './tokens'

const TokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresIn: z.number().optional(),
  expiresAt: z.number().optional(),
})

type TokenResponse = z.infer<typeof TokenResponseSchema>

function toAuthTokens(res: TokenResponse): AuthTokens {
  if (typeof res.expiresAt === 'number') return res
  if (typeof res.expiresIn === 'number') {
    return {
      ...res,
      expiresAt: Date.now() + res.expiresIn * 1000,
    }
  }
  return res
}

export async function checkWeappSession(): Promise<boolean> {
  if (!isWeapp) return true
  try {
    await Taro.checkSession()
    return true
  } catch {
    return false
  }
}

export async function getWeappLoginCode(): Promise<string> {
  const res = await Taro.login()
  if (!res.code) throw new Error('Failed to get weapp login code')
  return res.code
}

/**
 * Exchange `wx.login` code for your backend tokens.
 * You must implement the backend endpoint and response shape.
 */
export async function loginAndStoreTokens(): Promise<AuthTokens | null> {
  if (!isWeapp) return null

  if (!env.TARO_API_BASE_URL) {
    logger.warn('[auth] TARO_API_BASE_URL is not set, skip login')
    return null
  }

  const code = await getWeappLoginCode()
  const res = await requestJsonWithSchema(
    {
      url: '/auth/weapp/login',
      method: 'POST',
      data: { code },
      withAuth: false,
    },
    TokenResponseSchema,
  )

  const tokens = toAuthTokens(res)
  setTokens(tokens)
  return tokens
}

export function logout(): void {
  clearTokens()
}
