<template>
  <ElConfigProvider :locale="locale">
    <router-view />
    <inf-dialog :dialogVisible="infIs"
                ref="infDialogRef"
                :form="infFrom.form"
                :off="infOff"
                :sub="sub"
                :rules="infRules"
                :title="inftitle" />
  </ElConfigProvider>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue'
import { ElConfigProvider, ElMessage, ElMessageBox } from 'element-plus'

import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { versions } from '@/api/version'

import { update } from '@/utils/download'
import InfDialog from '@/components/inf-dialog/index.vue'

const locale = zhCn // Element UI 默认中文
const infIs = ref(false)
const inftitle = ref('接口初始化配置')
if (!(localStorage.getItem('serverip') && localStorage.getItem('serverport'))) {
  localStorage.setItem('serverip', 'http://39.101.173.227')
  localStorage.setItem('serverport', '9000')
}
const userAgent = navigator.userAgent.toLowerCase()
// 初始化组件实例
const infDialogRef = ref<HTMLElement | null>(null)
const empty = () => {
  nextTick(() => {
    if (infDialogRef.value) {
      console.log(infDialogRef.value)
      infDialogRef.value?.infFormRef.resetFields()
    }
  })
}
const infFrom = reactive({
  form: {
    serverip: localStorage.getItem('serverip'),
    serverport: localStorage.getItem('serverport'),
    oraclesrc: localStorage.getItem('oraclesrc')
  }
})
const infRules = reactive({
  serverip: [
    { required: true, message: '请输入服务端IP', trigger: 'blur' }
  ],
  serverport: [
    { required: true, message: '请输入服务端端口', trigger: 'blur' }
  ]
})
const sub = async() => {
  if (infFrom.form.oraclesrc && infFrom.form.oraclesrc != '') {
    const oracleResult = await electron.send('oracle-init', infFrom.form.oraclesrc)
    if (oracleResult && oracleResult.isNot) {
      console.log('oracle返回结果')
      ElMessage.success(oracleResult.message)
    } else {
      ElMessage.error(oracleResult.message)
    }
  }
  infOff()
  localStorage.setItem('serverip', infFrom.form.serverip)
  localStorage.setItem('serverport', infFrom.form.serverport)
  localStorage.setItem('oraclesrc', infFrom.form.oraclesrc)
}

const infOff = () => {
  infIs.value = false
}
// let oraclesrc = localStorage.getItem("oraclesrc")
// if(oraclesrc){
//
//   oracledb.initOracleClient({libDir: oraclesrc});
// }

localStorage.setItem('isClinet', false)
if (userAgent.indexOf('electron') >= 0) {
  localStorage.setItem('isClinet', true)
  electron.onUpdateCounter('el-inf', (_event, value) => {
    empty()
    infFrom.form = {
      serverip: localStorage.getItem('serverip'),
      serverport: localStorage.getItem('serverport'),
      oraclesrc: localStorage.getItem('oraclesrc')
    }
    infIs.value = value
  })
  // // 接收消息
  electron.onUpdateCounter('el-message', (_event, value) => {
    ElMessage({
      message: value.msg,
      type: value?.type
    })
  })
  //
  electron.onUpdate(async(_event, value) => {
    // ElMessage({
    //   type: 'success',
    //   message: '本地版本位' + value
    // })
    const newVersions = await versions()
    if (newVersions.code === 200) {
      const longRangeV = newVersions.data.verson
      if (value !== longRangeV) {
        if (newVersions.uploadType == 1) {
          let url: any = null
          if (localStorage.getItem('serverip') && localStorage.getItem('serverport')) {
            url = localStorage.getItem('serverip') + ':' + localStorage.getItem('serverport')
          } else {
            url = process.env.VUE_APP_BASE_API
          }
          update(url + '/' + newVersions.data.winPath, content)
        } else {
          update(newVersions.data.winPath, content)
        }
        // ElMessage({
        //   type: 'success',
        //   message: '线上版本位' + longRangeV + ' 当前版本位不一致,勇士欢迎回家👏👏👏👏👏'
        // })
      } else {
        // ElMessage({
        //   type: 'success',
        //   message: '当前版本位是最新版(测试版本),勇士欢迎回家👏👏👏👏👏'
        // })
      }
    }
  })
}
</script>
<style>
.index-lists{
  padding: 20px;
}
.tabTop{
  margin-top: 10px;
  padding-bottom: 20px;
}
.operation-btn{
  display: flex;
  justify-content: space-around;
}
</style>
