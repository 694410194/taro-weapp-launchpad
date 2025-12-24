import { QueryClientProvider } from '@tanstack/react-query'
import { useLaunch } from '@tarojs/taro'
import type { PropsWithChildren } from 'react'

import 'uno.css'

import { bootstrapApp } from './services/bootstrap'
import { queryClient } from './services/queryClient'

import './app.css'

export default function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    bootstrapApp()
  })

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
