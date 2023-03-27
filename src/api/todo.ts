// 获取用户管理
import { request } from '@/utils/service'

export function queryAll(data: any) {
  return request({
    url: '/todo/queryAll',
    method: 'post',
    data: { parameter: data }
  })
}

export function todoQuery(data: any) {
  return request({
    url: '/todo/query',
    method: 'post',
    data
  })
}

// 新增
export function todoAdd(data: any) {
  return request({
    url: '/todo/add',
    method: 'post',
    data: { parameter: data }
  })
}

// 详情
export function todoView(data: any) {
  return request({
    url: '/todo/view',
    method: 'post',
    data: { parameter: data }
  })
}

// 修改
export function todoUpdate(data: any) {
  return request({
    url: '/todo/update',
    method: 'post',
    data: { parameter: data }
  })
}

// 删除
export function todoDelete(data: any) {
  return request({
    url: '/todo/delete',
    method: 'post',
    data: { parameter: data }
  })
}
