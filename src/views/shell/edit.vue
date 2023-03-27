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
      <el-form ref="formRef" :model="formData" label-width="84px" :rules="formRules">
        <el-form-item label="脚本标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入脚本标题" />
        </el-form-item>
        <el-form-item label="脚本描述" prop="shellDescribe">
          <el-input v-model="formData.shellDescribe" placeholder="请输入脚本描述" />
        </el-form-item>
        <el-form-item label="IP" prop="shellIp">
          <el-input v-model="formData.shellIp" placeholder="请输入IP" />
        </el-form-item>
        <el-form-item label="端口号" prop="shellPort">
          <el-input v-model="formData.shellPort" placeholder="请输入端口号" />
        </el-form-item>
        <el-form-item label="用户名" prop="shellUsername">
          <el-input v-model="formData.shellUsername" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="shellPassword">
          <el-input type="password" v-model="formData.shellPassword" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="脚本内容" prop="shellContent">
          <el-input type="textarea" v-model="formData.shellContent" placeholder="请输入脚本内容" />
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { shellUpdate, shellAdd, shellView } from '@/api/shell'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import { shallowRef, ref, computed, reactive } from 'vue'
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
  return mode.value == 'edit' ? '编辑脚本管理' : '新增脚本管理'
})

const formData = reactive({
  id: '',
  userid: '',
  title: '',
  shellDescribe: '',
  shellIp: '',
  shellPort: '',
  shellUsername: '',
  shellPassword: '',
  shellContent: ''
})

const formRules = {
  userid: [
    {
      required: true,
      message: '请输入用户id',
      trigger: ['blur']
    }
  ],
  title: [
    {
      required: true,
      message: '请输入脚本标题',
      trigger: ['blur']
    }
  ],
  shellDescribe: [
    {
      required: true,
      message: '请输入脚本描述',
      trigger: ['blur']
    }
  ],
  shellIp: [
    {
      required: true,
      message: '请输入IP',
      trigger: ['blur']
    }
  ],
  shellPort: [
    {
      required: true,
      message: '请输入端口号',
      trigger: ['blur']
    }
  ],
  shellUsername: [
    {
      required: true,
      message: '请输入用户名',
      trigger: ['blur']
    }
  ],
  shellPassword: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['blur']
    }
  ],
  shellContent: [
    {
      required: true,
      message: '请输入脚本内容',
      trigger: ['blur']
    }
  ]
}

const handleSubmit = async() => {
  await formRef.value?.validate()
  const data: any = { ...formData }
  mode.value == 'edit' ? await shellUpdate(data) : await shellAdd(data)
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
  const res = await shellView({
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
