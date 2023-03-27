// import {dictList} from '@/utils/dict'

// export function getDict(data, element, dictName) {
//   const col = element.property
//   const dictArr = dictList[dictName]
//   if (!dictArr) return
//   for (let item of dictArr) {
//     if (item.id === data[col]) {
//       return item.name
//     }
//   }
// }
/**
 * 动态表格字典翻译
 */
export const getDictDb = (val:string, dictArr:any) => {
  if (val && dictArr && dictArr.length > 0) {
    const temp = dictArr.filter((item:any) => item.skey == val)
    if (temp.length == 1) {
      return temp[0].svalue
    }
  }
}

// export const getDictList = (dictName:string) =>{
//   return  dictList[dictName]
// }
