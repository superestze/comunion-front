/* eslint-disable */
module.exports = {
  // yapi prefix yapi地址前缀
  apiPrefix: 'https://yapi.comunion.io',
  // yapi project's token yapi的项目token
  token: '5e8430f0e95745b63eb64a473fa65d63dafb16b8449966daf1bc7d72619e30ee',
  // yapi projects's id yapi的项目id
  projectId: 27,
  // folder to save service files 生成的service相关文件的存储位置
  outputPath: 'src/services',
  // wether to save the origin yapi api json response to file 是否保存api.json文件
  saveJson: false,
  // overwrite the static files? This is recommended, keep it true 是否覆盖固定生成的几个文件？一般不建议取消，保持文件最新
  overwrite: true,
  // [Optional, default: false] wether to trim the api's group name and api's name 是否对api的分组名和名称进行trim
  trim: true,
  // [Optional, default: []] files to ignore when generating 生成时可忽略的文件集合
  // eg: ['yapi.services.ts']
  ignoreFiles: [],
  // [Optional, default: true] use FormData type or not 是否使用FormData，小程序不需要
  hasFormData: true,
  // [Optional, default: null] de-structure response data types 解构response返回的数据层级，一般用于后端返回的数据有一层固定的包裹，比如 { data: {}, message: '', err_code: '' } 这种情况，此时设置为 'data' 将自动解构到 data 里面的具体数据，如果有多层包裹，请使用数组
  dataPath: 'data'
}
