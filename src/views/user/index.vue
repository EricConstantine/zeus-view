<template>
  <div class="user">
    <search-form :on="searchFormOn" />
    <el-card class="box-card">
      <el-button :icon="Plus" circle @click="add" />
    </el-card>

    <el-card class="box-card">
      <el-table :data="tableData" height="300" max-height="500" style="width: 100%;">
        <el-table-column prop="username" label="账号" width="180" />
        <el-table-column prop="nickname" label="昵称" width="180" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="phone" label="手机号" />
        <!--<el-table-column prop="picture" label="头像"/>-->
        <el-table-column prop="type" label="类型">
          <template #default="scope">
            <el-tag style="width: 50px">
              {{ scope.row.type === 1 ? '系统管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
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
    <user-from
      ref="userFromRef"
      v-model:dialogVisible="dialogVisible"
      :title="title"
      :form="form.form"
      :rules="rules"
      :off="off"
      :define="define"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { usePagination } from '@/hook/usePagination'
import { Edit, Delete, Timer, Plus } from '@element-plus/icons-vue'
import { userAdd, userDelete, userQuery, userUpdate, userView } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action, FormInstance, FormRules } from 'element-plus'
import UserFrom from '@/views/user/userFrom.vue'
import SearchForm from '@/views/user/searchForm.vue'

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
  const data = await userQuery({
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

// 搜索
const searchFormOn = async(username, type) => {
  const data = await userQuery({
    current: currentPage.value,
    size: pageSize.value,
    parameter: {
      username,
      type
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

const dialogVisible = ref(false)
const formNum = ref(0)
const title = ref('')
const form = reactive({
  form: {
    email: '',			// 邮箱
    nickname: '',			// 昵称
    phone: '',			// 手机号
    password: '', // 密码
    picture: '',			// 头像
    type: '',				// 类型（1系统管理员2普通用户）
    userid: '',			// 用户id
    username: '',			// 账号
    nickname: ''			// 昵称
  }
})
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 6, message: '密码为3至6位', trigger: 'blur' }
  ],
  type: [
    {
      required: true,
      message: '请选择类型',
      trigger: 'change'
    }
  ]
})
// 关闭
const off = () => {
  dialogVisible.value = false
}
// 更新保存
const define = async() => {
  if (formNum.value == 1) {
    await userFromRef.value.ruleFormRef.validate(async(valid, fields) => {
      if (valid) {
        console.log('submit!')
        const use = await userAdd({ parameter: { ...form.form } })
        if (use.code == 200) {
          if (use.data) {
            dialogVisible.value = false
            dataChange()
            ElMessage.success(use.msg)
          }
        }
      } else {
        console.log('error submit!', fields)
      }
    })
  } else {
    const update = await userUpdate({ parameter: { ...form.form } })
    if (update.code == 200) {
      if (update.data) {
        dialogVisible.value = false
        dataChange()
        ElMessage.success(update.msg)
      }
    }
  }
}
// 初始化组件实例
const userFromRef = ref<HTMLElement | null>(null)
const empty = () => {
  nextTick(() => {
    if (userFromRef.value) {
      userFromRef.value.ruleFormRef.resetFields()
    }
  })
}

// 新增
const add = async() => {
  dialogVisible.value = true
  title.value = '新增'
  formNum.value = 1
  empty()
}
// 编辑
const handleEdit = async(id) => {
  dialogVisible.value = true
  title.value = '编辑'
  formNum.value = 2
  empty()
  const use = await userView({ parameter: { id } })
  form.form = use?.data
  form.form.password = ''
}
// 删除
const handleDelete = async(id) => {
  ElMessageBox.confirm('删除后无法恢复，请确认是否删除', '是否删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async() => {
      const use = await userDelete({ parameter: id })
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
