import { z } from 'zod'

// WeChat Mini Program runtime may disallow `eval`/`new Function`.
// Zod v4 enables JIT optimizations by default, which can crash in such environments.
z.config({ jitless: true })

export const TaroEnvSchema = z.literal('weapp')

export const LogLevelSchema = z.enum(['debug', 'info', 'warn', 'error'])

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).optional(),
  TARO_ENV: TaroEnvSchema.optional(),
  TARO_APP_ID: z.string().optional(),

  // Custom env (recommended: inject via --env-prefix TARO_)
  TARO_API_BASE_URL: z.string().optional(),
  TARO_LOG_LEVEL: LogLevelSchema.optional(),
})

export type AppEnv = z.infer<typeof EnvSchema>

export const env: AppEnv = (() => {
  const parsed = EnvSchema.safeParse(__APP_ENV__)
  if (parsed.success) return parsed.data
  return {}
})()

export const isWeapp = env.TARO_ENV === 'weapp'
