/* eslint-disable */
import axios, { AxiosRequestHeaders } from 'axios'
import { message } from '@comunion/components'
import { RequestFunctionArgs } from './a2s.types'

import { useUserStore } from '@/stores'

export interface BaseResponse<T = any> {
  code: number
  message?: string
  data: T
}

function getHeaders(): AxiosRequestHeaders {
  const userStore = useUserStore()
  return userStore.token
    ? {
        'X-COMUNION-AUTHORIZATION': userStore.token
      }
    : {}
}

function onErrorHandler(
  error: any,
  skipMessage = false
): {
  error: true
  data: null
  message?: string
  code?: number
} {
  const userStore = useUserStore()
  let msg = error.message ?? 'Error occured'
  try {
    const rep: BaseResponse = error.response.data
    if (rep.message) {
      msg = rep.message
    }
    if (rep.code === 401 && location.pathname !== '/auth/login') {
      userStore.logout('The token expired, please re-login')
      return { error: true, data: null }
    }
  } catch (error) {
    //
  }
  if (!skipMessage) {
    message.error(msg)
  }
  return {
    error: true,
    data: null,
    message: msg,
    code: error?.response?.data?.code
  } as const
}

export async function requestAdapter<T = any>(
  args: RequestFunctionArgs & {
    skipMessage?: boolean
  }
): Promise<ResponseObject<T>> {
  const { url, method, query, body, done = true } = args
  try {
    const { data } = await axios.request({
      url,
      method,
      baseURL: done ? '/api' : 'https://yapi.comunion.io/mock/39/api',
      params: query,
      data: body,
      responseType: 'json',
      headers: getHeaders()
    })
    return {
      error: false,
      data: data as T
    }
  } catch (error) {
    return onErrorHandler(error, query?.skipMessage as boolean)
  }
}

type ResponseObject<T> =
  | {
      code?: number
      error: true
      data: null
      message?: string
      stack?: string | Error
    }
  | {
      error: false
      data: T
      message?: string
    }

export async function upload(
  file: File,
  onProgress: (percent: number) => void
): Promise<string | undefined> {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const { data } = await axios.post('/misc/upload', formData, {
      baseURL: '/api',
      responseType: 'json',
      headers: getHeaders(),
      onUploadProgress: event => {
        const percent = Math.round((event.loaded / event.total) * 100) / 100
        onProgress(percent)
      }
    })
    return data.Url as string
  } catch (error: any) {
    console.log('error==>', error.response)

    onErrorHandler(error)
    return undefined
  }
}
