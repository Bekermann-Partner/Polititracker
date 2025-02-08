export function excludeFromObject<T, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(obj as { [p: string]: unknown }).filter(
      ([key]) => !keys.includes(key as K)
    )
  ) as Omit<T, K>;
}
