<template>
  <div class="mirrorTextArea">
    <codemirror v-model="code" placeholder="请输入代码....." :style="{height: height}" :autofocus="true"
                :tabSize="2" :extensions="extensions" @change="Change" />
  </div>
</template>

<script lang="ts" setup>
// eslint-disable-line no-unused-vars
import { ref, reactive } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
const myTheme = EditorView.theme({
  // 输入的字体颜色
  '&': {
    color: '#0052D9',
    backgroundColor: '#FFFFFF'
  },
  '.cm-content': {
    caretColor: '#0052D9'
  },
  // 激活背景色
  '.cm-activeLine': {
    backgroundColor: '#FAFAFA'
  },
  // 激活序列的背景色
  '.cm-activeLineGutter': {
    backgroundColor: '#FAFAFA'
  },
  // 光标的颜色
  '&.cm-focused .cm-cursor': {
    borderLeftColor: '#0052D9'
  },
  // 选中的状态
  '&.cm-focused .cm-selectionBackground, ::selection': {
    backgroundColor: '#0052D9',
    color: '#FFFFFF'
  },
  // 左侧侧边栏的颜色
  '.cm-gutters': {
    backgroundColor: '#FFFFFF',
    color: '#ddd', // 侧边栏文字颜色
    border: 'none'
  }
}, { dark: true })

interface IProps {
  height?: string
  code?: string
  onChange?: Function
}

// 接受的参数
const props = withDefaults(defineProps<IProps>(), {
  height: '70vh',
  code: '',
  onChange: () => {
    return () => {
    }
  }
})

const extensions = [javascript(), oneDark]
const Change = (v) => {
  props.onChange(v)
}
</script>

<style scoped lang="scss">
.mirrorTextArea{
  flex: 1;
  max-width: 70%;
  min-width: 70%;
  font-size: 14px;
}
</style>
