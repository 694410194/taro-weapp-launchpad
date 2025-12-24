export function pick<T extends object, const K extends readonly (keyof T)[]>(
  object: T,
  keys: K,
): Pick<T, K[number]> {
  const result = {} as Pick<T, K[number]>
  for (const key of keys) {
    if (key in object) (result as any)[key] = (object as any)[key]
  }
  return result
}

export function omit<T extends object, const K extends readonly (keyof T)[]>(
  object: T,
  keys: K,
): Omit<T, K[number]> {
  const omitted = new Set<keyof T>(keys as readonly (keyof T)[])
  const result = {} as Omit<T, K[number]>

  for (const key of Object.keys(object) as (keyof T)[]) {
    if (omitted.has(key)) continue
    ;(result as any)[key] = (object as any)[key]
  }

  return result
}
