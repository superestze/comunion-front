/* eslint-disable */
import { Apis } from './yapi.request'

export const apis: Apis = {
  'account@Oauth账号登陆（github）': {
    u: '/account/oauth/login/github',
    m: 'POST',
    q: ['request_token'],
    d: 1
  },
  'account@Oauth账号登陆（Facebook）': {
    u: '/account/oauth/login/facebbok',
    m: 'POST',
    d: 0
  },
  'account@Oauth账号登陆（LinkedIn）': {
    u: '/account/oauth/login/linkedid',
    m: 'POST',
    d: 0
  },
  'account@Oauth账号登陆（twitter）': {
    u: '/account/oauth/login/twitter',
    m: 'POST',
    d: 0
  },
  'account@获取加密钱包登陆用的Nonce': {
    u: '/account/eth/login/nonce',
    m: 'GET',
    q: ['address'],
    d: 1
  },
  'account@ETH钱包登陆（metamask）': {
    u: '/account/eth/login/metamask',
    m: 'POST',
    d: 1
  },
  'account@创建Comer简历': {
    u: '/account/profile',
    m: 'POST',
    d: 0
  },
  'account@获取Comer简历': {
    u: '/account/profile',
    m: 'GET',
    d: 0
  },
  'account@修改Comer简历': {
    u: '/account/profile',
    m: 'PUT',
    d: 0
  },
  'account@获取账号列表': {
    u: '/account/list',
    m: 'GET',
    d: 0
  },
  'account@连接Oauth账号(github)': {
    u: '/account/oauth/link/github',
    m: 'POST',
    d: 0
  },
  'account@连接Oauth账号(facebook)': {
    u: '/account/oauth/link/facebook',
    m: 'POST',
    d: 0
  },
  'account@连接Oauth账号(LinkedIn)': {
    u: '/account/oauth/link/linkedin',
    m: 'POST',
    d: 0
  },
  'account@连接Oauth账号(twitter)': {
    u: '/account/oauth/link/twitter',
    m: 'POST',
    d: 0
  },
  'account@连接ETH钱包': {
    u: '/account/eth/link/metamask',
    m: 'GET',
    d: 0
  },
  'misc@获取上传文件的签名URL（获取后前端可以直接上传）': {
    u: '/misc/upload/presign',
    m: 'GET',
    q: ['file_name'],
    d: 1
  }
}
