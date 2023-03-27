// 获取用户管理
import { request } from '@/utils/service'

// 新增
export function templateUpdate(data: any) {
  return request({
    url: '/template/update',
    method: 'post',
    data
  })
}

// 详情
export function templateView(data: any) {
  return request({
    url: '/template/view',
    method: 'post',
    data
  })
}
