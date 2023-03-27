<template>
  <div class="content">
    <el-card class="box-card">
      <search-form :on="searchFormOn" />
    </el-card>
    <el-card class="box-card">
      <el-button :icon="Plus" circle @click="addProject" />
    </el-card>
    <el-card class="box-card">
      <el-table :data="tableData" height="300" max-height="500" style="width: 100%;">
        <el-table-column prop="projectName" label="项目名称" />
        <el-table-column prop="projectDescribe" label="项目描述" />
        <el-table-column prop="ispublic" label="是否公开">
          <template #default="scope">
            <div>{{ scope.row.ispublic == '1' ? '是' : '否' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="primary" :icon="Edit" circle @click="handleEdit(scope.row.id)" />
            <el-button
              size="small"
              type="danger"
              :icon="Delete" circle
              @click="handleDelete(scope.row.id)"
            />
            <el-button size="small" type="primary" :icon="CopyDocument" circle @click="handleCopy(scope.row.id)" />
          </template>
        </el-table-column>
      </el-table>
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
    </el-card>
  </div>
</template>

<script lang='ts' setup>
import { useRouter } from 'vue-router'
import { ref, reactive, watch, nextTick } from 'vue'
import { usePagination } from '@/hook/usePagination'
import { Edit, Delete, Timer, Plus, CopyDocument } from '@element-plus/icons-vue'
import { projectDelete, projectQuery, projectCopy } from '@/api/project'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action, FormInstance, FormRules } from 'element-plus'
import SearchForm from '@/views/project/components/searchForm.vue'

const router = useRouter()
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
  const data = await projectQuery({
    current,
    size,
    parameter: {}
  })
  if (data.code == 200) {
    const projectList = data.data
    dataList.value = projectList?.records
    total.value = projectList.total
  } else {
    ElMessage.error('列表数据获取失败')
  }
})
// 新增
const addProject = () => {
  router.push('/project/add')
}
// 搜索
const searchFormOn = async(timeInterval, projectName) => {
  const data = await projectQuery({
    current: currentPage.value,
    size: pageSize.value,
    parameter: {
      timeInterval,
      projectName
    }
  })
  if (data.code == 200) {
    const projectList = data.data
    tableData.value = projectList?.records
    total.value = projectList.total
  } else {
    ElMessage.error('列表数据获取失败')
  }
}
// 编辑
const handleEdit = async(id) => {
  router.push('/project/add?id=' + id)
}
// 复制
const handleCopy = async(id) => {
  const data = await projectCopy({
    parameter: {
      id
    }
  })
  if (data.code == 200) {
    ElMessage.success(data.msg)
    searchFormOn()
  } else {
    ElMessage.error('列表数据复制失败')
  }
}
// 删除
const handleDelete = async(id) => {
  ElMessageBox.confirm('删除后无法恢复，请确认是否删除', '是否删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async() => {
      const use = await projectDelete({ parameter: id })
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

<style lang="scss">
.box-card {
  margin-bottom: 20px;
}

.el-pagination {
  justify-content: end;
  margin: 0 5px;
}
</style>
