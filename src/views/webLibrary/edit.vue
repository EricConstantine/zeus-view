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
      <el-form ref="formRef" :model="formData" label-width="100px" :rules="formRules">
        <el-form-item label="网页库标题" prop="webTitle">
          <el-input v-model="formData.webTitle" placeholder="请输入网页库标题" />
        </el-form-item>
        <el-form-item label="网页库描述" prop="webDescribe">
          <el-input v-model="formData.webDescribe" placeholder="请输入网页库描述" />
        </el-form-item>
        <el-form-item label="网页库内容" prop="webContent">
          <el-input v-model="formData.webContent" placeholder="请输入网页库内容" />
        </el-form-item>
        <el-form-item label="是否公开" prop="ispublic">
          <el-radio-group v-model="formData.ispublic">
            <el-radio label="0">
              否
            </el-radio>
            <el-radio label="1">
              是
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目ID" prop="projectId" v-if="formData.ispublic=='0'">
          <el-select v-model="formData.projectId" placeholder="请选择项目">
            <el-option v-for="item in projectList" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { webLibraryUpdate, webLibraryAdd, webLibraryView } from '@/api/webLibrary'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import { shallowRef, ref, computed, reactive } from 'vue'
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
  return mode.value == 'edit' ? '编辑网页库' : '新增网页库'
})
const props = withDefaults(defineProps<Props>(), {
  projectList: () => {
    return []
  }
})

interface Props {
  projectList: object
}

const formData = reactive({
  id: '',
  projectId: '',
  ispublic: '',
  webTitle: '',
  webDescribe: '',
  webContent: ''
})

const formRules = {
  id: [
    {
      required: true,
      message: '请输入网页库ID',
      trigger: ['blur']
    }
  ],
  projectId: [
    {
      required: true,
      message: '请输入项目ID',
      trigger: ['blur']
    }
  ],
  ispublic: [
    {
      required: true,
      message: '请输入是否公开',
      trigger: ['blur']
    }
  ],
  webTitle: [
    {
      required: true,
      message: '请输入网页库标题',
      trigger: ['blur']
    }
  ],
  webDescribe: [
    {
      required: true,
      message: '请输入网页库描述',
      trigger: ['blur']
    }
  ],
  webContent: [
    {
      required: true,
      message: '请输入网页库内容',
      trigger: ['blur']
    }
  ],
  createTime: [
    {
      required: true,
      message: '请输入创建时间',
      trigger: ['blur']
    }
  ]
}

const handleSubmit = async() => {
  await formRef.value?.validate()
  const data: any = { ...formData }
  mode.value == 'edit' ? await webLibraryUpdate(data) : await webLibraryAdd(data)
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
  const res = await webLibraryView({
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
