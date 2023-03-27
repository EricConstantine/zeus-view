import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { get } from 'lodash'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/cache'

// 创建请求实例
function createService() {
  // 创建一个 axios 实例
  const service = axios.create()
  // 请求拦截
  service.interceptors.request.use(
    config => config,
    // 发送失败
    error => Promise.reject(error)
  )
  // 响应拦截（可根据具体业务作出相应的调整）
  service.interceptors.response.use(
    response => {
      // apiData 是 api 返回的数据
      const apiData = response.data as any
      // 这个 code 是和后端约定的业务 code
      const code = apiData.code
      // 如果没有 code, 代表这不是项目后端开发的 api
      if (code === undefined) {
        ElMessage.error('非本系统的接口')
        return Promise.reject(new Error('非本系统的接口'))
      } else {
        switch (code) {
          case 0:
            // code === 0 代表没有错误
            return apiData
          case 200:
            // code === 20000 代表没有错误
            return apiData
          default:
            // 不是正确的 code
            ElMessage.error(apiData.msg || 'Error')
            return Promise.reject(new Error('Error'))
        }
      }
    },
    error => {
      // status 是 HTTP 状态码
      const status = get(error, 'response.status')
      console.log('error', error)
      console.log('status', status)
      switch (status) {
        case 400:
          error.message = '请求错误'
          break
        case 401:
          error.message = '未授权，请登录'
          break
        case 403:
          error.message = '拒绝访问'
          break
        case 404:
          error.message = '请求地址出错'
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器内部错误'
          break
        case 501:
          error.message = '服务未实现'
          break
        case 502:
          error.message = '网关错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网关超时'
          break
        case 505:
          error.message = 'HTTP版本不受支持'
          break
        default:
          break
      }
      ElMessage.error(error.message)
      return Promise.reject(error)
    }
  )
  return service
}

// 创建请求方法
function createRequestFunction(service: AxiosInstance) {
  return function(config: AxiosRequestConfig) {
    let url: any = null
    if (localStorage.getItem('serverip') && localStorage.getItem('serverport')) {
      url = localStorage.getItem('serverip') + ':' + localStorage.getItem('serverport')
    } else {
      url = process.env.VUE_APP_BASE_API
    }
    const configDefault = {
      headers: {
        // Authorization: 'Bearer ' + getToken(),
        // mock 接口专用，开发时可自行修改
        // 'X-Access-Token': getToken(),
        authorization: getToken(),
        'Content-Type': get(config, 'headers.Content-Type', 'application/json')
      },
      // timeout: 18000,
      timeout: 5 * 60 * 1000,
      baseURL: url,
      data: {}
    }
    return service(Object.assign(configDefault, config))
  }
}

// 用于网络请求的实例
export const service = createService()
// 用于网络请求的方法
export const request = createRequestFunction(service)
