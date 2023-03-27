// 获取用户管理
import { request } from '@/utils/service'

export function queryAll(data: any) {
  return request({
    url: '/shell/queryAll',
    method: 'post',
    data: { parameter: data }
  })
}

export function shellQuery(data: any) {
  return request({
    url: '/shell/query',
    method: 'post',
    data
  })
}

// 新增
export function shellAdd(data: any) {
  return request({
    url: '/shell/add',
    method: 'post',
    data: { parameter: data }
  })
}

// 详情
export function shellView(data: any) {
  return request({
    url: '/shell/view',
    method: 'post',
    data: { parameter: data }
  })
}

// 修改
export function shellUpdate(data: any) {
  return request({
    url: '/shell/update',
    method: 'post',
    data: { parameter: data }
  })
}

// 删除
export function shellDelete(data: any) {
  return request({
    url: '/shell/delete',
    method: 'post',
    data: { parameter: data }
  })
}

// 执行脚本
export function shellExcuete(data: any) {
  return request({
    url: '/shell/execueteShell',
    method: 'post',
    data: { parameter: data }
  })
}
