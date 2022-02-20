const hostBlackList = ['localhost']
export function effectiveUrlValidator(value: string): boolean {
  // return /^(https|http):(\/\/|\\)(www)\.+[a-zA-Z]+\.\w/.test(value);
  if (!/^https?:\/\//.test(value)) {
    return false
  }
  try {
    const url = new URL(value)
    // 非ip地址
    if (/(\d+\.){3}(\d+)/.test(url.hostname)) {
      return false
    }
    if (hostBlackList.includes(url.hostname)) {
      return false
    }
    return true
  } catch (error) {
    return false
  }
}
