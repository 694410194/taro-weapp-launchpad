import Taro from '@tarojs/taro'

export function toast(
  title: string,
  options?: Omit<Taro.showToast.Option, 'title'>,
) {
  return Taro.showToast({
    title,
    icon: 'none',
    duration: 2000,
    ...options,
  })
}

export function showLoading(title = '加载中') {
  return Taro.showLoading({ title, mask: true })
}

export function hideLoading() {
  return Taro.hideLoading()
}

export async function withLoading<T>(promise: Promise<T>, title?: string): Promise<T> {
  await showLoading(title)
  try {
    return await promise
  } finally {
    await hideLoading()
  }
}

export async function confirm(options: {
  title?: string
  content: string
  confirmText?: string
  cancelText?: string
}): Promise<boolean> {
  const res = await Taro.showModal({
    title: options.title ?? '提示',
    content: options.content,
    confirmText: options.confirmText ?? '确定',
    cancelText: options.cancelText ?? '取消',
  })
  return Boolean(res.confirm)
}
