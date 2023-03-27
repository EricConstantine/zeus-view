<template>
  <div class="code">
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-form :model="formInline">
          <el-col :span="6">
            <el-form-item label="配置名称" prop="projectid">
              <el-select v-model="formInline.projectid" @change="proListChange" filterable placeholder="请选择配置名称">
                <el-option v-for="item in proList" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="表名" prop="name">
              <el-select v-model="formInline.name" @change="tableListChange" filterable :disabled="tableIs" placeholder="请选择表名">
                <el-option v-for="item in tableList" :label="item.tablename+' - '+item.comments"
                           :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="6">
            <el-form-item class="is-justify-end">
              <el-button type="primary" @click="onSubmit" :disabled="sqlDictList.length===0">
                生成
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-card>
    <el-card class="box-card flex">
      <el-link type="primary" :underline="false" @click.stop.prevent="details" :disabled="sqlDictList.length===0">
        高级设置
      </el-link>
      <transition name="el-zoom-in-top">
        <el-link v-show="path" type="info" :underline="false">
          {{ path }}
        </el-link>
      </transition>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>数据表</span>
        </div>
      </template>
      <el-scrollbar height="450px">
        <sql-dict :dictList="sqlDictList" />
      </el-scrollbar>
    </el-card>
    <configure :dialogVisible="dialogVisible" :treeid="nodeKeyCheckedChange" :noOff="off" :title="title"
               :dataSource="dataSource"
               :dictList="dictList" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { getConfigs, getProjectDetail, makeCode } from '@/api/code'
import TwoElTree from '@/views/code-download/twoElTree.vue'
import { ElMessage } from 'element-plus/es'
import Dict from '@/views/code-download/dict.vue'
import { decryptByDES } from '@/utils/3DES';
import { hex_md5  } from '@/utils/MD5';
import SqlDict from '@/views/code-download/sqlDict.vue'
import Configure from '@/views/code-download/configure.vue'
import { codeDownload } from '@/utils/download'
import { store } from '@/store'

const formInline = reactive({
  projectid: '',
  name: '',
  comments: ''
})
const proList = ref([])
const init = async() => {
  const newResult = await getConfigs()
  if (newResult.code === 200 && newResult.data) {
    proList.value = newResult.data
  }
}
init()

// 配置详情
const dataSource = ref([])// 文件树
const tableList = ref([])
const tableIs = ref(true)
const dictList = ref([])// 字典数据
const path = ref('')
const config = ref({})
const proListChange = async(val) => {
  dataSource.value = []
  dictList.value = []
  path.value = ''
  config.value = {}
  tableIs.value = true
  formInline.name = ''
  formInline.comments = ''
  sqlDictList.value = []
  const newResult = await getProjectDetail({ parameter: { id: formInline.projectid } })
  if (newResult.code === 200 && newResult.data) {
    dataSource.value = newResult.data.zonetree
    const dictData = newResult.data.dictionarys
    for (let i = 0; i < dictData.length; i++) {
      if (dictData[i].types == 2) {
        if (dictData[i].listContent) {
          dictData[i].arrList = JSON.parse(dictData[i].listContent)
        }
        dictData[i].choseList = dictData[i].dictionaryValue?.split(',')
      }
    }
    dictList.value = dictData// 字典表
    path.value = newResult.data.config.path
    config.value = Object.assign(config.value, newResult.data.config)
    let sk = (hex_md5(store.state.user.account+process.env.VUE_APP_SALT)).substring(0,24)
    const sqlList = await electron.send('sql-list', {
      host: config.value.dbhost,
      user: decryptByDES(config.value.dbuser,sk) ,
      password: decryptByDES(config.value.dbpassword,sk),
      port: config.value.dbport,
      database: config.value.dbname,
      dbtype: config.value.dbtype
    })
    if (sqlList && sqlList.isNot) {
      tableIs.value = false
      tableList.value = sqlList.data
      ElMessage.success(sqlList.message)
    } else {
      tableIs.value = true
      ElMessage.error(sqlList.message)
    }
  }
}

