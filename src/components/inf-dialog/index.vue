<template>
  <el-dialog v-model="dialogVisible" :title="title" width="30%" :before-close="off" draggable>
    <el-form :model="form" :rules="rules" label-width="160px" ref="infFormRef">
      <el-form-item label="服务端IP：" prop="serverip">
        <el-input v-model="form.serverip" />
      </el-form-item>
      <el-form-item label="服务端端口：" prop="serverport">
        <el-input v-model="form.serverport" />
      </el-form-item>
      <el-form-item label="Oracle的OCI路径：" prop="oraclesrc">
        <el-input v-model="form.oraclesrc" placeholder="例如：F:\oraclevmware\instantclient_12_2" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="off">取消</el-button>
        <el-button type="primary" @click="infSub(infFormRef)">
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, defineEmits } from 'vue'
import { FormInstance, FormRules } from 'element-plus/es'

interface Props {
  dialogVisible: boolean
  title: string
  form: object
  rules: object
  off: () => void
  sub: () => void
}

const props = withDefaults(defineProps<Props>(), {
  dialogVisible: false,
  title: '',
  form: () => {
    return {}
  },
  rules: () => {
    return {}
  },
  off: () => {
    return () => {
    }
  },
  sub: () => {
    return () => {
    }
  }

})
const infFormRef = ref<FormInstance>()
const infSub = async(formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      props.sub()
    } else {
      console.log('error submit!', fields)
    }
  })
}
defineExpose({
  infFormRef
})
</script>

<style scoped lang="scss">

</style>
