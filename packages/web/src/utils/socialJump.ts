export const toSocialEnd = (url: string) => {
  if (url.startsWith('http') || url.startsWith('mailto')) {
    window.open(url)
  } else {
    window.open('//' + url)
  }
}
