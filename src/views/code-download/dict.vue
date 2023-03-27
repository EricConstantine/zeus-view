<template>
  <div class="dict">
    <div v-for="item in dictList">
      <div v-if="item.types===1" class="strDict">
        <div>{{ item.dictionaryDescribe }}({{ item.dictionaryKey }})</div>
        <div>  <el-input v-model="item.dictionaryValue" /></div>
      </div>
      <div v-else-if="item.types===2">
        <el-collapse>
          <el-collapse-item :title="item.dictionaryDescribe+'('+item.dictionaryKey+')'" name="1">
            <el-checkbox-group v-model="item.choseList">
              <el-checkbox v-for="itemarr in item.arrList" :label="itemarr.value">
                {{ itemarr.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-else-if="item.types===3">
        <el-collapse>
          <el-collapse-item :title="item.dictionaryDescribe+'('+item.dictionaryKey+')'" name="1">
            <el-checkbox-group v-model="item.choseList">
              <el-checkbox v-for="itemarr in item.arrList" :label="itemarr.columnName">
                {{ itemarr.commentName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <el-row v-if="dictList.length===0">
      <el-col class="el-tree__empty-block">
        <p class="el-tree__empty-text">
          暂无数据
        </p>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'

interface Props {
  dictList: object
}

const props = withDefaults(defineProps<Props>(), {
  dictList: () => {
    return []
  }
})
</script>

<style scoped lang="scss">
.dict {
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
  .strDict{
    height: 48px;font-weight: 500;display: flex;justify-content: space-between;border-top: 1px solid #EBEEF5;align-items: center
  }
</style>
