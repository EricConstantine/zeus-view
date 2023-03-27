<template>
  <div class="index-lists">
    <el-card class="!border-none" shadow="never">
      <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
        <el-form-item label="网页库标题" prop="webTitle">
          <el-input class="w-[280px]" v-model="queryParams.webTitle" />
        </el-form-item>
        <el-form-item label="网页库描述" prop="webDescribe">
          <el-input class="w-[280px]" v-model="queryParams.webDescribe" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPage">
            查询
          </el-button>
          <el-button @click="resetParams">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="!border-none mt-4 tabTop" shadow="never">
      <div>
        <el-button type="primary" @click="handleAdd()">
          <template #icon>
            <icon name="el-icon-Plus" />
          </template>
          新增
        </el-button>
      </div>
      <el-table
        class="mt-4"
        size="large"
        v-loading="pager.loading"
        :data="pager.lists"
      >
        <el-table-column type="index" label="序号" prop="id" width="60" />
        <el-table-column label="网页库标题" prop="webTitle" min-width="100" />
        <el-table-column label="网页库描述" prop="webDescribe" min-width="100" />
        <el-table-column label="网页库内容" prop="webContent" min-width="100" />
        <el-table-column label="是否公开" prop="ispublic">
          <template #default="scope">
            <div>{{ scope.row.ispublic == '1' ? '是' : '否' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="所属项目" prop="projectId" min-width="100">
          <template #default="scope">
            {{ getDictDb(scope.row.projectId) }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="100" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{row}">
            <div class="operation-btn">
              <el-button
                type="primary"
                link
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                link
                @click="handleDelete(row.id)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end mt-4">
        <pagination v-model="pager" @change="getLists" />
      </div>
    </el-card>
    <edit-popup
      :projectList="projectList"
      v-if="showEdit"
      ref="editRef"
      @success="getLists"
      @close="showEdit = false"
    />
  </div>
</template>
<script lang="ts" setup name="WebLibrary">
import Pagination from '@/components/pagination/index.vue'
import { nextTick, reactive, ref, shallowRef } from 'vue'
import { webLibraryDelete, webLibraryQuery } from '@/api/webLibrary'
import { usePaging } from '@/utils/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
import { getProjects } from '@/api/configure'
// import {getDictDb} from '@/utils/getDict'
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const queryParams = reactive({
  id: '',
  projectId: '',
  ispublic: '',
  webTitle: '',
  webDescribe: '',
  webContent: '',
  createTime: ''
})
interface project {
  label: string
  value: number
}
const { pager, getLists, resetPage, resetParams } = usePaging({
  fetchFun: webLibraryQuery,
  params: queryParams,
  size: 10
})

const handleAdd = async() => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('add')
}
const getDictDb = (val:number) => {
  const dictArr = projectList.value
  if (val && dictArr && dictArr.length > 0) {
    const temp = dictArr.filter((item:any) => item.value == val)
    if (temp.length == 1) {
      return temp[0].label
    }
  }
}

const handleEdit = async(data: any) => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('edit')
  editRef.value?.getDetail(data)
}

const handleDelete = async(id: number) => {
  await feedback.confirm('确定要删除？')
  await webLibraryDelete(id)
  feedback.msgSuccess('删除成功')
  getLists()
}
const projectList = ref<project[]>([])
const getProjectList = async() => {
  const newPro = await getProjects({ parameter: {} })
  console.log(newPro)
  if (newPro.code == 200 && newPro.data) {
    projectList.value = newPro.data
  }
}
getProjectList()
getLists()
</script>
