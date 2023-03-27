import { ElMessage, ElMessageBox } from 'element-plus'
// import { downloadPath } from '@/api/version'

const electron = (window as any).electron
export const update = (url: string, content:string) => {
  // ElMessage({
  //   type: 'success',
  //   message: '下载事件'
  // })
  ElMessageBox.confirm(
    '发现新版本，是否更新？',
    content,
    {
      confirmButtonText: '是',
      cancelButtonText: '否',
      showCancelButton: true,
      closeOnClickModal: false,
      showClose: false,
      type: 'warning',
      draggable: true
    }
  )
    .then(async() => {
      await electron.send('download', { codeType: 3, path: url })
    })
    .catch(() => {
      // ElMessage({
      //   type: 'info',
      //   message: '内部错误无法更新请联系管理员'
      // })
    })
}

export const codeDownload = async(path: string, url: string) => {
  return await electron.send('code-download', { codeType: 2, pathUrl: path, path: url })
}
