/* eslint-disable */
import axios from 'axios'
import { RequestFunctionArgs, ResponseObject } from './a2s.types'

let _token = localStorage.getItem('token')

export function getToken() {
  return _token
}

export function setToken(_newToken: string) {
  _token = _newToken
}

// export interface BaseResponse<T = any> {
//   code: number
//   message?: string
//   data: T
// }

export async function requestAdapter<T = any>(args: RequestFunctionArgs): Promise<ResponseObject<T>> {
  const { url, method, query, body, done = true } = args
  const token = getToken()
  const { status, data, statusText } = await axios.request({
    url,
    method,
    baseURL: done ? '/api' : 'https://yapi.comunion.io/mock/39/api',
    params: query,
    data: body,
    responseType: 'json',
    headers: token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {}
  })
  if (status < 300 && status >= 200) {
    return {
      error: false,
      data: data as T
    }
    // TODO show error message
    // return {
    //   error: true,
    //   message: data.message,
    //   data: null
    // }
  }
  return {
    error: true,
    data: null,
    message: data?.message ?? statusText
  }
}
