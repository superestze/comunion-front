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
            token: 'afaf337431a6de87a6026e9efd421f76f0aadb2bef6b0715bbf4e98c34b8764b',
            headers: {
                Cookie: '_yapi_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjE4MywiaWF0IjoxNjUzMjc4NTU4LCJleHAiOjE2NTM4ODMzNTh9.eeTOhWZWu5lD4DjAXgU6Jrqsga3_NKRQ-BO6GXV8Pfw; _yapi_uid=183'
            }
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