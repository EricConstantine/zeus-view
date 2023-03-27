// 获取用户管理
import { request } from '@/utils/service'

export function queryAll(data: any) {
  return request({
    url: '/webLibrary/queryAll',
    method: 'post',
    data: { parameter: data }
  })
}

export function webLibraryQuery(data: any) {
  return request({
    url: '/webLibrary/query',
    method: 'post',
    data
  })
}
export function webLibraryUserQuery(data: any) {
  return request({
    url: '/webLibrary/userQuery',
    method: 'post',
    data
  })
}
// 新增
export function webLibraryAdd(data: any) {
  return request({
    url: '/webLibrary/add',
    method: 'post',
    data: { parameter: data }
  })
}

// 详情
export function webLibraryView(data: any) {
  return request({
    url: '/webLibrary/view',
    method: 'post',
    data: { parameter: data }
  })
}

// 修改
export function webLibraryUpdate(data: any) {
  return request({
    url: '/webLibrary/update',
    method: 'post',
    data: { parameter: data }
  })
}

// 删除
export function webLibraryDelete(data: any) {
  return request({
    url: '/webLibrary/delete',
    method: 'post',
    data: { parameter: data }
  })
}
