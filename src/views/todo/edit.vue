<template>
  <div class="edit-popup">
    <popup
      ref="popupRef"
      :title="popupTitle"
      :async="true"
      width="550px"
      :clickModalClose="true"
      @confirm="handleSubmit"
      @close="handleClose"
    >
      <el-form ref="formRef" :model="formData" label-width="84px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="formData.content" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态" prop="title">
          <el-input v-model="formData.status" placeholder="请输入状态" />
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import { shallowRef, ref, computed, reactive } from 'vue'
import { todoView, todoAdd, todoUpdate } from '@/api/todo'
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
  return mode.value == 'edit' ? '编辑待办' : '新增待办'
})

const formData = reactive({
  id: '',
  title: '',
  content: '',
  status: '',
  userid: ''
})

const formRules = {
}

const handleSubmit = async() => {
  await formRef.value?.validate()
  const data: any = { ...formData }
  mode.value == 'edit' ? await todoUpdate(data) : await todoAdd(data)
  popupRef.value?.close()
  feedback.msgSuccess('操作成功')
  emit('success')
}

const open = (type = 'add') => {
  mode.value = type
  popupRef.value?.open()
}

const setFormData = async(data: Record<string, any>) => {
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      // @ts-ignore
      formData[key] = data[key]
    }
  }
}

const getDetail = async(row: Record<string, any>) => {
  const res = await todoView({
    id: row.id
  })
  setFormData(res.data)
}

const handleClose = () => {
  emit('close')
}

defineExpose({
  open,
  setFormData,
  getDetail
})
</script>
