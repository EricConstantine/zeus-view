<template>
  <el-row class="searchForm" :gutter="20">
    <el-form :model="formInline" ref="formInlineRef" class="demo-form-inline" label-width="auto">
      <el-col :span="6">
        <el-form-item prop="timeInterval" label="创建时间：">
          <el-date-picker v-model="formInline.timeInterval" type="daterange" range-separator="至"
                          start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="projectName" label="项目名称：">
          <el-input v-model="formInline.projectName" clearable placeholder="请输入内容" />
        </el-form-item>
      </el-col>
      <el-col :span="6" :offset="6">
        <el-form-item>
          <el-button type="primary" @click="onSubmit">
            查询
          </el-button>
          <el-button @click="resetForm(formInlineRef)">
            重置
          </el-button>
        </el-form-item>
      </el-col>
    </el-form>
  </el-row>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'

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
  timeInterval: [],
  projectName: ''
})
const formInlineRef = ref<FormInstance>()
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  onSubmit()
}
const onSubmit = () => {
  props.on(formInline.timeInterval, formInline.projectName)
}

const router = useRouter()

</script>

<style scoped lang="scss">

.searchForm {
  width: 100%;
}

.demo-form-inline {
  width: 100%;
}
</style>
