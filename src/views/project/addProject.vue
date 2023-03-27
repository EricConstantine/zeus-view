<template>
  <div class="content" @click.native="OptionCardClose">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="项目信息" name="proInfo" :disabled="step==1&&query.id==undefined?true:false">
        <project-form ref="projectFromRef" :ruleForm="ruleForm.form" :rules="rules" :define="define" :addList="addList"
                      :addArrList="addArrList" :delArrList="delArrList"
                      :choseArrCheck="choseArrCheck"
                      :delList="delList" :userList="userList" :id="query.id" />
      </el-tab-pane>
      <el-tab-pane label="模板信息" name="tmpInfo" :disabled="step==0&&query.id==undefined?true:false" class="model-info">
        <div class="addCode">
          <el-popover placement="right" :width="450" trigger="click" :visible="visible">
            <template #reference>
              <el-button type="warning" style="margin-right: 16px" @click="visible = !visible">
                字典信息
              </el-button>
            </template>
            <el-table :data="gridData" row-key="id" :height="300">
              <el-table-column width="150" property="key" label="字典值（key）">
                <template #default="scope">
                  <el-tag @click="handleCopy(scope.row.key,$event)">
                    {{ scope.row.key }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column width="180" property="keyName" label="字典释义">
                <template #default="scope">
                  <el-popover effect="light" :trigger="scope.row.popover?'hover':''" placement="bottom" width="auto">
                    <template #default v-if="scope.row.popover">
                      <div>
                        {{ scope.row.popover == 1 ? '字段类型转JAVA类型规则:' : '字段类型转XML类型规则:' }}
                        <p v-for="item in scope.row.popover==1?JAVA:XML">
                          {{ item }}
                        </p>
                      </div>
                    </template>
                    <template #default v-else>
                      <div>{{ scope.row.keyName }}</div>
                    </template>
                    <template #reference>
                      <span>
                        {{ scope.row.keyName }}
                      </span>
                    </template>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column width="100" property="example" label="示例" />
            </el-table>
          </el-popover>
          <el-button type="primary" @click="addCode" v-if="treeid!=''">
            提交代码
          </el-button>
        </div>

        <div class="flex">
          <!-- :render-content="renderContent" -->
          <el-card class="box-card">
            <el-input v-model="filterText" placeholder="输入关键字进行搜索" class="search-ipt" />
            <el-tree ref="treeRef" :data="dataSource" node-key="id" default-expand-all :expand-on-click-node="false"
                     :props="defaultProps" :filter-node-method="filterNode"
                     @node-click="treeClick" @node-contextmenu="floderOption">
              <template #default="{node, data}">
                <div class="custom-tree-node">
                  <img :src="srcPath(node)" alt="">
                  <span>{{ node.label }}</span>
                </div>
              </template>
            </el-tree>
          </el-card>
          <mirror-text-area :code="code" :onChange="changeCode" v-if="treeid!=''" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <button-menu :optionCardX="optionCardX" :optionCardY="optionCardY" :optionCardShow="optionCardShow"
                 :nodeData="nodeData" :append="append" :remove="remove" :rename="rename" />
    <file-model ref="fileModelRef" v-model:dialogVisible="dialogVisible" :title="title"
                :fileForm="ruleForm.fileModelForm" :fileRules="modelRules" :off="off" :save="save" :addType="addType" />
  </div>
</template>
<script lang="ts" setup>
// eslint-disable-line no-unused-vars
import {
  reactive,
  getCurrentInstance,
  ref,
  watch,
  nextTick
} from 'vue'
import {
  TabsPaneContext,
  ElMessage,
  ElMessageBox,
  ElTree

} from 'element-plus'
import ProjectForm from '@/views/project/components/projectInfoForm.vue'
import fileModel from '@/views/project/components/fileModel.vue'
import mirrorTextArea from '@/views/project/components/mirrorTextArea.vue'
import buttonMenu from '@/views/project/components/buttonMenu.vue'
import {
  iconList
} from '@/hook/iconList'
import clip from '@/utils/clipboard'
import {
  projectAdd,
  projectUpdate,
  projectView
} from '@/api/project'
import {
  queryAll
} from '@/api/user'
import {
  templateUpdate,
  templateView
} from '@/api/template'
import {
  zonetreeAdd,
  zonetreeDelete,
  zonetreeQueryAll,
  zonetreeUpdate,
  zonetreeView
} from '@/api/zonetree'
import {
  useRouter
} from 'vue-router'

const userList = ref([])
const router = useRouter()
const internalInstance = getCurrentInstance()
const query = router.currentRoute.value.query
const activeName = ref('proInfo')
const step = ref(0)
const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()
const dialogVisible = ref(false)
const title = ref('')
const addType = ref(true)
const projectid = ref('')
const code = ref('')
const treeid = ref('')
const optionCardShow = ref(false)
const optionCardX = ref('')
const optionCardY = ref('')
const nodeData = ref({})
const ruleForm = reactive({
  // 项目基本信息
  form: {
    projectName: '', // 名称
    projectDescribe: '', // 描述
    ispublic: '', // 是否公开
    dictionaryList: [], // 数据字典
    userList: []
  },
  // 模板信息
  fileModelForm: {
    name: '', // 名称
    type: '', // 类型
    pid: '', // 父级id
    projectid: '' // 项目id
  }
})
const defaultProps = {
  children: 'child',
  label: 'name'
}

// 文件类型格式
interface Tree {
  id: number
  name: string
  child?: Tree[]
}

const id = 1000
// 文件数据
const dataSource = ref<Tree[]>()

const handleCopy = async(text, event) => {
  clip(text, event)
}
const getTree = async(id: number) => {
  const tree = await zonetreeQueryAll({
    parameter: {
      projectid: id
    }
  })
  if (tree.code == 200 && tree.data) {
    dataSource.value = tree.data
    ruleForm.fileModelForm.projectid = id
  } else {
    ElMessage.error(res.msg)
  }
}
if (query.id) {
  // 查询项目基本信息
  new Promise((resolve, reject) => {
    projectView({
      parameter: {
        id: query.id
      }
    }).then((res: any) => {
      if (res.code == 200 && res.data) {
        const form = res.data
        if (form.dictionaryList && form.dictionaryList.length > 0) {
          for (let i = 0; i < form.dictionaryList.length; i++) {
            if (form.dictionaryList[i].types == 2 && form.dictionaryList[i].listContent) {
              form.dictionaryList[i].arrList = JSON.parse(form.dictionaryList[i].listContent)
            }
          }
        }
        ruleForm.form = form
      } else {
        ElMessage.error(res.msg)
      }
      resolve(true)
    }).catch(error => {
      reject(error)
    })
  })
  getTree(query.id)
}

// 监听输入框搜索
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const srcPath = (node) => {
  if (node.data.type == '1') {
    return require('@/assets/treeIcon/file.png')
  } else {
    try {
      return require('@/assets/treeIcon/' + node.data.name.substr(node.data.name.lastIndexOf('.') + 1) + '.png')
    } catch {
      return require('@/assets/treeIcon/unknownfile.png')
    }
  }
}

// 查询模板内容
const treeClick = async(data: Tree) => {
  if (data.type == 2 && data.id != treeid.value) {
    const templateCont = await templateView({
      parameter: {
        treeid: data.id
      }
    })
    if (templateCont.code == 200) {
      if (templateCont.data) {
        code.value = templateCont.data.templateContent
        treeid.value = data.id
      }
    }
  }
  optionCardShow.value = false
}

// 文件夹右键时触发的事件
const floderOption = async(e, data, n, t) => {
  optionCardShow.value = false
  optionCardX.value = e.x // 让右键菜单出现在鼠标右键的位置
  optionCardY.value = e.y
  nodeData.value = data
  optionCardShow.value = true // 展示右键菜单
}

const OptionCardClose = (event) => {
  const currentCli = document.getElementById('option-button-group')
  if (currentCli) {
    if (!currentCli.contains(event.target)) { // 点击到了id为option-button-group以外的区域，就隐藏菜单
      optionCardShow.value = false
    }
  }
}

const visible = ref(false)
const gridData = [
  {
    id: 1,
    key: '${table_name}',
    keyName: '表名字',
    example: 'model_user'
  },
  {
    id: 2,
    key: '${tableDesc}',
    keyName: '表描述',
    example: '用户表'
  },
  {
    id: 3,
    key: '${TableName}',
    keyName: '表名字首字母大写驼峰',
    example: 'ModelUser'
  },
  {
    id: 4,
    key: '${tableName}',
    keyName: '表名字首字母小写驼峰',
    example: 'modelUser'
  },
  {
    id: 5,
    key: '${FiledList}',
    keyName: '',
    example: '',
    children: [
      {
        id: 5 - 1,
        key: 'filed_name',
        keyName: '字段名字',
        example: 'user_name'
      },
      {
        id: 5 - 2,
        key: 'filedDesc',
        keyName: '字段描述',
        example: '用户名称'
      },
      {
        id: 5 - 3,
        key: 'FILEDNAME',
        keyName: '字段名字首字母大写驼峰',
        example: 'UserName'
      },
      {
        id: 5 - 4,
        key: 'filedName',
        keyName: '字段名字首字母小写驼峰',
        example: 'userName'
      },
      {
        id: 5 - 5,
        key: 'isKey',
        keyName: '是否主键（布尔）',
        example: 'true/false'
      },
      {
        id: 5 - 6,
        key: 'filedLen',
        keyName: '字段长度（数字）',
        example: '20'
      },
      {
        id: 5 - 7,
        key: 'realType',
        keyName: '真实字段类型',
        example: 'varchar'
      },
      {
        id: 5 - 8,
        key: 'javaType',
        popover: 1,
        keyName: '字段类型转JAVA类型',
        example: 'String'
      },
      {
        id: 5 - 9,
        key: 'xmlType',
        popover: 2,
        keyName: '字段类型转XML类型',
        example: 'VARCHAR'
      }
    ]
  }
]
const JAVA = [
  'varchar  ==> String',
  'double   ==> Double',
  'char     ==> String',
  ' text     ==> String',
  'int      ==> Integer',
  'tinyint  ==> Integer',
  'bigint   ==> Long',
  'numeric  ==> Double',
  'decimal  ==> Float',
  'date     ==> Date',
  'datetime ==> Timestamp'
]
const XML = [
  'varchar  ==> VARCHAR',
  'char     ==> VARCHAR',
  'text     ==> LONGVARCHAR',
  ' tinyint  ==> TINYINT',
  ' bigint   ==> BIGINT',
  ' int      ==> INTEGER',
  'numeric  ==> DOUBLE',
  'decimal  ==> FLOAT',
  'date     ==> DATE',
  'datetime ==> TIMESTAMP'
]

// 提交代码
const addCode = async() => {
  const templateCont = await templateUpdate({
    parameter: {
      treeid: treeid.value,
      templateContent: code.value
    }
  })
  if (templateCont.code == 200) {
    ElMessage.success(templateCont.msg)
  }
}

// 搜索方法
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}

