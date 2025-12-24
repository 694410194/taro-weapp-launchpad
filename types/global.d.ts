/// <reference types="@tarojs/taro" />
/// <reference types="miniprogram-api-typings" />

declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'

declare const __APP_ENV__: unknown

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
    TARO_ENV: 'weapp'
    TARO_APP_ID?: string
    TARO_API_BASE_URL?: string
    TARO_LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error'
  }
}
