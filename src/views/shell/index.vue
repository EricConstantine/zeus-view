<template>
  <div class="index-lists">
    <el-card class="!border-none" shadow="never">
      <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
        <el-form-item label="脚本标题" prop="title">
          <el-input class="w-[280px]" v-model="queryParams.title" />
        </el-form-item>
        <el-form-item label="脚本描述" prop="shellDescribe">
          <el-input class="w-[280px]" v-model="queryParams.shellDescribe" />
        </el-form-item>
        <el-form-item label="IP" prop="shellIp">
          <el-input class="w-[280px]" v-model="queryParams.shellIp" />
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
        <el-table-column label="脚本标题" prop="title" min-width="100" />
        <el-table-column label="脚本描述" prop="shellDescribe" min-width="100" />
        <el-table-column label="IP" prop="shellIp" min-width="100" />
        <el-table-column label="脚本内容" prop="shellContent" min-width="100" />
        <el-table-column label="创建时间" prop="createTime" min-width="100" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{row}">
            <div class="operation-btn">
              <el-button
                type="success"
                link
                @click="handleExcuete(row.id)"
              >
                执行
              </el-button>
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
      v-if="showEdit"
      ref="editRef"
      @success="getLists"
      @close="showEdit = false"
    />
    <el-dialog title="执行结果" v-model="resultDialog.show">
      <div style="height: 350px;padding-bottom: 20px;overflow-y: auto">
        <el-result :icon="resultDialog.type" :title="resultDialog.title" subTitle="点击按钮，关闭结果">
          <template #extra>
            <el-button type="primary" size="medium" @click="resultDialog.show=false">
              关闭
            </el-button>
          </template>
        </el-result>
        <div v-loading="resultDialog.loading">
          <div v-html="resultDialog.content" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="Shell">
import Pagination from '@/components/pagination/index.vue'
import { nextTick, reactive, ref, shallowRef } from 'vue'
import { shellDelete, shellQuery, shellExcuete } from '@/api/shell'
import { usePaging } from '@/utils/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const resultDialog = ref({ show: false, title: '', content: '', type: 'error', loading: false })
const queryParams = reactive({
  id: '',
  userid: '',
  title: '',
  shellDescribe: '',
  shellIp: '',
  shellPort: '',
  shellUsername: '',
  shellPassword: '',
  shellContent: '',
  createTime: ''
})

const { pager, getLists, resetPage, resetParams } = usePaging({
  fetchFun: shellQuery,
  params: queryParams
})

const handleAdd = async() => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('add')
}

const handleEdit = async(data: any) => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('edit')
  editRef.value?.getDetail(data)
}

const handleDelete = async(id: number) => {
  await feedback.confirm('确定要删除？')
  await shellDelete(id)
  feedback.msgSuccess('删除成功')
  getLists()
}
const handleExcuete = async(id: number) => {
  await feedback.confirm('确定要执行此脚本吗？')
  resultDialog.value.show = true
  resultDialog.value.type = 'warning'
  resultDialog.value.loading = true
  resultDialog.value.content = ''
  resultDialog.value.title = '正在执行脚本，请稍后~'
  const res = await shellExcuete(id)
  console.log('res', res)
  resultDialog.value.title = res.data.msg
  if (res.data.flag) {
    resultDialog.value.loading = false
    feedback.msgSuccess(res.data.msg)
    resultDialog.value.type = 'success'
    resultDialog.value.content = 'success'
    const reg = new RegExp('\r\n', 'g')
    resultDialog.value.content = res.data.data.replaceAll(reg, '<br/>')
  } else {
    resultDialog.value.type = 'error'
    feedback.msgError(res.data.msg)
  }

  // getLists()
}

getLists()
</script>
