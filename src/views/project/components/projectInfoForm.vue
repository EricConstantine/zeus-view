<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
    <el-form-item label="项目名称" prop="projectName">
      <el-input v-model="ruleForm.projectName" />
    </el-form-item>
    <el-form-item label="项目描述" prop="projectDescribe">
      <el-input v-model="ruleForm.projectDescribe" type="textarea" />
    </el-form-item>
    <el-form-item label="是否公开" prop="ispublic">
      <el-radio-group v-model="ruleForm.ispublic">
        <el-radio label="0">
          否
        </el-radio>
        <el-radio label="1">
          是
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="选择人员" v-if="ruleForm.ispublic=='0'">
      <el-transfer
        v-model="ruleForm.userList"
        filterable
        :props="{
          key: 'userid',
          label: 'username'
        }"
        :titles="['可选人员', '已选人员']"
        filter-placeholder="选择人员"
        :data="userList"
      />
    </el-form-item>
    <el-form-item label="数据字典">
      <el-button type="primary" @click="addList()">
        新增
      </el-button>
    </el-form-item>
    <el-form-item class="data-box">
      <el-row v-if="ruleForm.dictionaryList.length>0">
        <el-col :span="5">
          <span style="color: red;">* </span>类型
        </el-col>
        <el-col :span="5">
          <span style="color: red;">* </span>名称
        </el-col>
        <el-col :span="5">
          <span style="color: red;">* </span>key
        </el-col>
        <el-col :span="5">
          <span style="color: red;">* </span>默认值
        </el-col>
      </el-row>
      <div v-for="(item,i) in ruleForm.dictionaryList">
        <el-row :gutter="10" class="list-row">
          <el-col :span="5">
            <el-select @change="(value) => choseTypes(value, i)" v-model="item.types" placeholder="请选择类型" style="width: 90%">
              <el-option label="字符串" :value="1" />
              <el-option label="数组" :value="2" />
              <el-option label="属性列表" :value="3" />
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-input v-model="item.dictionaryDescribe" placeholder="请输入名称" />
          </el-col>
          <el-col :span="5">
            <el-input v-model="item.dictionaryKey" placeholder="请输入key" />
          </el-col>
          <el-col :span="5">
            <el-input v-if="item.types!=3" :disabled="item.types==2" v-model="item.dictionaryValue"
                      :placeholder="item.types==1? '请输入默认值':'请勾选默认值'" />
          </el-col>
          <el-col :span="4">
            <el-button type="danger" @click="delList(i)">
              删除
            </el-button>
          </el-col>
        </el-row>
        <el-row v-if="item.types==2" :gutter="10" class="list-row">
          <el-col :offset="5" :span="15">
            <el-card class="box-card">
              <template #header>
                <div class="card-header" style="display: flex;justify-content: space-between">
                  <span>请添加数组型字典数据明细</span>
                  <el-button class="button" type="text" @click="addArrList(i)">
                    新增
                  </el-button>
                </div>
              </template>
              <div v-for="(item2,j) in item.arrList" class="text item">
                <el-row :gutter="10" class="list-row">
                  <el-col :span="8">
                    <el-input v-model="item2.name" placeholder="请输入数组字典名称" />
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="item2.value" placeholder="请输入数组字典值" />
                  </el-col>
                  <el-col :span="4">
                    <el-checkbox :disabled="item2.value==''||item2.name==''" @change="choseArrCheck(i,j)"
                                 v-model="item2.chose" label="默认选中" border />
                  </el-col>
                  <el-col :span="4">
                    <el-button type="danger" @click="delArrList(i,j)">
                      删除
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="define()">
        {{ id?'修改':'下一步' }}
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {
  reactive,
  ref
} from 'vue'
import type {
  FormInstance,
  FormRules
} from 'element-plus'
import { Edit, Delete, Timer, Plus, CopyDocument } from '@element-plus/icons-vue'
  interface Props {
    ruleForm: Object
    userList: Array
    id: String
    addList: Function
    delList: Function
    define: Function
    rules: FormRules
    addArrList: Function
    delArrList: Function
    choseArrCheck: Function
  }

const props = withDefaults(defineProps < Props >(), {
  ruleForm: () => {
    return {}
  },
  addArrList: () => {
    return () => {}
  },
  delArrList: () => {
    return () => {}
  },
  choseArrCheck: () => {
    return () => {}
  },
  userList: () => {
    return {}
  },
  addList: () => {
    return () => {}
  },
  delList: () => {
    return () => {}
  },
  define: () => {
    return () => {}
  },
  rules: () => {
    return () => {}
  }

})
const ruleFormRef = ref < FormInstance >()

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
defineExpose({
  ruleFormRef
})
const choseTypes = async(val:number, index:number) => {
  if (val == 2) {
    // props.addArrList(index);
  }
}
</script>
<style lang="scss">
  .data-box{
    .el-form-item__content{
      display:block;
    }
  }
  .list-row {
    margin-bottom: 20px;
    .el-col{

    }
    input{
      width:300px;
    }
  }
</style>
