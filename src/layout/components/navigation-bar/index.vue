<!-- 导航栏 -->

<template>
  <div class="navbar">
    <Hamburger :is-active="sidebar.opened" class="hamburger" @toggle-click="state.toggleSideBar" />
    <BreadCrumb class="breadcrumb" />
    <div class="right-menu">
      <Screenfull class="right-menu-item" v-if="showScreenfull" />
      <ThemeSwitch class="right-menu-item" v-if="showThemeSwitch" />
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="roles.indexOf('admin')>=0" src="@/assets/layout/avatar8.gif" class="user-avatar">
          <el-avatar v-else class="textAvatar" :style="randomRgb()">
            {{ nickname }}
          </el-avatar>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <!--            <a target="_blank" href="https://github.com/un-pany/v3-admin">-->
            <!--              <el-dropdown-item>基于 v3-admin</el-dropdown-item>-->
            <!--            </a>-->
            <!--            <a target="_blank" href="https://github.com/un-pany/v3-electron">-->
            <!--              <el-dropdown-item>GitHub</el-dropdown-item>-->
            <!--            </a>-->
            <el-dropdown-item divided @click="state.logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BreadCrumb from '../bread-crumb/index.vue'
import Hamburger from '../hamburger/index.vue'
import ThemeSwitch from '@/components/theme-switch/index.vue'
import Screenfull from '@/components/screenfull/index.vue'
import { computed, reactive } from 'vue'
import { store } from '@/store'
import { useRouter } from 'vue-router'
const router = useRouter()
const randomRgb = () => {
  const colorList = [
    'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
    'linear-gradient(120deg, #22E1FF 0%, #1D8FE1 48%, #625EB1 100%)',
    'linear-gradient(120deg, #3D4E81 0%, #5753C9 48%, #6E7FF3 100%)',
    'linear-gradient(120deg, #209cff 0%, #68e0cf 100%)',
    'linear-gradient(120deg, #96deda 0%, #50c9c3 100%)',
    'linear-gradient(120deg, #007adf 0%, #00ecbc 100%)',
    'linear-gradient(120deg, #6a11cb 0%, #2575fc 100%)'
  ]
  const index = Math.floor(Math.random() * colorList.length)
  return {
    backgroundImage: colorList[index]
  }
}
const sidebar = computed(() => {
  return store.state.app.sidebar
})
const showThemeSwitch = computed(() => {
  return store.state.settings.showThemeSwitch
})
const showScreenfull = computed(() => {
  return store.state.settings.showScreenfull
})
const roles = computed(() => store.state.user.roles)
const nickname = computed(() => {
  const name = store.state.user.name
  if (/.*[\u4e00-\u9fa5]+.*$/.test(name)) {
    if (name.length > 2) {
      return name.substring(name.length - 2, name.length)
    } else {
      return name
    }
  } else {
    if (name.length > 5) {
      return name.substring(0, 5)
    } else {
      return name
    }
  }
})
const state = reactive({
  toggleSideBar: () => {
    store.commit('app/TOGGLE_SIDEBAR', false)
  },
  logout: () => {
    store.dispatch('user/logout')
    router.push('/login').catch((err) => {
      console.warn(err)
    })
  }
})
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  background: #fff;
  .hamburger {
    line-height: 50px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb {
    float: left;
  }

  .right-menu {
    float: right;
    margin-right: 8px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #5a5e66;
    .right-menu-item {
      padding: 0 8px;
      cursor: pointer;
    }
    .avatar-container {
      .avatar-wrapper {
        padding: 0 8px;
        cursor: pointer;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
      }
    }
  }
}
  .textAvatar{
    width: 39px;height: 39px;font-size: 15px;
  }
</style>
