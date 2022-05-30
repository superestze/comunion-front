export const toSocialEnd = (url: string) => {
  if (url.startsWith('http')) {
    window.open(url)
  } else {
    window.open('//' + url)
  }
}
