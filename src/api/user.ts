// 获取用户管理
import { request } from '@/utils/service'

export function queryAll(data: any) {
  return request({
    url: '/user/queryAll',
    method: 'post',
    data
  })
}

export function userQuery(data: any) {
  return request({
    url: '/user/query',
    method: 'post',
    data
  })
}

// 新增
export function userAdd(data: any) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

// 详情
export function userView(data: any) {
  return request({
    url: '/user/view',
    method: 'post',
    data
  })
}

// 修改
export function userUpdate(data: any) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

// 删除
export function userDelete(data: any) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}
