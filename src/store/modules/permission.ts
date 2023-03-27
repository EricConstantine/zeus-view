import { RouteRecordRaw } from 'vue-router'
import { constantRoutes, asyncRoutes, asyncRoutesAdmin } from '@/router'

export interface IPermissionState {
  routes: RouteRecordRaw[]
  dynamicRoutes: RouteRecordRaw[]
}

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => {
      if (route.meta?.roles !== undefined) {
        return route.meta.roles.includes(role)
      } else {
        return false
      }
    })
  } else {
    return true
  }
}

const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach(route => {
    const r = { ...route }
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles)
      }
      res.push(r)
    }
  })
  return res
}

const state: IPermissionState = {
  routes: [],
  dynamicRoutes: []
}

const mutations = {
  SET_ROUTES: (state: IPermissionState, routes: RouteRecordRaw[]) => {
    state.routes = constantRoutes.concat(asyncRoutesAdmin, routes)
    state.dynamicRoutes = state.routes
  }
}

const actions = {
  setRoutes({ commit }: any, roles: string[]) {
    let accessedRoutes
    accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    // if (roles.includes('admin')) {
    //   accessedRoutes = asyncRoutes
    // } else {
    // }
    commit('SET_ROUTES', accessedRoutes)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