// 添加文件
const append = (data: Tree) => {
  dialogVisible.value = true
  title.value = '添加'
  addType.value = true
  ruleForm.fileModelForm.type = '1'
  ruleForm.fileModelForm.pid = nodeData.value.id
  optionCardShow.value = false
  empty()
}

// 编辑文件
const rename = async(data: Tree) => {
  dialogVisible.value = true
  title.value = '编辑'
  addType.value = false
  optionCardShow.value = false
  empty()
  const zonetree = await zonetreeView({
    parameter: {
      id: nodeData.value.id
    }
  })
  ruleForm.fileModelForm = zonetree?.data
}

// 删除文件
const remove = (node: Node, data: Tree) => {
  optionCardShow.value = false
  ElMessageBox.confirm('删除后无法恢复，请确认是否删除', '是否删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async() => {
      const zonetree = await zonetreeDelete({
        parameter: {
          id: nodeData.value.id
        }
      })
      if (zonetree.code == 200) {
        if (zonetree.data) {
          getTree(ruleForm.fileModelForm.projectid)
          treeid.value = ''
          ElMessage.success(zonetree.msg)
        }
      }
    })
    .catch(() => {
    })
}

const iconUrl = ref('../../assets/treeIcon/file.png')

// 项目基本信息表单规则
const rules = reactive<FormRules>({
  projectName: [{
    required: true,
    message: '请输入项目名称',
    trigger: 'blur'
  }],
  projectDescribe: [{
    required: false
  }],
  ispublic: [{
    required: true,
    message: '请选择人员类型',
    trigger: 'change'
  }]
})

