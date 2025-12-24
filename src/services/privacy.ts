import { isWeapp } from '@/config/env'

import { logger } from './logger'

type PrivacySettingResult = {
  needAuthorization: boolean
  privacyContractName?: string
}

function getWx(): any | null {
  // eslint-disable-next-line no-undef
  if (typeof wx === 'undefined') return null
  // eslint-disable-next-line no-undef
  return wx as any
}

export async function getPrivacySetting(): Promise<PrivacySettingResult | null> {
  if (!isWeapp) return null
  const wxAny = getWx()
  if (!wxAny?.getPrivacySetting) return null

  return new Promise((resolve) => {
    wxAny.getPrivacySetting({
      success(res: PrivacySettingResult) {
        resolve(res)
      },
      fail() {
        resolve(null)
      },
    })
  })
}

export async function openPrivacyContract(): Promise<boolean> {
  if (!isWeapp) return false
  const wxAny = getWx()
  if (!wxAny?.openPrivacyContract) return false

  return new Promise((resolve) => {
    wxAny.openPrivacyContract({
      success() {
        resolve(true)
      },
      fail() {
        resolve(false)
      },
    })
  })
}

export async function requirePrivacyAuthorize(): Promise<boolean> {
  if (!isWeapp) return true
  const wxAny = getWx()
  if (!wxAny?.requirePrivacyAuthorize) return true

  return new Promise((resolve) => {
    wxAny.requirePrivacyAuthorize({
      success() {
        resolve(true)
      },
      fail() {
        resolve(false)
      },
    })
  })
}

export async function ensurePrivacyAuthorized(): Promise<void> {
  const setting = await getPrivacySetting()
  if (!setting?.needAuthorization) return

  const ok = await requirePrivacyAuthorize()
  if (!ok) {
    logger.warn('[privacy] user did not authorize, opening privacy contract')
    await openPrivacyContract()
  }
}
