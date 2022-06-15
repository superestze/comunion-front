export function setItem<T>(key: string, value: T) {
  const str: string = JSON.stringify(value)
  sessionStorage.setItem(key, str)
}

export function getItem<T>(key: string): T | null {
  const result: string | null = sessionStorage.getItem(key)
  if (result! == null) {
    return JSON.parse(result as unknown as string)
  }
  return result as unknown as T
}

export function clearItem() {
  sessionStorage.clear()
}
