import Taro from '@tarojs/taro'

import { env, LogLevelSchema } from '@/config/env'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const levelWeight: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

const defaultLevel: LogLevel = (() => {
  const parsed = LogLevelSchema.safeParse(env.TARO_LOG_LEVEL)
  if (parsed.success) return parsed.data
  return env.NODE_ENV === 'development' ? 'debug' : 'info'
})()

let currentLevel: LogLevel = defaultLevel

type RealtimeLogManagerLike = {
  log?: (...args: any[]) => void
  info?: (...args: any[]) => void
  warn?: (...args: any[]) => void
  error?: (...args: any[]) => void
  setFilterMsg?: (msg: string) => void
  addFilterMsg?: (msg: string) => void
}

const realtimeLogManager: RealtimeLogManagerLike | null =
  typeof Taro.getRealtimeLogManager === 'function' ? (Taro.getRealtimeLogManager() as any) : null

function shouldLog(level: LogLevel): boolean {
  return levelWeight[level] >= levelWeight[currentLevel]
}

function toConsole(level: LogLevel, args: unknown[]) {
  if (level === 'debug') return console.debug(...args)
  if (level === 'info') return console.info(...args)
  if (level === 'warn') return console.warn(...args)
  return console.error(...args)
}

function toRealtimeLog(level: LogLevel, args: unknown[]) {
  if (!realtimeLogManager) return
  const fn =
    level === 'debug'
      ? realtimeLogManager.log
      : level === 'info'
        ? realtimeLogManager.info
        : level === 'warn'
          ? realtimeLogManager.warn
          : realtimeLogManager.error

  fn?.(...args)
}

export const logger = {
  setLevel(level: LogLevel) {
    currentLevel = level
  },

  debug(...args: unknown[]) {
    if (!shouldLog('debug')) return
    toConsole('debug', args)
    toRealtimeLog('debug', args)
  },

  info(...args: unknown[]) {
    if (!shouldLog('info')) return
    toConsole('info', args)
    toRealtimeLog('info', args)
  },

  warn(...args: unknown[]) {
    if (!shouldLog('warn')) return
    toConsole('warn', args)
    toRealtimeLog('warn', args)
  },

  error(...args: unknown[]) {
    if (!shouldLog('error')) return
    toConsole('error', args)
    toRealtimeLog('error', args)
  },
}
