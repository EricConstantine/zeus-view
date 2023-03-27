// 获取用户管理
import { request } from '@/utils/service'

export function projectQuery(data: any) {
  return request({
    url: '/project/query',
    method: 'post',
    data
  })
}

// 新增
export function projectAdd(data: any) {
  return request({
    url: '/project/add',
    method: 'post',
    data
  })
}

// 详情
export function projectView(data: any) {
  return request({
    url: '/project/view',
    method: 'post',
    data
  })
}

// 修改
export function projectUpdate(data: any) {
  return request({
    url: '/project/update',
    method: 'post',
    data
  })
}

// 删除
export function projectDelete(data: any) {
  return request({
    url: '/project/delete',
    method: 'post',
    data
  })
}

// 复制
export function projectCopy(data: any) {
  return request({
    url: '/project/copy',
    method: 'post',
    data
  })
}