// 模板信息表单规则
const modelRules = reactive<FormRules>({
  name: [{
    required: true,
    message: '请输入名称',
    trigger: 'blur'
  }],
  type: [{
    required: true,
    message: '请选择类型',
    trigger: 'change'
  }]
})

// 关闭
const off = () => {
  dialogVisible.value = false
}

const changeCode = async(codes) => {
  code.value = codes
}
// 更新保存
const save = async() => {
  if (addType.value) {
    await fileModelRef.value.fileFormRef.validate(async(valid, fields) => {
      if (valid) {
        const zonetree = await zonetreeAdd({
          parameter: {
            ...ruleForm.fileModelForm
          }
        })
        if (zonetree.code == 200) {
          if (zonetree.data) {
            dialogVisible.value = false
            getTree(ruleForm.fileModelForm.projectid)
            ElMessage.success(zonetree.msg)
          }
        }
      } else {
        console.log('error submit!', fields)
      }
    })
  } else {
    const update = await zonetreeUpdate({
      parameter: {
        ...ruleForm.fileModelForm
      }
    })
    if (update.code == 200) {
      if (update.data) {
        dialogVisible.value = false
        getTree(ruleForm.fileModelForm.projectid)
        ElMessage.success(update.msg)
      }
    }
  }
}

// 获取人员列表
const generateData = async() => {
  const data = await queryAll({
    parameter: {}
  })
  if (data.code == 200) {
    userList.value = data?.data
  } else {
    ElMessage.error('列表数据获取失败')
  }
}
generateData()
const addArrList = async(index:number) => {
  if (!ruleForm.form.dictionaryList[index].arrList) {
    ruleForm.form.dictionaryList[index].arrList = []
  }
  const list = ruleForm.form.dictionaryList[index].arrList
  if (list.length > 0) {
    // 判断上一个是否完成填写，上一个填写完成才能添加下一个
    const lastData = list[list.length - 1]
    if (lastData.name == '' || lastData.value == '') {
      ElMessage.warning('数组字典名称和值不能为空！')
      return
    }
  }
  ruleForm.form.dictionaryList[index].arrList.push({ name: '', value: '', chose: false })
}

