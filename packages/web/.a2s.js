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
    yapi: {
      apiUrl: 'https://yapi.comunion.io',
      projectId: 39,
      token: '3ceced6c6b6def333652031c43cbad8cf2887455469c35a5a6b62e7ad9250787'
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
  dataPath: ''
}
