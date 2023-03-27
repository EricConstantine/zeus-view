<!-- admin 权限主页 -->

<template>
  <div class="app-container">
    <!--    <p>Admin 权限可见</p>-->
    <img src="@/assets/layout/logo-zeus.png" class="sidebar-logo">
    <div>
      <h3>Zeus Auto Code</h3>
      自动代码生成工具11
    </div>
  </div>
</template>

<script lang='ts' setup>
// import Crypoto from '@/utils/threeDesUtil';

import { encryptByDES, decryptByDES } from '@/utils/3DES';
console.log('dddddddddddddd')
let data='dadfasdfds'
const _key = 'abcdefg1234567812345678!';  // 密码
console.log('加密前的请求数据', data);
let str1 = encryptByDES(JSON.stringify(data), _key);  // 把 JSON 格式数据转成字符串格式
console.log('加密后的请求数据', str1);
console.log('解密后的请求数据', decryptByDES(str1, _key));  // 测试解密后的数据是否和加密前数据一致
console.log('解密后的请求数据', decryptByDES("rq6Tf4r6q57/w2w3ontuAg==", "21232f297a57a5a743894a0e"));  // 测试解密后的数据是否和加密前数据一致
</script>

<style lang="scss" scoped>
.app-container {
  position: absolute;
  top: 50%;
  transform: translate(0%, -50%);
  width: 100%;
  text-align: center;
}
</style>
