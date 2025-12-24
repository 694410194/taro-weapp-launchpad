export function invariant(condition: unknown, message = 'Invariant failed'): asserts condition {
  if (condition) return
  throw new Error(message)
}

export function assertNever(value: never, message?: string): never {
  throw new Error(message ?? `Unexpected value: ${String(value)}`)
}
