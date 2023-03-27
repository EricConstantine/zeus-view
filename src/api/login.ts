import { request } from '@/utils/service'

interface IUserRequestData {
  parameter: {
    username: string
    password: string
  }
}

// 登录以后返回 token
export function accountLogin(data: IUserRequestData) {
  return request({
    url: 'user/login',
    method: 'post',
    data
  })
}

// 获取用户详情
export function userInfoRequest() {
  return request({
    url: 'user/info',
    method: 'post'
  })
}
