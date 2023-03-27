<template>
  <el-dialog class="configure" v-model="dialogVisible" :title="title" :close-on-click-modal="false"
             :before-close="noOff"
             width="60%" draggable>
    <div class="code-center">
      <el-card class="code-tree">
        <template #header>
          <div class="card-header">
            <span>项目目录</span>
          </div>
        </template>
        <el-scrollbar height="300px">
          <two-el-tree :dataSource="dataSource" :treeid="treeid" />
        </el-scrollbar>
      </el-card>
      <el-card class="code-dict">
        <template #header>
          <div class="card-header">
            <span>数据字典</span>
          </div>
        </template>
        <el-scrollbar height="300px">
          <dict :dictList="dictList" />
        </el-scrollbar>
      </el-card>
    </div>

    <template #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import TwoElTree from '@/views/code-download/twoElTree.vue'
import Dict from '@/views/code-download/dict.vue'

interface Props {
  dialogVisible: boolean
  title: string
  noOff: object
  dataSource: object
  dictList: object
  treeid: object
}

const props = withDefaults(defineProps<Props>(), {
  dialogVisible: false,
  title: '',
  noOff: () => {
    return () => {

    }
  },
  treeid: () => {
    return () => {

    }
  },
  dataSource: () => {
    return []
  },
  dictList: () => {
    return []
  }

})
</script>

<style scoped lang="scss">
.code-center {
  margin: 10px;
  display: flex;

  .code-tree {
    flex: 1;
    width: 100%;
  }

  .code-dict {
    width: 60%;
    margin-left: 30px;
  }
}
</style>
