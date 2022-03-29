/* eslint-disable */
import axios from 'axios'
import { message } from '@comunion/components'
import { RequestFunctionArgs, ResponseObject } from './a2s.types'

let _token = ''

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

export async function requestAdapter<T = any>(
  args: RequestFunctionArgs
): Promise<ResponseObject<T>> {
  const { url, method, query, body, done = true } = args
  const token = getToken()
  try {
    const { status, data, statusText } = await axios.request({
      url,
      method,
      baseURL: done ? '/api' : 'https://yapi.comunion.io/mock/39/api',
      params: query,
      data: body,
      responseType: 'json',
      headers: token
        ? {
            'X-COMUNION-AUTHORIZATION': token
          }
        : {}
    })
    if (status < 300 && status >= 200) {
      return {
        error: false,
        data: data as T
      }
    }
    return {
      error: true,
      data: null,
      message: data.message ?? statusText
    }
  } catch (error) {
    const msg = error.message ?? 'Error occured'
    message.error(msg)
    return {
      error: true,
      data: null,
      message: msg
    }
  }
}

export async function upload(file: File, onProgress: (percent: number) => void): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const token = getToken()
  const { data } = await axios.post('/misc/upload', formData, {
    baseURL: '/api',
    responseType: 'json',
    headers: token
      ? {
          'X-COMUNION-AUTHORIZATION': token
        }
      : {},
    onUploadProgress: (event) => {
      const percent = Math.round((event.loaded / event.total) * 100)
      onProgress(percent)
    }
  })
  return data.Url
}
