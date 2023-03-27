import Clipboard from 'clipboard'
import { ElMessage } from 'element-plus'

function clipboardSuccess() {
  ElMessage({
    type: 'success',
    message: '复制成功'
  })
}

function clipboardError() {
  ElMessage({
    type: 'error',
    message: '复制失败'
  })
}

export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess()
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
