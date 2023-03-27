// 获取用户管理
import { request } from '@/utils/service'

export function zonetreeQueryAll(data: any) {
  return request({
    url: '/zonetree/queryAll',
    method: 'post',
    data
  })
}

// 新增
export function zonetreeAdd(data: any) {
  return request({
    url: '/zonetree/add',
    method: 'post',
    data
  })
}

// 详情
export function zonetreeView(data: any) {
  return request({
    url: '/zonetree/view',
    method: 'post',
    data
  })
}

// 修改
export function zonetreeUpdate(data: any) {
  return request({
    url: '/zonetree/update',
    method: 'post',
    data
  })
}

// 删除
export function zonetreeDelete(data: any) {
  return request({
    url: '/zonetree/delete',
    method: 'post',
    data
  })
}
