<template>
  <div :style="{'z-index': 9999, position: 'fixed',left: optionCardX + 'px',
                top: optionCardY + 'px', width: '100px', background: 'white',
                'box-shadow': '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)'}" v-show="optionCardShow"
       id="option-button-group">
    <el-button @click="append" class="option-card-button" v-show="nodeData.type==1">
      新建
    </el-button>
    <el-button @click="remove" class="option-card-button" v-show="nodeData.pid!=0">
      删除
    </el-button>
    <el-button @click="rename" class="option-card-button" v-show="nodeData.pid!=0">
      重命名
    </el-button>
  </div>
</template>
<script lang="ts" setup>
  interface Props {
    optionCardShow: Boolean
    optionCardX: String
    optionCardY: String
    nodeData: Object
    append: Function
    remove: Function
    rename: Function
  }

const props = withDefaults(defineProps < Props >(), {
  optionCardShow: false,
  optionCardX: '',
  optionCardY: '',
  nodeData: () => {
    return {}
  },
  append: () => {
    return () => {}
  },
  remove: () => {
    return () => {}
  },
  rename: () => {
    return () => {}
  }
})
</script>
<style lang="scss">
  // 右键菜单按钮
  .option-card-button {
    width: 100%;
    margin-left: 0 !important;
    font-size: 10px;
    border-radius: 0;
  }
</style>
