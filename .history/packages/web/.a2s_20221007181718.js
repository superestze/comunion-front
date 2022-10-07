/* eslint-disable */
/** @type {import('@zidong/a2s/dist/config').DataSourceConfig} */
module.exports = {
  // Custom plugins
  plugins: [/** require('a2s-custom-plugin') */],
  // Data source type
  // dataSourceOptions: {
    // support openapi and yapi
    /** @type {import('@zidong/a2s/dist/plugins').OpenAPIDataSourceOptions} */
    // openapi: {
      // apiUrl: 'https://your.company.com/apis-json',
      // basicAuth: {
      //   username: '',
      //   password: ''
      // },
      // headers: {
      //   Cookie: 'xxx=xxx; xxx=xxx;'
      // }
  //   }
  // },
  /** @type {import('@zidong/a2s/dist/plugins').YAPIDataSourceOptions} */
  dataSourceOptions: {
    'yapi': {
      apiUrl: 'https://yapi.comunion.io/',
      projectId: 39,
      token: '2b685c64fec14e4573d9c85522ac9a5b57562ec693dcc2db6b7a8202b101572c',
      headers: {
        Cookie: 'rl_page_init_referrer=RudderEncrypt%3AU2FsdGVkX1%2BiENU4LFOObi2ZTAq%2FL%2FJMMHaqtlZo4vc%3D; rl_page_init_referring_domain=RudderEncrypt%3AU2FsdGVkX19IkFYVqcUNGBHuZ307H0P6MIc8odNh%2Bjc%3D; rl_anonymous_id=RudderEncrypt%3AU2FsdGVkX1%2Blh9CllPaEiWoJx1YufQWOGTMoRBsmnxqYy%2F6ODf5STATvRaR8kJZKXW5vmuThiaPmM9NFSpGc9A%3D%3D; rl_user_id=RudderEncrypt%3AU2FsdGVkX19UutoPxm9puik%2FOUlInA2snU2%2BANRoKLB%2FBSA%2BXFSrBxMK%2F5%2BLVE%2Fv; rl_trait=RudderEncrypt%3AU2FsdGVkX18tQSVSsmfdwKfrlHGZlcrYPsAfOunj5f0%3D; _yapi_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjE1LCJpYXQiOjE2NjUxMzQ1MjIsImV4cCI6MTY2NTczOTMyMn0.DLrQrgBHq8tym2L8Zu96F7We5pg156L9VNZlRYPAhkI; _yapi_uid=15'
      }
    }
  },
  outputPath: 'src/services',
  overwrite: true,
  // [Optional, default: 'axios']
  requestAdapter: 'axios',
  // [Optional, default: true]
  trim: true,
  // [Optional, default: ['a2s.adapter.ts']]
  // eg: ['a2s.adapter.ts']
  ignoreFiles: ['a2s.adapter.ts'],
      // [Optional, default: null]
  dataPath: null
}
