<template>
  <el-dialog class="sqlform" v-model="dialogVisible" :title="title" :close-on-click-modal="false" :before-close="noOff"
             width="60%" draggable>
    <el-scrollbar height="400px">
      <el-form :model="form" :rules="rules" label-width="200px" ref="sqlformRef">
        <el-form-item label="项目" prop="projectid">
          <el-select v-model="form.projectid" placeholder="请选择项目">
            <el-option v-for="item in proList" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="后台项目目录" prop="path">
          <el-input v-model="form.path" disabled>
            <template #append>
              <el-button @click="file" :icon="FolderOpened" :disabled="itemDie" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="form.name" :disabled="itemDie" />
        </el-form-item>
        <el-form-item label="配置描述" prop="configDescribe">
          <el-input v-model="form.configDescribe" type="textarea" :rows="5" :disabled="itemDie" />
        </el-form-item>

        <el-form-item label="类型" prop="dbtype">
          <el-radio-group v-model="form.dbtype" :disabled="itemDie" placeholder="类型">
            <el-radio :label="1">
              mysql
            </el-radio>
            <el-radio :label="2">
              oracle
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="form.dbtype==1?'MYSQL数据库IP地址：':'ORACLE数据库IP地址：'" prop="dbhost">
          <el-input v-model="form.dbhost" />
        </el-form-item>
        <el-form-item :label="form.dbtype==1?'MYSQL数据库端口：':'ORACLE数据库端口：'" prop="dbport">
          <el-input v-model="form.dbport" />
        </el-form-item>
        <el-form-item :label="form.dbtype==1?'MYSQL数据库用户名：':'ORACLE数据库用户名：'" prop="dbuser">
          <el-input v-model="form.dbuser" />
        </el-form-item>
        <el-form-item :label="form.dbtype==1?'MYSQL数据库密码：':'ORACLE数据库密码：'" prop="dbpassword">
          <el-input type="password" v-model="form.dbpassword" />
        </el-form-item>
        <el-form-item :label="form.dbtype==1?'MYSQL数据库名称：':'ORACLE数据库名称：'" prop="dbname">
          <el-input v-model="form.dbname" :placeholder="form.dbtype==1?'mysql数据库名称':'oracle数据库服务名如：orcl'" />
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox, FormRules, FormInstance } from 'element-plus'
import { FolderOpened } from '@element-plus/icons-vue'

import { configAdd, getProjects } from '@/api/configure'

interface Props {
  dialogVisible: boolean
  title: string
  on: object
  off: object
  form: object
  proList: object
  rules: object
}

const props = withDefaults(defineProps<Props>(), {
  dialogVisible: false,
  title: '',
  on: () => {
    return () => {
    }
  },
  off: () => {
    return () => {
    }
  },
  form: () => {
    return {}
  },
  proList: () => {
    return []
  },
  rules: () => {
    return {}
  }
})

// 控制是否可以输入
const itemDie = ref<boolean>(true)
watch(() => props.form.projectid, (newV) => {
  if (newV) {
    itemDie.value = false
  } else {
    itemDie.value = true
  }
})
// 获取目录
const file = async() => {
  const filePath = await electron.send('dialog:openFile', '')
  props.form.path = filePath
}

// 表格校验
const sqlformRef = ref<FormInstance>()
const sqlformRefSub = async(formEl: FormInstance | undefined) => {
  if (!sqlformRef.value) return
  return new Promise((resolve, reject) => {
    sqlformRef.value.validate((valid, fields) => {
      console.log('进入')
      if (valid) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!sqlformRef.value) return
  sqlformRef.value.resetFields()
}
const noOff = () => {
  props.off()
  // ElMessageBox.confirm(
  //   '取消后无法保存是否取消',
  //   '是否取消保存',
  //   {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning'
  //   }
  // )
  //   .then(() => {
  //     props.off()
  //     ElMessage({
  //       type: 'info',
  //       message: '取消保存'
  //     })
  //   })
  //   .catch(() => {
  //   })
}

defineExpose({
  resetForm,
  sqlformRefSub
})
</script>

<style scoped lang="scss">
.box-card {
  margin-bottom: 20px;
}
</style>
