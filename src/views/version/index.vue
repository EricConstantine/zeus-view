<template>
  <div class="version">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>版本</span>
          <el-button :icon="Plus" circle @click="add" />
        </div>
      </template>
      <el-pagination
        pagination="true"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="pageSizes"
        :pager-count="pagerCount"
        v-model:page-size="pageSize"
        v-model:current-page="currentPage"
        :total="total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in tableData">
          <el-card @click.stop.prevent="cardClick(item.versionid)" :shadow="item.currentVersion==1?'always':'hover'"
                   :class="{'grid-content': true,'grid-content-gl': item.currentVersion==1}"
          >
            <div>
              <h3 v-if="item.currentVersion==1">
                <i>V{{ item.verson }}</i>
              </h3>
              <h3 v-else>
                V{{ item.verson }}
              </h3>
              <p>时间：{{ item.createTime }}</p>
            </div>
            <!--            <el-button @click.stop.prevent="versionChange()">-->
            <!--              更新到此版本-->
            <!--            </el-button>-->
            <el-button type="danger" @click.stop.prevent="de(item.versionid)" :icon="Delete" circle />
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <version-foem ref="versionFoems" :dialogVisible="dialogVisible" :title="title" :form="form.form" :off="off"
                  :rules="rules"
                  :define="define" />
    <drawer-form ref="drawerForms" :drawer="drawer" :title="title" :form="form.form" :off="off"
                 :rules="rules"
                 :renew="renew" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import VersionFoem from '@/views/version/versionFoem.vue'
import { ElMessage, ElMessageBox, FormRules } from 'element-plus'
import DrawerForm from '@/views/version/drawerForm.vue'
import { versionsAdd, versionsDelete, versionsQuery, versionsUpdate, versionsView } from '@/api/version'
import { usePagination } from '@/hook/usePagination'
import { userDelete } from '@/api/user'

const {
  total,
  currentPage,
  pagerCount,
  pageSize,
  pageSizes,
  sizeChange,
  currentChange,
  tableData,
  dataChange
} = usePagination(async(current, size, dataList) => {
  const data = await versionsQuery({
    current,
    size,
    parameter: {}
  })
  if (data.code == 200) {
    const userList = data.data
    dataList.value = userList?.records
    total.value = userList.total
  } else {
    ElMessage.error('列表数据获取失败')
  }
})

const de = async(id) => {
  ElMessageBox.confirm('删除后无法恢复，请确认是否删除', '是否删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async() => {
      const use = await versionsDelete({ parameter: id })
      if (use.code == 200) {
        if (use.data) {
          dataChange()
          ElMessage.success(use.msg)
        }
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}

const drawer = ref<boolean>(false)
const add = () => {
  dialogVisible.value = true
  title.value = '新增'
  console.log(versionFoems.value)
  versionFoems.value.versionFormRef?.resetFields()
}

const dialogVisible = ref(false)
const title = ref('新增')
const form = reactive({
  form: {
    verson: '',
    remark: '',
    uploadType: 1,
    msg: '',
    winPath: '',
    fileList: []
  }
})
const rules = reactive<FormRules>({
  verson: [
    { required: true, message: '请输入版本号', trigger: 'blur' }
  ],
  remark: [
    { required: true, message: '请输入更新内容', trigger: 'blur' }
  ],
  fileList: [
    { required: true, message: '请上传文件', trigger: 'change' }
  ]
})
// 初始化组件实例
const versionFoems = ref<HTMLElement | null>(null)
const empty = () => {
  nextTick(() => {
    if (versionFoems.value) {
      versionFoems.value.versionFormRef?.resetFields()
    }
  })
}

const drawerForms = ref<HTMLElement | null>(null)
const drawerEmpty = () => {
  nextTick(() => {
    if (drawerForms.value) {
      drawerForms.value.drawerFormRef?.resetFields()
    }
  })
}

const cardClick = async(id) => {
  drawerEmpty()
  title.value = '详情'
  drawer.value = true
  const view = await versionsView({ parameter: { versionid: id } })
  if (view.code == 200 && view.data) {
    form.form.remark = view.data.remark
    form.form.verson = view.data.verson
    form.form.uploadType = view.data.uploadType
    form.form.winPath = view.data.winPath
    form.form.versionid = view.data.versionid
    form.form.fileList = [
      {
        name: view.data.fileName + '.' + view.data.fileType,
        url: view.data.winPath
      }
    ]
  }
}
const define = async() => {
  await versionFoems.value.versionFormRef.validate(async(valid, fields) => {
    if (valid) {
      console.log('submit!')
      console.log(valid, fields)
      const formData = new FormData()
      if (form.form.uploadType == 1) {
        formData.append('macFile', form.form.fileList[0].raw)
        formData.append('winFile', form.form.fileList[0].raw)
      }
      formData.append('current', currentPage.value)
      formData.append('size', pageSize.value)
      formData.append('remark', form.form.remark)
      formData.append('verson', form.form.verson)
      formData.append('uploadType', form.form.uploadType)
      formData.append('winPath', form.form.winPath)
      formData.append('macPath', form.form.winPath)
      const newData = await versionsAdd(formData)
      if (newData.code == 200 && newData.data == true) {
        off()
        dataChange()
        ElMessage({
          message: newData.msg,
          type: 'success'
        })
      } else {
        ElMessage({
          message: newData.msg,
          type: 'error'
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const renew = async() => {
  await drawerForms.value.drawerFormRef.validate(async(valid, fields) => {
    if (valid) {
      console.log('submit!')
      const formData = new FormData()
      if (form.form.fileList[0].raw) {
        formData.append('macFile', form.form.fileList[0].raw)
        formData.append('winFile', form.form.fileList[0].raw)
      }
      formData.append('versionid', form.form.versionid)
      formData.append('current', currentPage.value)
      formData.append('size', pageSize.value)
      formData.append('remark', form.form.remark)
      formData.append('verson', form.form.verson)
      const newData = await versionsUpdate(formData)
      if (newData.code == 200 && newData.data == true) {
        off()
        dataChange()
        ElMessage({
          message: newData.msg,
          type: 'success'
        })
      } else {
        ElMessage({
          message: newData.msg,
          type: 'error'
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 关闭
const off = () => {
  dialogVisible.value = false
  drawer.value = false
}

</script>

<style scoped lang="scss">
.box-card {
  margin: 10px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

}

.grid-content {
  cursor: pointer;
  //display: flex;
  border-radius: 4px;
  min-height: 36px;
  margin-top: 20px;

  p {
    color: #8c939d;
  }
}

.grid-content-gl {
  h3 {
    color: #409eff;
  }
}

</style>
