'use strict'
exports.__esModule = true
exports.fetch = void 0
var http_1 = require('http')
var https_1 = require('https')
function fetch(url) {
  return new Promise(function (resolve, reject) {
    ;(url.startsWith('https') ? https_1['default'] : http_1['default']).get(url, function (res) {
      var data = ''
      res.on('data', function (chunk) {
        data += chunk
      })
      res.once('end', function () {
        resolve(data)
      })
      res.once('error', function (e) {
        reject(e)
      })
    })
  })
}
exports.fetch = fetch
