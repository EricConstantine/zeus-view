import { getToken, removeToken, remVersions, setToken, setVersions } from '@/utils/cache'
import router, { resetRouter } from '@/router'
import { accountLogin, userInfoRequest } from '@/api/login'
import { RouteRecordRaw } from 'vue-router'

export interface IUserState {
  token: string
  name: string

  account: string
  avatar: string
  roles: string[]
  version: object
}

const state: IUserState = {
  token: getToken() || '',
  name: '',
  account: '',
  avatar: '',
  roles: [],
  version: {}
}

const mutations = {
  SET_TOKEN: (state: IUserState, token: string) => {
    state.token = token
  },
  SET_NAME: (state: IUserState, name: string) => {
    state.name = name
  },
  SET_ACCOUNT: (state: IUserState, account: string) => {
    state.account = account
  },
  SET_AVATAR: (state: IUserState, avatar: string) => {
    state.avatar = avatar
  },
  SET_ROLES: (state: IUserState, roles: string[]) => {
    state.roles = roles
  },
  SET_VERSION: (state: IUserState, version: object) => {
    state.version = version
  }
}

const actions = {
  // 登录
  login({ commit }: any, userInfo: { username: string, password: string }) {
    let { username, password } = userInfo
    username = username.trim()
    return new Promise((resolve, reject) => {
      accountLogin({ parameter: { username, password } }).then((res: any) => {
        setToken(res.data.token)
        setVersions(JSON.stringify(res.data.versions))
        commit('SET_TOKEN', res.data.token)
        commit('SET_VERSION', res.data.versions)
        console.log(JSON.stringify(res.data.versions))
        resolve(true)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户详情
  getInfo({ commit }: any) {
    return new Promise((resolve, reject) => {
      userInfoRequest().then((res: any) => {
        commit('SET_NAME', res.data.nickname)
        commit('SET_ACCOUNT', res.data.username)
        // commit('SET_AVATAR', res.data.user.avatar)
        console.log(res.data.roles)
        const roleArr = []
        const role = res.data.roles[0]
        roleArr.push(role)
        if (role == 'editor') {
          const isClinet = localStorage.getItem('isClinet')
          if (isClinet == 'true') {
            roleArr.push('editorelc')
          } else {
            roleArr.push('editorweb')
          }
        }
        console.log('roleArr')
        console.log(roleArr)
        commit('SET_ROLES', roleArr)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 切换角色
  async changeRoles({ commit, state, dispatch, rootState }: any, role: string) {
    // const token = role + '-token'
    // commit('SET_TOKEN', token)
    // setToken(token)
    await dispatch('getInfo', role)
    dispatch('permission/setRoutes', state.roles, { root: true })
    resetRouter()
    rootState.permission.dynamicRoutes.forEach((item: RouteRecordRaw) => {
      router.addRoute(item)
    })
  },
  // 登出
  logout({ commit }: any) {
    removeToken()
    remVersions()
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    commit('SET_VERSION', {})
    resetRouter()
  },
  // 重置 token
  resetToken({ commit }: any) {
    removeToken()
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
