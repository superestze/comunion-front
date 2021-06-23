/* eslint-disable */
export interface ServiceRequestAndResponseMap {
  'account@Oauth账号登陆（github）': {
    params: {}
    query: {
      /**
       * @description github 前端登陆获取的 request  token
       */
      request_token: any;
    }
    body: {}
    response: {
      /**
       * @description 状态编码
       */
      code: number
      /**
       * @description 返回消息
       */
      message: string
      data: {
        /**
         * @description 昵称
         */
        nick: string
        /**
         * @description 头像
         */
        avatar: string
        /**
         * @description comer ID
         */
        comer_id: string
        /**
         * @description 上链地址
         */
        address: string
        /**
         * @description 登陆成功token JWT
         */
        token: string
        /**
         * @description Comer 的 唯一标识
         */
        uin: number
      }
    }
  }
  'account@Oauth账号登陆（Facebook）': {
    params: {}
    query: {}
    body: {}
    response: any
  }
  'account@Oauth账号登陆（LinkedIn）': {
    params: {}
    query: {}
    body: {}
    response: any
  }
  'account@Oauth账号登陆（twitter）': {
    params: {}
    query: {}
    body: {}
    response: {}
  }
  'account@获取加密钱包登陆用的Nonce': {
    params: {}
    query: {
      /**
       * @description 用户当前钱包地址
       * @example { address: 0x1123124124414 }
       */
      address: any;
    }
    body: {}
    response: {
      code?: number
      message?: string
      data?: {
        nonce?: string
      }
    }
  }
  'account@ETH钱包登陆（metamask）': {
    params: {}
    query: {}
    body: {
      /**
       * @description 钱包地址
       */
      address?: string
      /**
       * @description 消息Hash
       */
      message_hash?: string
      /**
       * @description V
       */
      v?: string
      /**
       * @description S
       */
      r?: string
      /**
       * @description R
       */
      s?: string
      /**
       * @description 签名
       */
      signature?: string
    }
    response: {
      code?: number
      message?: string
      data?: {
        /**
         * @description 昵称
         */
        nick?: string
        /**
         * @description 头像
         */
        avatar?: string
        /**
         * @description comer ID
         */
        comer_id?: string
        /**
         * @description 上链地址
         */
        address?: string
        /**
         * @description 登陆后Token
         */
        token?: string
        /**
         * @description comer 唯一标识
         */
        uin?: string
      }
    }
  }
  'account@创建Comer简历': {
    params: {}
    query: {}
    body: {}
    response: any
  }
  'account@获取Comer简历': {
    params: {}
    query: {}
    body: {}
    response: any
  }
  'account@修改Comer简历': {
    params: {}
    query: {}
    body: {}
    response: any
  }
  'account@获取账号列表': {
    params: {}
    query: {}
    body: {}
    response: any
  }
  'account@连接Oauth账号(github)': {
    params: {}
    query: {}
    body: {}
    response: any
  }
  'account@连接Oauth账号(facebook)': {
    params: {}
    query: {}
    body: {}
    response: any
  }
  'account@连接Oauth账号(LinkedIn)': {
    params: {}
    query: {}
    body: {}
    response: any
  }
  'account@连接Oauth账号(twitter)': {
    params: {}
    query: {}
    body: {}
    response: any
  }
  'account@连接ETH钱包': {
    params: {}
    query: {}
    body: {}
    response: any
  }
  'misc@获取上传文件的签名URL（获取后前端可以直接上传）': {
    params: {}
    query: {
      /**
       * @description 准备上传的文件名，带后缀
       */
      file_name: any;
    }
    body: {}
    response: {
      /**
       * @description 状态编码
       */
      code?: number
      /**
       * @description 消息
       */
      message?: string
      /**
       * @description 可以使用的上传URL
       */
      data?: string
    }
  }
}

export type ServiceKeys = keyof ServiceRequestAndResponseMap
