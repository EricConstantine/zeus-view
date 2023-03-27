<template>
  <el-card class="box-card">
    <el-row :gutter="20" class="searchCon">
      <el-form :inline="true" :model="formInline" ref="searchConRef" class="demo-form-inline">
        <el-col :span="6">
          <el-form-item label="项目" prop="projectid">
            <el-select v-model="formInline.projectid" placeholder="请选择项目">
              <el-option label="全部" value="" />
              <el-option v-for="item in proList" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="配置名称" prop="name">
            <el-input v-model="formInline.name" placeholder="请输入配置名称" />
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="6">
          <el-form-item class="is-justify-end">
            <el-button type="primary" @click="onSubmit">
              搜索
            </el-button>
            <el-button type="primary" @click="resetForm(searchConRef)">
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
import { FormInstance } from 'element-plus'

interface Props {
  proList: object
  on: (id: number | string, name: string) => void
}

const props = withDefaults(defineProps<Props>(), {

  proList: () => {
    return []
  },
  on: () => {
    return () => {

    }
  }
})
const formInline = reactive({
  projectid: '',
  name: ''
})

const onSubmit = () => {
  props.on(formInline.projectid, formInline.name)
}

// 重置
const searchConRef = ref<FormInstance>()
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  onSubmit()
}
</script>

<style scoped lang="scss">
.box-card {
  margin: 10px;
}

.searchCon {
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
