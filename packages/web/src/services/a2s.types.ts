/* eslint-disable */
export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'patch'
  | 'PATCH'

export interface RequestQuery {
  [key: string]: string | number | boolean | RequestQuery
}

export type RequestBody =
  | {
      [key: string]:
        | string
        | number
        | boolean
        | string[]
        | number[]
        | boolean[]
        | RequestBody
        | RequestBody[]
    }
  | FormData

export interface RequestFunctionArgs {
  url: string
  method: Method
  query: RequestQuery | null | undefined
  body: RequestBody | null | undefined
  extraParams?: RequestBody
  done?: boolean
}

export type ResponseObject<T> = {
  error: boolean
  data: T | null
  message?: string
  stack?: string | Error
}
