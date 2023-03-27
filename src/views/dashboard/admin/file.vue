<template>
  <div class="file">
    文件读取
    <el-input v-model="input" placeholder="Please input">
      <template #append>
        <el-button type="primary" @click="fileClick">
          选择文件
        </el-button>
      </template>
    </el-input>
    <el-button type="primary" @click="fileSet">
      生成文件
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'

const input = ref('')
const fileClick = async() => {
  // const filePath = await electron.openFile()
  const filePath = await electron.send('dialog:openFile', '')
  input.value = filePath
}
const fileSet = async() => {
  const filePath = await electron.send('will-download', input.value)
  console.log(filePath)
}

</script>

<style scoped lang="scss">

</style>
