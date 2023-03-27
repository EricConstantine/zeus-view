<template>
  <el-dialog v-model="dialogVisible" :title="title" :before-close="off" width="50%" draggable>
    <el-form :model="form" :rules="rules" label-width="120px" ref="versionFormRef">
      <el-form-item label="版本号" prop="verson">
        <el-input v-model="form.verson" />
      </el-form-item>
      <el-form-item label="备注" prop="msg">
        <el-input v-model="form.msg" />
      </el-form-item>
      <el-form-item label="更新内容" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="5" />
      </el-form-item>
      <el-form-item label="类型" prop="uploadType">
        <el-select v-model="form.uploadType" placeholder="请选择类型">
          <el-option label="线下文件" :value="1" />
          <el-option label="线上地址" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.uploadType==1" label="文件" prop="fileList">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="''"
          v-model:file-list="form.fileList"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :limit="1"
          accept=".zip"
          :auto-upload="false"
        >
          <el-button type="primary">
            文件上传
          </el-button>
          <!--          <template #trigger>-->
          <!--            -->
          <!--          </template>-->
          <!--          <el-button class="ml-3" type="success" @click="submitUpload">-->
          <!--            upload to server-->
          <!--          </el-button>-->
          <template #tip>
            <div class="el-upload__tip text-red">
              只能上传一个文件,类型.zip
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item v-else label="线上地址" prop="winPath">
        <el-input v-model="form.winPath" />
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
import { genFileId } from 'element-plus/es'
import type { FormInstance, FormRules, UploadProps, UploadInstance, UploadUserFile, UploadRawFile } from 'element-plus'

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
const versionFormRef = ref<FormInstance>()
defineExpose({
  versionFormRef
})
const fileList = ref<UploadUserFile[]>([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
  },
  {
    name: 'food2.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
  }
])
const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files: File[], uploadFiles: UploadUserFile[]) => {
  console.log(files, uploadFiles)
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  upload.value!.handleStart(file)
}

const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  props.form.fileList = uploadFiles
}
</script>

<style scoped lang="scss">

</style>
