/* eslint-disable */
import { requestAdapter } from './a2s.adapter'
import type { RequestBody, RequestQuery } from './a2s.types'

/**
 * 将参数拆分为 query 和 body
 */
function extract(args: RequestBody | any, queryList: string[], paramList: string[]) {
  if (args && typeof args === 'object') {
    const query: RequestQuery = {}
    const body: RequestBody = {}
    Object.keys(args).forEach(key => {
      if (queryList.includes(key)) {
        query[key] = (args as RequestBody)[key] as RequestQuery
      } else if (!paramList.includes(key)) {
        body[key] = (args as RequestBody)[key]
      }
    })
    return { query, body }
  }
  return { query: {}, body: {} }
}

/**
 * 路径参数插值
 */
function replacePath(path: string, pathValueMap?: any) {
  return path
    .replace(/\/\{(\w+)}/g, (_, str) => {
      return `/${(pathValueMap as Record<string, string | number>)[str]}`
    })
    .replace(/\/:(\w+)/g, (_, str) => {
      return `/${(pathValueMap as Record<string, string | number>)[str]}`
    })
}

export const services = {
  'account@Oauth账号登陆（github）'(args: {
    /**
     * @description github 前端登陆获取的 request  token
     */
    request_token: any
  }) {
    return requestAdapter<{
      /**
       * @description 状态编码
       */
      code: number
      /**
       * @description 返回消息
       */
      message: string
      data?: {
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
    }>({
      url: replacePath('/account/oauth/login/github', args),
      method: 'POST',
      ...extract(args, ['request_token'], [])
    })
  },
  'account@Oauth账号登陆（Facebook）'(args?: any) {
    return requestAdapter<any>({
      url: replacePath('/account/oauth/login/facebbok', args),
      method: 'POST',
      ...extract(args, [], [])
    })
  },
  'account@Oauth账号登陆（LinkedIn）'(args?: any) {
    return requestAdapter<any>({
      url: replacePath('/account/oauth/login/linkedid', args),
      method: 'POST',
      ...extract(args, [], [])
    })
  },
  'account@Oauth账号登陆（twitter）'(args?: any) {
    return requestAdapter<{}>({
      url: replacePath('/account/oauth/login/twitter', args),
      method: 'POST',
      ...extract(args, [], [])
    })
  },
  'account@获取加密钱包登陆用的Nonce'(args: {
    /**
     * @description 用户当前钱包地址
     * @example 0x1123124124414
     */
    address: any
  }) {
    return requestAdapter<{
      code?: number
      message?: string
      data?: {
        nonce?: string
      }
    }>({
      url: replacePath('/account/eth/login/nonce', args),
      method: 'GET',
      ...extract(args, ['address'], [])
    })
  },
  'account@ETH钱包登陆（metamask）'(args: {
    /**
     * @description 钱包地址
     */
    address: string
    /**
     * @description 消息Hash
     */
    message_hash: string
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
    signature: string
  }) {
    return requestAdapter<{
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
    }>({
      url: replacePath('/account/eth/login/metamask', args),
      method: 'POST',
      ...extract(args, [], [])
    })
  },
  'account@创建Comer简历'(args?: any) {
    return requestAdapter<any>({
      url: replacePath('/account/profile', args),
      method: 'POST',
      ...extract(args, [], [])
    })
  },
  'account@获取Comer简历'(args?: any) {
    return requestAdapter<any>({
      url: replacePath('/account/profile', args),
      method: 'GET',
      ...extract(args, [], [])
    })
  },
  'account@修改Comer简历'(args?: any) {
    return requestAdapter<any>({
      url: replacePath('/account/profile', args),
      method: 'PUT',
      ...extract(args, [], [])
    })
  },
  'account@获取账号列表'(args?: any) {
    return requestAdapter<any>({
      url: replacePath('/account/list', args),
      method: 'GET',
      ...extract(args, [], [])
    })
  },
  'account@连接Oauth账号(github)'(args?: any) {
    return requestAdapter<any>({
      url: replacePath('/account/oauth/link/github', args),
      method: 'POST',
      ...extract(args, [], [])
    })
  },
  'account@连接Oauth账号(facebook)'(args?: any) {
    return requestAdapter<any>({
      url: replacePath('/account/oauth/link/facebook', args),
      method: 'POST',
      ...extract(args, [], [])
    })
  },
  'account@连接Oauth账号(LinkedIn)'(args?: any) {
    return requestAdapter<any>({
      url: replacePath('/account/oauth/link/linkedin', args),
      method: 'POST',
      ...extract(args, [], [])
    })
  },
  'account@连接Oauth账号(twitter)'(args?: any) {
    return requestAdapter<any>({
      url: replacePath('/account/oauth/link/twitter', args),
      method: 'POST',
      ...extract(args, [], [])
    })
  },
  'account@连接ETH钱包'(args?: any) {
    return requestAdapter<any>({
      url: replacePath('/account/eth/link/metamask', args),
      method: 'GET',
      ...extract(args, [], [])
    })
  },

  'misc@获取上传文件的签名URL（获取后前端可以直接上传）'(args: {
    /**
     * @description 准备上传的文件名，带后缀
     */
    file_name: any
  }) {
    return requestAdapter<{
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
    }>({
      url: replacePath('/misc/upload/presign', args),
      method: 'GET',
      ...extract(args, ['file_name'], [])
    })
  }
}

export type ServiceKeys = keyof typeof services

export type ServiceArg<T extends ServiceKeys> = Parameters<typeof services[T]>[0]

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T

export type ServiceReturn<T extends ServiceKeys> = Awaited<ReturnType<typeof services[T]>>['data']
