import axois from 'axios'
import { createServices } from './yapi.services'

const services = createServices(async (url, method, query, body) => {
  try {
    const res = await axois.request({
      url: '/api' + url,
      method: method,
      params: query,
      data: body,
      headers: {
        Authorization: '',
      },
    })
    if (res.status < 300 && res.status >= 200) {
      if (res.data.code === 200) {
        return {
          error: false,
          data: res.data.data,
        }
      }
      return {
        error: true,
        data: null,
        stack: res,
      }
    }
    return {
      error: true,
      data: null,
      stack: res,
      message: res.data?.message ?? '未知',
    }
  } catch (error) {
    console.error(error)
    return {
      error,
      data: null,
      stack: error,
    }
  }
})

export default services
