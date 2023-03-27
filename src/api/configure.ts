// 查询版本
import { request } from '@/utils/service'

// 获取用户项目列表
export function getProjects() {
  return request({
    url: 'user/getProjects',
    method: 'post'
  })
}

// 获取配置列表
export function configQuery(data: any) {
  return request({
    url: 'config/query',
    method: 'post',
    data
  })
}

// 配置详情
export function configView(data: any) {
  return request({
    url: 'config/view',
    method: 'post',
    data
  })
}

// 保存
export function configAdd(url: string, data: any) {
  return request({
    url: 'config/' + url,
    method: 'post',
    data
  })
}

// 删除
export function configDelete(data: any) {
  return request({
    url: 'config/delete',
    method: 'post',
    data
  })
}
