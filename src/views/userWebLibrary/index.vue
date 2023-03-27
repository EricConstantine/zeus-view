<template>
  <div class="index-lists">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item,index) in pager.lists" :key="index">
        <el-card
          @click="goToWeb(item.webContent)"
          class="!border-none mt-4 tabTop" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ item.webTitle }}</span>
            </div>
          </template>
          {{ item.webDescribe }}
        </el-card>
      </el-col>
    </el-row>
    <div class="flex justify-end mt-4">
      <pagination v-model="pager" :pageSizes="pageSizes" @change="getLists" />
    </div>
  </div>
</template>
<script lang="ts" setup name="WebLibrary">
import Pagination from '@/components/pagination/index.vue'
import { reactive, ref } from 'vue'
import { webLibraryUserQuery } from '@/api/webLibrary'
import { usePaging } from '@/utils/usePaging'
import { getProjects } from '@/api/configure'
const pageSizes = ref([8, 16, 32, 64])
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
  fetchFun: webLibraryUserQuery,
  params: queryParams,
  size: 8
})
const getDictDb = (val:number) => {
  const dictArr = projectList.value
  if (val && dictArr && dictArr.length > 0) {
    const temp = dictArr.filter((item:any) => item.value == val)
    if (temp.length == 1) {
      return temp[0].label
    }
  }
}
const goToWeb = (url:string) => {
  window.open(url, '_blank')
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
