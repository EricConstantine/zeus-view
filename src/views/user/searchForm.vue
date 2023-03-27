<template>
  <el-card class="box-card">
    <el-row :gutter="20" class="searchForm">
      <el-form :inline="true" :model="formInline" ref="formInlineRef" class="demo-form-inline">
        <el-col :span="6">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="formInline.username" placeholder="请输入用户名" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户类型" prop="type">
            <el-select v-model="formInline.type" placeholder="请选择类型">
              <el-option label="全部" value="" />
              <el-option label="系统管理员" :value="1" />
              <el-option label="普通用户" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="6">
          <el-form-item class="is-justify-end">
            <el-button type="primary" @click="onSubmit">
              搜索
            </el-button>
            <el-button type="primary" @click="resetForm(formInlineRef)">
              重置
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'

interface Props {
  on: Function
}

const props = withDefaults(defineProps<Props>(), {
  on: () => {
    return () => {
    }
  }
})
const formInline = reactive({
  username: '',
  type: ''
})
const formInlineRef = ref<FormInstance>()
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  onSubmit()
}
const onSubmit = () => {
  props.on(formInline.username, formInline.type)
}

</script>

<style scoped lang="scss">
.box-card {
  margin: 10px;
}

.searchForm {
  width: 100%;
}

.demo-form-inline {
  width: 100%;
}

.el-col {
  width: 100%;
}

.is-justify-end {
  width: 100%;

  :deep(.el-form-item__content) {
    justify-content: end;
  }
}
</style>
