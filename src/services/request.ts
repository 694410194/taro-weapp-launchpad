import Taro from '@tarojs/taro'
import { z } from 'zod'

import { env } from '@/config/env'

import { logger } from './logger'
import { getAccessToken } from './tokens'

export class HttpError extends Error {
  readonly statusCode: number
  readonly data: unknown

  constructor(message: string, statusCode: number, data: unknown) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.data = data
  }
}

export type RequestOptions = Omit<Taro.request.Option, 'url'> & {
  url: string
  baseUrl?: string
  withAuth?: boolean
}

function resolveUrl(url: string, baseUrl?: string): string {
  if (/^https?:\/\//i.test(url)) return url
  const resolvedBaseUrl = baseUrl ?? env.TARO_API_BASE_URL
  if (!resolvedBaseUrl) return url
  const left = resolvedBaseUrl.replace(/\/+$/, '')
  const right = url.replace(/^\/+/, '')
  return `${left}/${right}`
}

export async function request<TResponse>(options: RequestOptions): Promise<TResponse> {
  const url = resolveUrl(options.url, options.baseUrl)
  const headers = { ...(options.header ?? {}) } as Record<string, any>

  const token = getAccessToken()
  const shouldAttachAuth = options.withAuth !== false
  if (shouldAttachAuth && token && !headers.Authorization && !headers.authorization) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await Taro.request<TResponse>({
    timeout: 15_000,
    ...options,
    url,
    header: headers,
  })

  if (res.statusCode >= 200 && res.statusCode < 300) return res.data

  logger.warn('HTTP request failed', { url, statusCode: res.statusCode })
  throw new HttpError(`Request failed with status ${res.statusCode}`, res.statusCode, res.data)
}

export async function requestWithSchema<TSchema extends z.ZodTypeAny>(
  options: RequestOptions,
  schema: TSchema,
): Promise<z.infer<TSchema>> {
  const data = await request<unknown>(options)
  return schema.parse(data)
}

export async function requestJson<TResponse>(
  options: Omit<RequestOptions, 'header'> & { header?: Record<string, any> },
): Promise<TResponse> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.header ?? {}),
  }

  return request<TResponse>({
    ...options,
    header: headers,
  })
}

export async function requestJsonWithSchema<TSchema extends z.ZodTypeAny>(
  options: Omit<RequestOptions, 'header'> & { header?: Record<string, any> },
  schema: TSchema,
): Promise<z.infer<TSchema>> {
  const data = await requestJson<unknown>(options)
  return schema.parse(data)
}