const choseArrCheck = async(i:number, j:number) => {
  const list = ruleForm.form.dictionaryList[i].arrList
  let str = ''
  let flag = true
  for (let x = 0; x < list.length; x++) {
    if (list[x].chose) {
      if (flag) {
        flag = false
        str += list[x].value
      } else {
        str += (',' + list[x].value)
      }
    }
  }
  ruleForm.form.dictionaryList[i].dictionaryValue = str
}
const delArrList = async(i:number, j:number) => {
  ruleForm.form.dictionaryList[i].arrList.splice(j, 1)
  await choseArrCheck(i, j)
}

// 新增字典
const addList = async() => {
  const flag = ruleForm.form.dictionaryList.every(item => {
    if (item.dictionaryKey == '' || item.dictionaryDescribe == '') {
      return false
    }
    if (item.types == 1) {
      if (item.dictionaryValue == '') {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  })
  if (!flag) {
    ElMessage.warning('字典必填项不能为空！')
  } else {
    ruleForm.form.dictionaryList.push({
      types: 1,
      dictionaryKey: '',
      dictionaryValue: '',
      dictionaryDescribe: ''
    })
  }
}

// 删除字典
const delList = async(i) => {
  ruleForm.form.dictionaryList.splice(i, 1)
}

// 更新保存
const define = async() => {
  if (query.id == undefined) {
    await projectFromRef.value.ruleFormRef.validate(async(valid, fields) => {
      if (valid) {
        console.log('submit!')
        const flag = ruleForm.form.dictionaryList.every(item => {
          if (item.dictionaryKey == '' || item.dictionaryDescribe == '') {
            return false
          }
          if (item.types == 1) {
            if (item.dictionaryValue == '') {
              return false
            } else {
              return true
            }
          } else {
            return true
          }
        })
        if (!flag) {
          ElMessage.warning('字典必填项不能为空！')
          return
        }
        if (ruleForm.form.ispublic == '1') {
          ruleForm.form.userList = []
        }
        for (let i = 0; i < ruleForm.form.dictionaryList.length; i++) {
          if (ruleForm.form.dictionaryList[i].types == 2 && ruleForm.form.dictionaryList[i].arrList) {
            console.log('shuzu转换了')
            ruleForm.form.dictionaryList[i].listContent = JSON.stringify(ruleForm.form.dictionaryList[i].arrList)
            console.log(' ruleForm.form.dictionaryList[i].listContent', ruleForm.form.dictionaryList[i].listContent)
          }
        }
        const project = await projectAdd({
          parameter: {
            ...ruleForm.form
          }
        })
        if (project.code == 200) {
          if (project.data) {
            step.value = 1
            activeName.value = 'tmpInfo'
            getTree(project.data.id)
            ElMessage.success(project.msg)
          }
        }
      } else {
        console.log('error submit!', fields)
      }
    })
  } else {
    const flag = ruleForm.form.dictionaryList.every(item => {
      if (item.dictionaryKey == '' || item.dictionaryDescribe == '') {
        return false
      }
      if (item.types == 1) {
        if (item.dictionaryValue == '') {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    })
    if (!flag) {
      ElMessage.warning('字典必填项不能为空！')
      return
    }
    if (ruleForm.form.ispublic == '1') {
      ruleForm.form.userList = []
    }
    for (let i = 0; i < ruleForm.form.dictionaryList.length; i++) {
      if (ruleForm.form.dictionaryList[i].types == 2 && ruleForm.form.dictionaryList[i].arrList) {
        console.log('shuzu转换了')
        ruleForm.form.dictionaryList[i].listContent = JSON.stringify(ruleForm.form.dictionaryList[i].arrList)
        console.log(' ruleForm.form.dictionaryList[i].listContent', ruleForm.form.dictionaryList[i].listContent)
      }
    }
    const update = await projectUpdate({
      parameter: {
        ...ruleForm.form
      }
    })
    if (update.code == 200) {
      if (update.data) {
        ElMessage.success(update.msg)
      }
    }
  }
}

// 初始化组件实例
const projectFromRef = ref<HTMLElement | null>(null)
const fileModelRef = ref<HTMLElement | null>(null)
const empty = () => {
  nextTick(() => {
    if (fileModelRef.value) {
      fileModelRef.value.fileFormRef.resetFields()
    }
  })
}
</script>
<style lang="scss">
.demo-tabs {
  padding: 20px;

  .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
}

.model-info {
  .box-card {
    min-width: 30%;
    height: 70vh;
    margin-right: 20px;
    overflow-y: auto;

    .el-tree-node > .el-tree-node__children {
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .search-ipt {
      margin-bottom: 20px;
    }

    .el-tree-node__content {
      height: 38px;

      &:hover {
        .handle-btn {
          // display: inline-block;
        }
      }
    }

    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      font-size: 14px;

      span {
        font-weight: normal;
      }

      img {
        margin-right: 10px;
        width: 20px;
        height: 20px;
      }
    }

    .handle-btn {
      display: none;
      margin-left: 10px;
      width: 20px;
      height: 20px;
    }
  }
}

.flex {
  display: flex;
}

.addCode {
  display: flex;
  margin-bottom: 20px;
  //margin-left: auto;
  justify-content: space-between;
}

.el-tag {
  cursor: pointer;
}
</style>
