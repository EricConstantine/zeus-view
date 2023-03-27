<template>
  <div class="content">
    <el-card class="box-card">
      <el-button type="primary" @click="jsonFormatCheck">
        json格式校验
      </el-button>
      <el-button type="primary" @click="TextComparison">
        文本对比
      </el-button>
      <el-button type="primary" @click="formCreate">
        form表单生成
      </el-button>
      <el-button type="primary" @click="exceltosql">
        excel转sql
      </el-button>
    </el-card>
    <el-card class="box-card" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>网页库</span>
          <el-button :icon="Plus" circle @click="add" />
        </div>
      </template>
      <el-button type="primary" @click="webpage">
        百度
      </el-button>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTic } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, FormRules } from 'element-plus'

const router = useRouter()
const jsonFormatCheck = () => {
  router.push('/workBox/jsonFormatCheck')
}

const TextComparison = () => {
  router.push('/workBox/TextComparison')
}

const formCreate = () => {
  router.push('/workBox/formCreate')
}

const exceltosql = () => {
  router.push('/workBox/exceltosql')
}
const add = () => {
  alert('00')
}
const webpage = async() => {
  electron.open('https://www.baidu.com')
}
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
