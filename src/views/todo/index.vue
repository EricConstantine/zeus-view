<template>
  <div class="index-lists">
    <el-card class="!border-none" shadow="never">
      <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
        <el-form-item label="标题" prop="title">
          <el-input class="w-[280px]" v-model="queryParams.title" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input class="w-[280px]" v-model="queryParams.content" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input class="w-[280px]" v-model="queryParams.content" />
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
        <el-table-column label="#" prop="id" min-width="100" />
        <el-table-column label="标题" prop="title" min-width="100" />
        <el-table-column label="内容" prop="content" min-width="100" />
        <el-table-column label="状态" prop="status" min-width="100" />
        <el-table-column label="时间" prop="createTime" min-width="100" />
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
      v-if="showEdit"
      ref="editRef"
      @success="getLists"
      @close="showEdit = false"
    />
  </div>
</template>
<script lang="ts" setup name="todo">
import Pagination from '@/components/pagination/index.vue'
import { nextTick, reactive, ref, shallowRef } from 'vue'
import { todoDelete, todoQuery } from '@/api/todo'
import { usePaging } from '@/utils/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)

const queryParams = reactive({
  createTimeStart: '',
  createTimeEnd: '',
  title: '',
  content: ''
})

const { pager, getLists, resetPage, resetParams } = usePaging({
  fetchFun: todoQuery,
  params: queryParams
})

const handleAdd = async() => {
  showEdit.value = true
  console.log(11)
  console.log(showEdit.value)
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
  await todoDelete(id)
  feedback.msgSuccess('删除成功')
  getLists()
}

getLists()
</script>
