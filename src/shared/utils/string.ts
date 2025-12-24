export function isBlank(value: string | null | undefined): boolean {
  return value == null || value.trim().length === 0
}

export function trimToUndefined(value: string | null | undefined): string | undefined {
  if (value == null) return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}
