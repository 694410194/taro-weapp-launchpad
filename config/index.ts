import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import { createSwcRegister } from '@tarojs/helper'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

import devConfig from './dev'
import prodConfig from './prod'

export default defineConfig<'webpack5'>(async (merge) => {
  createSwcRegister({
    only: [(filePath: string) => filePath.includes('@unocss')],
  })
  const { default: UnoCSS } = await import('@unocss/webpack')

  const appEnv = {
    NODE_ENV: process.env.NODE_ENV,
    TARO_ENV: 'weapp',
    TARO_APP_ID: process.env.TARO_APP_ID,
    TARO_API_BASE_URL: process.env.TARO_API_BASE_URL,
    TARO_LOG_LEVEL: process.env.TARO_LOG_LEVEL,
  }

  const baseConfig: UserConfigExport<'webpack5'> = {
    projectName: 'taro-weapp-launchpad',
    date: '2025-12-24',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: ['@tarojs/plugin-generator'],
    defineConstants: {
      __APP_ENV__: JSON.stringify(appEnv),
    },
    copy: {
      patterns: [],
      options: {},
    },
    framework: 'react',
    compiler: 'webpack5',
    cache: {
      enable: true,
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
        chain.plugin('unocss').use(UnoCSS())
      },
    },
  }

  if (process.env.NODE_ENV === 'development') return merge({}, baseConfig, devConfig)
  return merge({}, baseConfig, prodConfig)
})
