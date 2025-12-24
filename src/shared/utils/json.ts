export function safeJsonParse<T = unknown>(text: string): T | undefined {
  try {
    return JSON.parse(text) as T
  } catch {
    return undefined
  }
}

export function safeJsonStringify(value: unknown, space?: number): string | undefined {
  try {
    return JSON.stringify(value, null, space)
  } catch {
    return undefined
  }
}
