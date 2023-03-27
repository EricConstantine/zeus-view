// 版本
import { request } from '@/utils/service'

// 查询版本
export function versions() {
  return request({
    url: 'versions/latestversion',
    method: 'post'
  })
}

export const downloadPath = 'http://39.101.173.227/app.zip'

// 分页
export function versionsQuery(data: any) {
  return request({
    url: 'versions/query',
    method: 'post',
    data
  })
}

// 新增
export function versionsAdd(data: any) {
  return request({
    url: 'versions/add',
    method: 'post',
    data
  })
}

// 更新
export function versionsUpdate(data: any) {
  return request({
    url: 'versions/update',
    method: 'post',
    data
  })
}

// 查看
export function versionsView(data: any) {
  return request({
    url: 'versions/view',
    method: 'post',
    data
  })
}

// 删除
export function versionsDelete(data: any) {
  return request({
    url: 'versions/delete',
    method: 'post',
    data
  })
}
