<template>
  <div class="configure">
    <search-con :proList="proList" :on="onSubmit" />
    <el-card class="box-card">
      <el-button :icon="Plus" circle @click="add" />
    </el-card>
    <el-card class="box-card">
      <el-table :data="tableData" height="300" max-height="500" style="width: 100%;">
        <el-table-column prop="name" label="配置名称" width="180" />
        <el-table-column prop="projectName" label="项目" width="180" />
        <el-table-column prop="dbtype" label="类型">
          <template #default="scope">
            <el-tag>{{ scope.row.dbtype === 1 ? 'mysql' : 'oracle' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button size="small" type="warning" :icon="Share" circle @click="shareLink(scope.row)" />
            <el-button size="small" type="primary" :icon="Edit" circle @click="handleEdit(scope.row.id)" />
            <el-button
              size="small"
              type="danger"
              :icon="Delete" circle
              @click="handleDelete(scope.row.id)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
    <sqlform ref="sqlRef" :dialogVisible="dialogVisible" :form="form.form" :proList="proList" :rules="rules"
             :edit="edit" :title="title"
             :off="off" :on="onSub">
      <template #center>
        <!--<dbForm ref="dbRef" :form="sqlformdata.form" :rules="sqlformrules" :footer="footer" />-->
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="off">取消</el-button>
          <el-button @click="link">测试数据库链接</el-button>
          <el-button type="primary" @click="onSub()">保存配置</el-button>
        </span>
      </template>
    </sqlform>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { Plus, Edit, Delete, Share } from '@element-plus/icons-vue'
import Sqlform from '@/views/configure/sqlform.vue'
import { configAdd, configDelete, configQuery, configView, getProjects } from '@/api/configure'
import { usePagination } from '@/hook/usePagination'
import { userDelete, userQuery } from '@/api/user'
import { ElMessage, FormRules, FormInstance, ElMessageBox } from 'element-plus/es'
import dbForm from './dbForm'
import { useDelete } from '@/hook/useDelete'
import SearchCon from '@/views/configure/searchCon.vue'
import { decryptByDES } from '@/utils/3DES';
import { hex_md5  } from '@/utils/MD5';
import { store } from '@/store'
const form = reactive({
  form: {
    projectid: '',
    configDescribe: '',
    name: '',
    path: '',
    dbtype: 1,
    dbhost: '', // 数据库地址
    dbname: '', // 数据库名称
    dbport: '', // 端口
    dbuser: '', // 数据库用户名
    dbpassword: ''// 数据库密码
  }
})
const rules = reactive<FormRules>({
  projectid: [
    { required: true, message: '请选择项目', trigger: 'change' }
  ],
  path: [
    { required: true, message: '请输入文件路径', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入配置名称', trigger: 'blur' }
  ],
  dbtype: [
    {
      required: true,
      message: '请选择类型',
      trigger: 'change'
    }
  ],
  dbhost: [
    { required: true, message: '请输入MYSQL服务器IP地址', trigger: 'blur' }
  ],
  dbport: [
    { required: true, message: '请输入MYSQL端口', trigger: 'blur' }
  ],
  dbuser: [
    { required: true, message: '请输入MYSQL用户名', trigger: 'blur' }
  ],
  dbpassword: [
    { required: true, message: '请输入MYSQL密码', trigger: 'blur' }
  ],
  dbname: [
    { required: true, message: '请输入MYSQL数据库名称', trigger: 'blur' }
  ]
})

const dialogVisible = ref<boolean>(false)
const title = ref<string>('')
const sqlRef = ref<HTMLElement | null>(null)
const footer = ref<boolean>(false)

// 获取去下拉框
interface proListInt {
  label: string
  value: number
}

const proList = ref<proListInt[]>([])
const getpro = async() => {
  const newPro = await getProjects({ parameter: {} })
  console.log(newPro)
  if (newPro.code == 200 && newPro.data) {
    proList.value = newPro.data
  }
}
getpro()
// 搜索
const onSubmit = async(projectid, name) => {
  const data = await configQuery({
    current: currentPage.value,
    size: pageSize.value,
    parameter: {
      projectid,
      name
    }
  })
  if (data.code == 200) {
    const userList = data.data
    tableData.value = userList?.records
    total.value = userList.total
  } else {
    ElMessage.error('列表数据获取失败')
  }
}

const add = () => {
  pageType.value = 1
  dialogVisible.value = true
  title.value = '新增'
  sqlRef.value?.resetForm()
}
const pageType = ref<number>(1) // 1新增 2编辑
// 关闭
const off = () => {
  dialogVisible.value = false
}

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
  const data = await configQuery({
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
// 保存
const onSub = async() => {
  const newSqlformRef = await sqlRef.value.sqlformRefSub()
  if (newSqlformRef) {
    let url = ''
    if (pageType.value == 1) {
      url = 'add'
    } else if (pageType.value == 2) {
      url = 'update'
    }
    const newResult = await configAdd(url, { parameter: { ...form.form } })
    console.log(newResult)
    if (newResult.code == 200 && newResult.data) {
      off()
      dataChange()
      ElMessage.success(newResult.msg)
    } else {
      ElMessage.error(newResult.msg)
    }
  } else {
    ElMessage.error('请完善表单信息')
  }
}
// 数据库链接
const link = async() => {
  const newSqlformRef = await sqlRef.value.sqlformRefSub()
  if (newSqlformRef) {
    console.log('sqlformdata.form')
    console.log(form.form)
    const mySqlIs = await electron.send('sql-link', form.form.dbhost + ',' + form.form.dbuser + ',' + form.form.dbpassword + ',' + form.form.dbport + ',' + form.form.dbname + ',' + form.form.dbtype)
    if (mySqlIs && mySqlIs.isNot) {
      ElMessage.success(mySqlIs.message)
    } else {
      ElMessage.error(mySqlIs.message)
    }
  } else {
    ElMessage.error('请完善表单信息')
  }
}
// 链接数据库
const shareLink = async(row) => {
  if (row) {
    let sk = (hex_md5(store.state.user.account+process.env.VUE_APP_SALT)).substring(0,24)
    const connResult = await electron.send('sql-link', row.dbhost + ',' +  decryptByDES(row.dbuser,sk) + ',' + decryptByDES(row.dbpassword,sk)+ ',' + row.dbport + ',' + row.dbname + ',' + row.dbtype)
    if (connResult && connResult.isNot) {
      ElMessage.success(connResult.message)
    } else {
      ElMessage.error(connResult.message)
    }
  }
}
// 详情
const handleEdit = async(id) => {
  pageType.value = 2
  dialogVisible.value = true
  title.value = '详情'
  const newResult = await configView({ parameter: id })
  console.log(newResult)
  if (newResult.code == 200 && newResult.data) {
    const {
      configDescribe,
      createTime,
      dbhost,
      dbname,
      dbpassword,
      dbport,
      dbtype,
      dbuser,
      id,
      name,
      path,
      projectName,
      projectid,
      userid
    } = newResult.data
    form.form = Object.assign(form.form, { projectid, configDescribe, name, path, dbtype, id, dbhost, dbname, dbport })
    form.form.dbuser = '';
    form.form.dbpassword = '';
    // sqlformdata.form = Object.assign(sqlformdata.form, { dbhost, dbname, dbport, dbuser, dbpassword })
  } else {
    ElMessage.error('获取详情失败')
  }
}
// 删除
const handleDelete = async(id) => {
  useDelete({ init: dataChange, url: configDelete, id })
}

</script>

<style scoped lang="scss">
.box-card {
  margin: 10px;
}

.el-pagination {
  justify-content: end;
  margin: 0 5px;
}
</style>
