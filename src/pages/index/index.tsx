import { useQuery } from '@tanstack/react-query'
import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo } from 'react'
import { create } from 'zustand'
import { z } from 'zod'

import { env } from '@/config/env'
import { confirm, toast, withLoading } from '@/services/ui'

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

function formatTime(ts: number): string {
  const date = new Date(ts)
  const pad2 = (value: number) => String(value).padStart(2, '0')
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
}

type CounterStore = {
  count: number
  inc: () => void
  reset: () => void
}

const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}))

function Tag(props: { text: string }) {
  return (
    <View className='mr-2 mb-2 rounded-full bg-white/18 px-3 py-1 text-xs text-white'>
      <Text>{props.text}</Text>
    </View>
  )
}

function SectionTitle(props: { title: string; desc?: string }) {
  return (
    <View className='mt-8'>
      <View className='text-base font-700 text-slate-900'>
        <Text>{props.title}</Text>
      </View>
      {props.desc ? (
        <View className='mt-1 text-xs leading-5 text-slate-500'>
          <Text>{props.desc}</Text>
        </View>
      ) : null}
    </View>
  )
}

function Card(props: { title: string; desc: string }) {
  return (
    <View className='mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100'>
      <View className='text-sm font-700 text-slate-900'>
        <Text>{props.title}</Text>
      </View>
      <View className='mt-1 text-xs leading-5 text-slate-500'>
        <Text>{props.desc}</Text>
      </View>
    </View>
  )
}

function ActionButton(props: { text: string; onClick: () => void; variant?: 'solid' | 'ghost' }) {
  const variant = props.variant ?? 'solid'
  const className =
    variant === 'solid'
      ? 'rounded-xl bg-slate-900 px-4 py-2 text-center text-sm text-white'
      : 'rounded-xl bg-slate-100 px-4 py-2 text-center text-sm text-slate-900'

  return (
    <View className={className} hoverClass='opacity-80' onClick={props.onClick}>
      <Text>{props.text}</Text>
    </View>
  )
}

