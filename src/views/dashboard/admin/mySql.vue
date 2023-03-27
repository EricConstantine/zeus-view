<template>
  <div class="mySql">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      @keyup.enter="submitForm(ruleFormRef)"
      label-width="250px"
    >
      <el-form-item label="MYSQL服务器IP地址：" prop="mysqlhost">
        <el-input v-model="ruleForm.mysqlhost" />
      </el-form-item>
      <el-form-item label="请输入MYSQL服务器端口111：" prop="mysqlport">
        <el-input v-model="ruleForm.mysqlport" />
      </el-form-item>
      <el-form-item label="请输入MYSQL服务器用户名：" prop="mysqluser">
        <el-input v-model="ruleForm.mysqluser" />
      </el-form-item>
      <el-form-item label="请输入MYSQL服务器密码：" prop="mysqlpassword">
        <el-input v-model="ruleForm.mysqlpassword" />
      </el-form-item>
      <el-form-item label="请输入MYSQL服务器数据库名称：" prop="mysqldatabase">
        <el-input v-model="ruleForm.mysqldatabase" />
      </el-form-item>
      <el-form-item v-if="footer">
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          测试数据库链接
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">
          Cancel
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, getCurrentInstance, defineEmits } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus/es'

interface Props {
  footer: boolean
}

const props = withDefaults(defineProps<Props>(), {
  footer: true
})

const { ctx } = getCurrentInstance()
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  developerconfigurationid: '',
  clientcodelist: '',
  mysqldatabase: 'code',
  mysqlhost: '39.101.173.227',
  mysqlpassword: 'admin@612',
  mysqlport: '13306',
  mysqluser: 'root',
  servercodelist: '',
  userid: '',
  corpname: ''
})
const rules = reactive<FormRules>({
  servercodelist: [
    { required: true, message: '请输入项目根目录路径', trigger: 'blur' }
  ],
  mysqlhost: [
    { required: true, message: '请输入MYSQL服务器IP地址', trigger: 'blur' }
  ],
  mysqlport: [
    { required: true, message: '请输入MYSQL端口', trigger: 'blur' }
  ],
  mysqluser: [
    { required: true, message: '请输入MYSQL用户名', trigger: 'blur' }
  ],
  mysqlpassword: [
    { required: true, message: '请输入MYSQL密码', trigger: 'blur' }
  ],
  mysqldatabase: [
    { required: true, message: '请输入MYSQL数据库名称', trigger: 'blur' }
  ],
  corpname: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ]
})
const submitForm = async(formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      const mySqlIs = await electron.send('sql-link', ruleForm.mysqlhost + ',' + ruleForm.mysqluser + ',' + ruleForm.mysqlpassword + ',' + ruleForm.mysqlport + ',' + ruleForm.mysqldatabase)
      if (mySqlIs && mySqlIs.isNot) {
        ElMessage.success(mySqlIs.message)
      } else {
        ElMessage.error(mySqlIs.message)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
defineExpose({
  ruleFormRef,
  submitForm
})

</script>

<style scoped lang="scss">

</style>
