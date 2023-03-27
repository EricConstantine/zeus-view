<template>
  <el-drawer v-model="drawer" :title="title" size="50%" :before-close="handleClose">
    <el-form :model="form" :rules="rules" label-width="120px" ref="drawerFormRef">
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
      <el-form-item>
        <span class="dialog-footer">
          <el-button type="primary" @click="renew">
            更新
          </el-button>
        </span>
      </el-form-item>
    </el-form>
    <!--    <el-button>更新到此版本</el-button>-->
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, defineEmits } from 'vue'
import { FormInstance, FormRules, UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus/es'

interface Props {
  drawer: Boolean
  title: String
  form: Object
  renew: Function
  off: Function
  rules: FormRules
}

const props = withDefaults(defineProps<Props>(), {
  drawer: false,
  title: '',
  form: () => {
    return {}
  },
  renew: () => {
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
const handleClose = (done: () => void) => {
  props.off()
  done()
}
const drawerFormRef = ref<FormInstance>()
defineExpose({
  drawerFormRef
})
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
