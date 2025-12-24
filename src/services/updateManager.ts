import Taro from '@tarojs/taro'

import { isWeapp } from '@/config/env'

import { logger } from './logger'

export function setupUpdateManager() {
  if (!isWeapp) return

  const getUpdateManager = (Taro as any).getUpdateManager as undefined | (() => any)
  if (typeof getUpdateManager !== 'function') return

  const updateManager = getUpdateManager()
  updateManager.onCheckForUpdate?.((res: { hasUpdate: boolean }) => {
    logger.info('[update] check', res)
  })

  updateManager.onUpdateReady?.(() => {
    Taro.showModal({
      title: '更新提示',
      content: '新版本已准备好，是否重启应用？',
      showCancel: true,
      success(res) {
        if (res.confirm) updateManager.applyUpdate?.()
      },
    })
  })

  updateManager.onUpdateFailed?.(() => {
    logger.warn('[update] failed to download new version')
  })
}
