import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layout/index.vue')

// 常驻路由
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: '项目主页',
          icon: 'dashboard',
          affix: true
        }
      }
    ]
  }

]

// 动态路由
export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/project',
    component: Layout,
    name: 'project',
    redirect: '/project/management',
    meta: {
      title: '项目管理',
      roles: ['admin'] // 可以在根路由中设置角色
    },
    children: [
      {
        path: 'management',
        component: () => import('@/views/project/management.vue'),
        name: 'management',
        meta: {
          title: '项目管理',
          icon: 'tree'
        }
      },
      {
        path: 'add',
        component: () => import('@/views/project/addProject.vue'),
        name: 'add',
        meta: { hidden: true, title: '新增项目' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    meta: {
      roles: ['admin'] // 可以在根路由中设置角色
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index.vue'),
        name: 'userIndex',
        meta: {
          title: '用户管理',
          icon: 'user'
          // roles: ['admin'] // 可以在根路由中设置角色
        }
      }
    ]
  },
  // {
  //   path: '/todo',
  //   component: Layout,
  //   redirect: '/todo/index',
  //   meta: {
  //     roles: ['admin'] // 可以在根路由中设置角色
  //   },
  //   children: [
  //     {
  //       path: 'todo',
  //       component: () => import('@/views/todo/index.vue'),
  //       name: 'todoIndex',
  //       meta: {
  //         title: '待办管理',
  //         icon: 'needdeal',
  //         roles: ['admin'] // 可以在根路由中设置角色
  //       }
  //     }
  //   ]
  // },
  {
    path: '/configure',
    component: Layout,
    redirect: '/configure/index',
    meta: {
      roles: ['editor'] // 可以在根路由中设置角色
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/configure/index.vue'),
        name: 'configureIndex',
        meta: {
          title: '配置中心',
          icon: 'chart',
          roles: ['editor'] // 可以在根路由中设置角色
        }
      }
    ]
  },
  {
    path: '/code',
    component: Layout,
    redirect: '/code/codeIndex',
    meta: {
      roles: ['editor'] // 可以在根路由中设置角色
    },
    children: [
      {
        path: 'codeIndex',
        component: () => import('@/views/code-download/index.vue'),
        name: 'codeIndex',
        meta: {
          title: '取码中心',
          icon: 'example',
          roles: ['editor'] // 可以在根路由中设置角色
        }
      }
    ]
  },
  {
    path: '/version',
    component: Layout,
    redirect: '/version/index',
    meta: {
      roles: ['admin'] // 可以在根路由中设置角色
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/version/index.vue'),
        name: 'versionIndex',
        meta: {
          title: '版本更新',
          icon: 'version'
          // roles: ['admin'] // 可以在根路由中设置角色
        }
      }
    ]
  },
  {
    path: '/shell',
    component: Layout,
    redirect: '/shell/index',
    meta: {
      roles: ['admin'] // 可以在根路由中设置角色
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/shell/index.vue'),
        name: 'shellIndex',
        meta: {
          title: '脚本管理',
          icon: 'shell',
          roles: ['admin'] // 可以在根路由中设置角色
        }
      }
    ]
  },
  {
    path: '/webLibrary',
    component: Layout,
    redirect: '/webLibrary/index',
    meta: {
      roles: ['admin'] // 可以在根路由中设置角色
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/webLibrary/index.vue'),
        name: 'webLibraryIndex',
        meta: {
          title: '网页库',
          icon: 'netlib',
          roles: ['admin'] // 可以在根路由中设置角色
        }
      }
    ]
  },
  {
    path: '/userWebLibrary',
    component: Layout,
    redirect: '/userWebLibrary/index',
    meta: {
      roles: ['editor'] // 可以在根路由中设置角色
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/userWebLibrary/index.vue'),
        name: 'webLibraryIndex',
        meta: {
          title: '网页库',
          icon: 'netlib',
          roles: ['editorweb'] // 可以在根路由中设置角色
        }
      },
      {
        path: 'indexElc',
        component: () => import('@/views/userWebLibrary/indexElc.vue'),
        name: 'webLibraryIndexElc',
        meta: {
          title: '网页库',
          icon: 'netlib',
          roles: ['editorelc'] // 可以在根路由中设置角色
        }
      }
    ]
  },
  {
    path: '/workBox',
    component: Layout,
    redirect: '/workBox/index',
    meta: {
      title: '工具箱',
      roles: ['editor'] // 可以在根路由中设置角色
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/workBox/index.vue'),
        name: 'workBoxIndex',
        meta: {
          title: '工具箱',
          icon: 'workBox',
          roles: ['editor'] // 可以在根路由中设置角色
        }
      },
      {
        path: 'jsonFormatCheck',
        component: () => import('@/views/workBox/components/jsonFormatCheck.vue'),
        name: 'jsonFormatCheck',
        meta: { hidden: true, title: 'json格式校验' }
      },
      {
        path: 'TextComparison',
        component: () => import('@/views/workBox/components/TextComparison.vue'),
        name: 'TextComparison',
        meta: { hidden: true, title: '文本对比' }
      },
      {
        path: 'formCreate',
        component: () => import('@/views/workBox/components/formCreate.vue'),
        name: 'formCreate',
        meta: { hidden: true, title: 'form表单生成' }
      },
      {
        path: 'exceltosql',
        component: () => import('@/views/workBox/components/exceltosql.vue'),
        name: 'exceltosql',
        meta: { hidden: true, title: 'excel转sql' }
      }
    ]
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   name: 'Permission',
  //   redirect: '/permission/page',
  //   meta: {
  //     title: '权限测试页',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'], // 可以在根路由中设置角色
  //     alwaysShow: true // 将始终显示根菜单
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import(/* webpackChunkName: "permission-page" */ '@/views/permission/page.vue'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: '页面权限',
  //         roles: ['admin'] // 或者在子导航中设置角色
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import(/* webpackChunkName: "permission-directive" */ '@/views/permission/directive.vue'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: '指令权限' // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
  //       }
  //     }
  //   ]
  // },

  { // 必须将 'Error' 路由放在最后 Must put the 'Error' route at the end
    path: '/:pathMatch(.*)*',
    component: Layout,
    name: 'Error',
    redirect: '/404',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '401',
        component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/error-page/401.vue'),
        name: '401',
        meta: {
          title: '401',
          hidden: true
        }
      },
      {
        path: '404',
        component: () => import(/* webpackChunkName: "error-page-404" */ '@/views/error-page/404.vue'),
        name: '404',
        meta: {
          title: '404',
          hidden: true
        }
      }
    ]
  }
]

// 项目管理
export const asyncRoutesAdmin: Array<RouteRecordRaw> = [
  // {
  //   path: '/project',
  //   component: Layout,
  //   name: 'project',
  //   redirect: '/project/management',
  //   meta: {
  //     title: '项目管理',
  //     roles: ['admin'] // 可以在根路由中设置角色
  //   },
  //   children: [
  //     {
  //       path: 'management',
  //       component: () => import('@/views/project/management.vue'),
  //       name: 'management',
  //       meta: {
  //         title: '项目管理',
  //         icon: 'tree'
  //       }
  //     },
  //     {
  //       path: 'add',
  //       component: () => import('@/views/project/addProject.vue'),
  //       name: 'add',
  //       meta: { hidden: true, title: '新增项目' }
  //     }
  //   ]
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

export function resetRouter() {
  // 重置路由
  // 注意：所有动态路由路由必须带有 name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器，不过体验不是很好
    window.location.reload()
  }
}

export default router