// 打开配置
const dialogVisible = ref(false)
const title = ref('')
const details = () => {
  if (sqlDictList.value.length > 0) {
    dialogVisible.value = true
    title.value = '高级设置'
  } else {
    ElMessage.error('请先选择配置和选择表')
  }
}
// 关闭配置
const off = () => {
  dialogVisible.value = false
}
// 保存配置
const onSub = () => {

}
// 获取数据字段
const sqlDictList = ref([])
const tableListChange = async(val) => {
  console.log(val)
  formInline.name = val.tablename
  formInline.comments = val.comments
  sqlDictList.value = []
  let sk = (hex_md5(store.state.user.account+process.env.VUE_APP_SALT)).substring(0,24)
  const sqlList = await electron.send('sql-module', {
    host: config.value.dbhost,
    user: decryptByDES(config.value.dbuser,sk),
    password: decryptByDES(config.value.dbpassword,sk),
    port: config.value.dbport,
    database: config.value.dbname,
    dbtype: config.value.dbtype,
    modelname: formInline.name
  })
  if (sqlList && sqlList.isNot) {
    // tableIs.value = false
    sqlDictList.value = sqlList.data
    // 给高级设置赋值
    const dictData = dictList.value
    for (let i = 0; i < dictData.length; i++) {
      if (dictData[i].types === 3) {
        dictData[i].arrList = sqlList.data
        dictData[i].choseList = []
      }
    }
    dictList.value = dictData
    ElMessage.success(sqlList.message)
  } else {
    tableIs.value = true
    ElMessage.error(sqlList.message)
  }
}
// 代码生成
const treeid = (value) => {
  console.log('treeid', value)
}
const aa = ref(0)
const onSubmit = async() => {
  const param = new FormData()
  param.append('configId', formInline.projectid + '')
  param.append('treeids', treeKey.value.join(','))
  param.append('dbTable', formInline.name)
  // 数据库类型
  param.append('dbType', config.value.dbtype)
  param.append('dbTableName', formInline.comments)
  param.append('columnJson', JSON.stringify(sqlDictList.value))
  const data = dictList.value
  for (let i = 0; i < data.length; i++) {
    if (data[i].types != 1) {
      data[i].dictionaryValue = data[i].choseList?.join(',')
    }
  }
  param.append('dictionarys', JSON.stringify(data))
  const newUrl = await makeCode(param)
  if (newUrl.code == 200 && newUrl.data) {
    aa.value++
    console.log('formInline', newUrl)
    console.log(`第${aa.value}次运行`)
    let url: any = null
    if (localStorage.getItem('serverip') && localStorage.getItem('serverport')) {
      url = localStorage.getItem('serverip') + ':' + localStorage.getItem('serverport')
    } else {
      url = process.env.VUE_APP_BASE_API
    }
    codeDownload(path.value, url + '/' + newUrl.data)
  }
}
const treeKey = ref([])
const nodeKeyChecked = (value, nodeList: any[]) => {
  nodeList.forEach(item => {
    if (item.type && item.type == '2') {
      value.value.push(item.id)
    }
    if (item.child && item.child.length > 0) {
      return nodeKeyChecked(value, item.child)
    }
  })
  return value
}

watch(dataSource, (newV) => {
  if (newV) {
    // console.log(newV)
    treeKey.value = []
    nodeKeyChecked(treeKey, newV)
  }
}, {
  deep: true,
  immediate: true
})
const nodeKeyCheckedChange = (data: object,
  checked: boolean,
  indeterminate: boolean) => {
  console.log(treeKey.value)
  if (checked && data.type == '2') {
    const index = treeKey.value.findIndex(item => item === data.id)
    if (index == -1) {
      treeKey.value.push(data.id)
    }
  }
  if (checked == false && data.type == '2') {
    const index = treeKey.value.findIndex(item => item === data.id)
    if (index != -1) {
      treeKey.value.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="scss">
.box-card {
  margin: 10px;
}

.el-form {
  width: 100%;

  .is-justify-end {

    :deep(.el-form-item__content) {
      justify-content: end;
    }
  }
}

.el-col {
  width: 100%;
}

.flex {
  :deep(.el-card__body) {
    display: flex;
    justify-content: space-between;
  }

}

</style>
