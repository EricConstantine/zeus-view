<template>
  <el-dialog class="fileFrom" v-model="dialogVisible" :title="title" :before-close="off" width="50%" draggable>
    <el-form :model="fileForm" :rules="fileRules" label-width="120px" ref="fileFormRef">
      <el-form-item label="名称" prop="name">
        <el-input v-model="fileForm.name" @keyup.enter.native="save" />
      </el-form-item>
      <el-form-item label="类型" prop="type" v-if="addType">
        <el-radio-group v-model="fileForm.type">
          <el-radio label="1">
            文件夹
          </el-radio>
          <el-radio label="2">
            文件
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="off">关闭</el-button>
        <el-button type="primary" @click="save">
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
  fileForm: Object
  save: Function
  off: Function
  fileRules: FormRules
  addType: Boolean
}

const props = withDefaults(defineProps<Props>(), {
  dialogVisible: false,
  title: '',
  addType: true,
  fileForm: () => {
    return {}
  },
  save: () => {
    return () => {
    }
  },
  off: () => {
    return () => {
    }
  },
  fileRules: () => {
    return () => {
    }
  }

})
const fileFormRef = ref<FormInstance>()
defineExpose({
  fileFormRef
})
</script>

<style scoped lang="scss">
  .searchForm {
    width: 100%;
  }

  .demo-form-inline {
    width: 100%;
  }
</style>
