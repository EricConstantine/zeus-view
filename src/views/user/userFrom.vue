<template>
  <el-dialog v-model="dialogVisible" :title="title" :before-close="off" width="40%" draggable>
    <el-form :model="form" :rules="rules" label-width="120px" ref="ruleFormRef">
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="类型">
          <el-option label="系统管理员" :value="1" />
          <el-option label="普通用户" :value="2" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="off">关闭</el-button>
        <el-button type="primary" @click="define">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, defineEmits } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  dialogVisible: Boolean
  title: String
  form: Object
  define: Function
  off: Function
  rules: FormRules
}

const props = withDefaults(defineProps<Props>(), {
  dialogVisible: false,
  title: '',
  form: () => {
    return {}
  },
  define: () => {
    return () => {
    }
  },
  off: () => {
    return () => {
    }
  },
  rules: () => {
    return () => {
    }
  }

})
const ruleFormRef = ref<FormInstance>()
defineExpose({
  ruleFormRef
})

</script>

<style scoped lang="scss">

</style>
