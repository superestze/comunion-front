addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Many more examples available at:
 *   https://developers.cloudflare.com/workers/examples
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request) {
  const url = new URL(request.url)

  if (url.pathname.startsWith('/api')) {
    return fetch(url.href.replace(url.host, 'd.comunion.io'), request)
  }

  return fetch(request)
}
