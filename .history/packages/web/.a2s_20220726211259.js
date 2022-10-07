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
        Cookie: '_yapi_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjE1LCJpYXQiOjE2NTg1OTQ2NjksImV4cCI6MTY1OTE5OTQ2OX0.Id93Ga3L7ghBVkLIoa4n4D51B5BVsehxCV9qWk1m5s8; _yapi_uid=15;'
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
