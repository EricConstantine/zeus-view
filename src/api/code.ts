// 获取用户项目列表
import { request } from '@/utils/service'

// 获取配置下拉框
export function getConfigs() {
  return request({
    url: 'config/getConfigs',
    method: 'post'
  })
}

// 根据下拉框获取详情
export function getProjectDetail(data: any) {
  return request({
    url: 'config/getProjectDetail',
    method: 'post',
    data
  })
}

// 获取配置列表
export function makeCode(data: any) {
  return request({
    url: 'template/makeCode',
    method: 'post',
    data
  })
}

// 生成文件