export default function IndexPage() {
  const systemInfo = useMemo(() => {
    try {
      return Taro.getSystemInfoSync()
    } catch {
      return null
    }
  }, [])

  const count = useCounterStore((s) => s.count)
  const inc = useCounterStore((s) => s.inc)
  const reset = useCounterStore((s) => s.reset)

  const demoQuery = useQuery({
    queryKey: ['demo', 'build-info'],
    staleTime: 30_000,
    queryFn: async () => {
      await sleep(450)
      return {
        fetchedAt: Date.now(),
        taroEnv: env.TARO_ENV ?? 'unknown',
        apiBaseUrlConfigured: Boolean(env.TARO_API_BASE_URL),
      }
    },
  })

  const repoUrl = 'https://github.com/694410194/taro-weapp-launchpad'
  const quickStart = ['pnpm i', 'pnpm dev:weapp']

  async function copy(text: string) {
    await Taro.setClipboardData({ data: text })
    toast('已复制到剪贴板')
  }

  async function handleCopyQuickStart() {
    await copy(quickStart.join('\n'))
  }

  async function handleCopyRepo() {
    await copy(repoUrl)
  }

  async function handleLoadingDemo() {
    await withLoading(sleep(800), '模拟请求中...')
    toast('完成（示例）')
  }

  async function handleResetCounter() {
    const ok = await confirm({ content: '要把计数器重置为 0 吗？' })
    if (ok) reset()
  }

  function handleZodDemo() {
    const ApiBaseUrlSchema = z.string().url()
    const parsed = ApiBaseUrlSchema.safeParse(env.TARO_API_BASE_URL)
    if (parsed.success) {
      toast('Zod 校验通过：TARO_API_BASE_URL 已配置')
      return
    }
    toast('Zod 校验未通过：请配置有效的 TARO_API_BASE_URL（示例）')
  }

  return (
    <View className='p-6 pb-10'>
      <View
        className='rounded-3xl bg-slate-900 p-6 shadow-sm'
        style={{
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)',
        }}
      >
        <View className='text-2xl font-800 text-white'>
          <Text>小王子 Launchpad</Text>
        </View>
        <View className='mt-2 text-sm leading-6 text-white/90'>
          <Text>面向商业化交付的 Taro 4 微信小程序工程化底座（React + TypeScript + UnoCSS）</Text>
        </View>

        <View className='mt-4 flex flex-row flex-wrap'>
          <Tag text='WeApp-only' />
          <Tag text='Taro 4.1' />
          <Tag text='React 18' />
          <Tag text='TypeScript strict' />
          <Tag text='UnoCSS' />
          <Tag text='React Query' />
          <Tag text='Zustand' />
          <Tag text='Zod' />
        </View>

        <View className='mt-2 flex flex-row flex-wrap'>
          <View className='mr-3 mb-3'>
            <ActionButton text='复制 Quick Start' onClick={handleCopyQuickStart} variant='ghost' />
          </View>
          <View className='mr-3 mb-3'>
            <ActionButton text='复制仓库地址' onClick={handleCopyRepo} variant='ghost' />
          </View>
        </View>
      </View>

      <SectionTitle title='项目优势' desc='按“商业交付”和“长期维护”做的刻意取舍。' />
      <Card title='只做 weapp' desc='不做多端兼容，减少技术债，配置更少、迁移更稳。' />
      <Card
        title='工程化开箱即用'
        desc='ESLint / Prettier / Stylelint + Husky / lint-staged / commitlint，提交前自动把关。'
      />
      <Card
        title='基础设施到位'
        desc='React Query（服务端状态）+ Zustand（本地状态）+ Zod（运行时校验），边界清晰。'
      />
      <Card title='CI 就绪' desc='GitHub Actions：format / lint / typecheck / build 一步到位。' />

      <SectionTitle title='快速开始' desc='给“新项目第一天”准备的最短路径。' />
      <View className='mt-3 rounded-2xl bg-slate-900 p-4 shadow-sm'>
        <View className='flex flex-row items-center justify-between'>
          <View className='text-sm font-700 text-white'>
            <Text>本地运行</Text>
          </View>
          <View className='w-30'>
            <ActionButton text='复制命令' onClick={handleCopyQuickStart} />
          </View>
        </View>

        <View className='mt-3 rounded-xl bg-white/10 p-3'>
          <View className='font-mono text-xs leading-6 text-white/90'>
            {quickStart.map((line) => (
              <View key={line}>
                <Text>{line}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className='mt-3 text-xs leading-5 text-slate-300'>
          <Text>微信开发者工具导入 `dist/` 目录即可预览。</Text>
        </View>
      </View>

      <SectionTitle title='示例能力' desc='把模板里预置的能力在页面里跑一遍（可删）。' />

      <View className='mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100'>
        <View className='flex flex-row items-center justify-between'>
          <View className='text-sm font-700 text-slate-900'>
            <Text>Zustand 本地状态</Text>
          </View>
          <View className='rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700'>
            <Text>count: {count}</Text>
          </View>
        </View>

        <View className='mt-3 flex flex-row flex-wrap'>
          <View className='mr-3 mb-3'>
            <ActionButton text='+1' onClick={inc} />
          </View>
          <View className='mr-3 mb-3'>
            <ActionButton text='重置' onClick={handleResetCounter} variant='ghost' />
          </View>
        </View>
      </View>

      <View className='mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100'>
        <View className='flex flex-row items-center justify-between'>
          <View className='text-sm font-700 text-slate-900'>
            <Text>React Query 数据层</Text>
          </View>
          <View className='text-xs text-slate-500'>
            <Text>{demoQuery.isFetching ? '刷新中...' : '缓存可用'}</Text>
          </View>
        </View>

        <View className='mt-2 text-xs leading-5 text-slate-500'>
          <Text>
            上次获取：{demoQuery.data ? formatTime(demoQuery.data.fetchedAt) : '—'} · TARO_ENV：
            {demoQuery.data?.taroEnv ?? '—'} · API_BASE_URL：
            {demoQuery.data ? (demoQuery.data.apiBaseUrlConfigured ? '已配置' : '未配置') : '—'}
          </Text>
        </View>

        <View className='mt-3 flex flex-row flex-wrap'>
          <View className='mr-3 mb-3'>
            <ActionButton text='刷新一次' onClick={() => demoQuery.refetch()} />
          </View>
          <View className='mr-3 mb-3'>
            <ActionButton
              text='Toast'
              onClick={() => toast('这是一条示例 toast')}
              variant='ghost'
            />
          </View>
          <View className='mr-3 mb-3'>
            <ActionButton text='Loading' onClick={handleLoadingDemo} variant='ghost' />
          </View>
          <View className='mr-3 mb-3'>
            <ActionButton text='Zod 校验' onClick={handleZodDemo} variant='ghost' />
          </View>
        </View>
      </View>

      <SectionTitle title='运行环境' desc='用于排查线上问题的最小信息面板（示例）。' />
      <View className='mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100'>
        <View className='text-xs leading-6 text-slate-600'>
          <View className='flex flex-row items-center justify-between'>
            <Text className='text-slate-500'>NODE_ENV</Text>
            <Text className='text-slate-900'>{env.NODE_ENV ?? 'unknown'}</Text>
          </View>
          <View className='flex flex-row items-center justify-between'>
            <Text className='text-slate-500'>TARO_ENV</Text>
            <Text className='text-slate-900'>{env.TARO_ENV ?? 'unknown'}</Text>
          </View>
          <View className='flex flex-row items-center justify-between'>
            <Text className='text-slate-500'>TARO_API_BASE_URL</Text>
            <Text className='text-slate-900'>{env.TARO_API_BASE_URL ?? '未配置'}</Text>
          </View>
          <View className='flex flex-row items-center justify-between'>
            <Text className='text-slate-500'>Platform</Text>
            <Text className='text-slate-900'>{systemInfo?.platform ?? '—'}</Text>
          </View>
          <View className='flex flex-row items-center justify-between'>
            <Text className='text-slate-500'>WeChat</Text>
            <Text className='text-slate-900'>
              {systemInfo?.version ?? '—'} / {systemInfo?.SDKVersion ?? '—'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
