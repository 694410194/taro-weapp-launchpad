import { env } from '@/config/env'

import { logger } from './logger'
import { setupUpdateManager } from './updateManager'

export function bootstrapApp() {
  logger.info('[bootstrap] start', {
    NODE_ENV: env.NODE_ENV,
    TARO_ENV: env.TARO_ENV,
  })

  setupUpdateManager()
}
