export function omitObject(
  obj: Record<string, any>,
  keys: (keyof typeof obj)[]
): Omit<typeof obj, keyof typeof obj> {
  const result: Record<string, any> = {}
  Object.keys(obj).forEach(key => {
    if (!keys.includes(key)) {
      result[key] = obj[key]
    }
  })
  return result
}
