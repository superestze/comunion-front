export function storeObject(key: string, obj: object) {
  localStorage.setItem(key, JSON.stringify(obj))
}

export function readObject<T>(key: string): T | undefined {
  const data = localStorage.getItem(key)
  if (!data) {
    return undefined
  }
  return JSON.parse(data) as T
}

export function removeObject(key: string) {
  localStorage.removeItem(key)
}
