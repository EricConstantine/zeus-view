import { reactive, ref, toRefs, watch } from 'vue'

export function usePagination(fn: Function) {
  interface Props {
    total: Number
    pageSize: Number
    currentPage: Number
    pagerCount: Number
    pageSizes: Array<Number>
  }

  const pagerCount = ref(5)//
  const total = ref(0)// 总条数
  const pageSize = ref(5)// 当前页面条数
  const currentPage = ref(1)// 当前页数
  const pageSizes = ref([5, 10, 20, 30, 40])
  const tableData = ref([])

  fn(currentPage.value, pageSize.value, tableData)
  watch(pageSize, (newV, oldV) => {
    // fn(currentPage.value, pageSize.value, tableData)
    dataChange()
  })
  watch(currentPage, (newV, oldV) => {
    // fn(currentPage.value, pageSize.value, tableData)
    dataChange()
  })

  const dataChange = () => {
    fn(currentPage.value, pageSize.value, tableData)
  }

  // page-size 改变时触发
  const sizeChange = (value: number) => {

  }
  // current-page 改变时触发
  const currentChange = (value: number) => {

  }
  // 用户点击上一页按钮改变当前页时触发
  const prevClick = () => {

  }
  // 用户点击下一页按钮改变当前页时触发
  const nextClick = () => {

  }
  return {
    pagerCount,
    total,
    pageSize,
    currentPage,
    pageSizes,
    sizeChange,
    currentChange,
    prevClick,
    nextClick,
    tableData,
    dataChange
  }
}
