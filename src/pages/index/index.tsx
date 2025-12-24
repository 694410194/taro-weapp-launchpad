import { Text, View } from '@tarojs/components'

export default function IndexPage() {
  return (
    <View className='p-6'>
      <View className='text-xl font-600 text-slate-900'>
        <Text>WeApp Launchpad</Text>
      </View>
      <View className='mt-2 text-sm text-slate-500'>
        <Text>深圳小王子 xiaowz 出品</Text>
      </View>

      <View className='mt-4 rounded-lg bg-white p-4 shadow-sm'>
        <View className='text-sm text-slate-900'>
          <Text>• WeApp-only（不做多端兼容）</Text>
        </View>
        <View className='mt-2 text-sm text-slate-900'>
          <Text>• TypeScript + ESLint/Prettier/Stylelint</Text>
        </View>
        <View className='mt-2 text-sm text-slate-900'>
          <Text>• TanStack Query + Zustand + Zod</Text>
        </View>
        <View className='mt-2 text-sm text-slate-900'>
          <Text>• CI / Commitlint / Husky</Text>
        </View>
      </View>
    </View>
  )
}
