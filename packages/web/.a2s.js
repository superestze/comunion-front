/* eslint-disable */
/** @type {import('@zidong/a2s/dist/config').DataSourceConfig} */
module.exports = {
  // dataSourceOptions: {
    /** @type {import('@zidong/a2s/dist/plugins').OpenAPIDataSourceOptions} */
    // openapi: {
    //   apiUrl: 'https://your.company.com/apis-json',
      // basicAuth: {
      //   username: '',
      //   password: ''
      // },
      // headers: {
      //   Cookie: 'xxx=xxx; xxx=xxx;'
      // }
    // }
  // },
  /** @type {import('@zidong/a2s/dist/plugins').YAPIDataSourceOptions} */
  dataSourceOptions: {
    'yapi': {
      apiUrl: 'https://yapi.comunion.io',
      projectId: 27,
      token: '5e8430f0e95745b63eb64a473fa65d63dafb16b8449966daf1bc7d72619e30ee'
    }
  },
  // generate path
  outputPath: 'src/services',
  // overwrite files if existed
  overwrite: true,
  // code generate based on axios
  requestAdapter: 'axios',
  // trim white space
  trim: true,
  // ignore files while generate
  ignoreFiles: ['a2s.adapter.ts'],
  // path to api response's data
  dataPath: 'data'
}
