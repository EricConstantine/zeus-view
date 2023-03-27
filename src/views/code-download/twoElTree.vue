<template>
  <el-tree
    ref="treeRef"
    :data="dataSource"
    node-key="id"

    default-expand-all
    show-checkbox
    @check-change="handleCheckChange"
    :expand-on-click-node="false"
    :props="defaultProps"
    :default-expanded-keys="keys"
    :default-checked-keys="keys"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'

interface Props {
  dataSource: object
  treeid: object
}

const props = withDefaults(defineProps<Props>(), {
  dataSource: () => {
    return []
  },
  treeid: () => {
    return () => {

    }
  }
})
const defaultProps = {
  children: 'child',
  label: 'name'
}
const keys = ref([])// 默认选中的id
// const treeKey = ref([])
// const nodeKeyChecked = (value, nodeList: any[]) => {
//   nodeList.forEach(item => {
//     if (item.type && item.type == '2') {
//       value.value.push(item.id)
//     }
//     if (item.child && item.child.length > 0) {
//       return nodeKeyChecked(value, item.child)
//     }
//   })
//   return value
// }
watch(() => props.dataSource, (newV) => {
  console.log(newV.length)
  if (newV && newV.length > 0) {
    keys.value = []
    keys.value.push(newV[0].id)
  }
}, {
  deep: true,
  immediate: true
})
// watch(treeKey, (newV) => {
//   console.log('>>>>>>>>>>>>>>>>.')
//   props.treeid(newV)
// }, {
//   deep: true,
//   immediate: true
// })

const filterText = ref('')
const handleCheckChange = (
  data: object,
  checked: boolean,
  indeterminate: boolean
) => {
  props.treeid(data, checked, indeterminate)
  // if (checked && data.type == '2') {
  //   // const index = treeKey.value.findIndex(item => item === data.id)
  //   // if (index == -1) {
  //   //   treeKey.value.push(data.id)
  //   // }
  // }
  // if (checked == false && data.type == '2') {
  //   const index = treeKey.value.findIndex(item => item === data.id)
  //   if (index != -1) {
  //     treeKey.value.splice(index, 1)
  //   }
  // }
}

</script>

<style scoped lang="scss">
:deep(.el-tree-node ) > .el-tree-node__children {
  overflow: inherit;
}
</style>
