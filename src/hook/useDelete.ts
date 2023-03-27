import { ElMessage, ElMessageBox } from 'element-plus/es'

interface valueType {
  init: () => any
  url: (data: any) => any
  // url: object
  id: string | number
}

export function useDelete(value: valueType) {
  ElMessageBox.confirm('删除后无法恢复，请确认是否删除', '是否删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async() => {
      const use = await value.url({ parameter: value.id })
      if (use.code == 200) {
        if (use.data) {
          // dataChange()
          value.init()
          ElMessage.success(use.msg)
        }
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
