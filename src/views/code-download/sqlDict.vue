<template>
  <div class="sqlDict">
    <el-row v-if="dictList.length===0">
      <el-col class="el-tree__empty-block">
        <p class="el-tree__empty-text">
          暂无数据
        </p>
      </el-col>
    </el-row>
    <div v-else>
      <el-row :gutter="20">
        <el-col :span="3">
          <p>字段</p>
        </el-col>
        <el-col :span="3">
          <p>类型</p>
        </el-col>
        <el-col :span="3">
          <p>长度</p>
        </el-col>
        <el-col :span="2">
          <p>非空</p>
        </el-col>
        <el-col :span="2">
          <p>主键</p>
        </el-col>
        <el-col :span="3">
          <p>小数点</p>
        </el-col>
        <el-col :span="3">
          <p>默认值</p>
        </el-col>
        <el-col :span="5">
          <p>注释</p>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="list-row" v-for="item in dictList">
        <el-col :span="3">
          <el-input v-model="item.columnName" disabled />
        </el-col>
        <el-col :span="3">
          <el-select v-model="item.dataType">
            <el-option v-for="item in dataTypeList" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input v-model="item.columnLen" />
        </el-col>
        <el-col :span="2">
          <el-select v-model="item.nullable">
            <el-option v-for="item in commList" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-select v-model="item.isKey">
            <el-option v-for="item in commList" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input v-model="item.scale" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="item.defalutValue" />
        </el-col>
        <el-col :span="5">
          <el-input v-model="item.commentName" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'

interface Props {
  dictList: object
}

// {
//   columnLen:'20',
//     columnName:'id',
//   commentName:'主键id',
//   constraintName:'PRIMARY key'
//   dataType:'bigint'
// }

const props = withDefaults(defineProps<Props>(), {
  dictList: () => {
    return []
  }
})
const commList = ref([
  { label: '是', value: 'Y' },
  { label: '否', value: 'N' }
])
const dataTypeList = ref([
  { label: 'varchar', value: 'varchar' },
  { label: 'char', value: 'char' },
  { label: 'text', value: 'text' },
  { label: 'int', value: 'int' },
  { label: 'tinyint', value: 'tinyint' },
  { label: 'bigint', value: 'bigint' },
  { label: 'date', value: 'date' },
  { label: 'datetime', value: 'datetime' }
])
</script>

<style scoped lang="scss">
.sqlDict {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  .el-row {
    width: 100%;
  }
}

.list-row {
  margin-bottom: 20px;
}
</style>
