import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  // { path: '/home', component: () => import('@/views/dashboard/index'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/lab',
    component: Layout,
    children: [
      {
        path: 'lab',
        name: 'Lab',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '超计算实验室', icon: 'arrow-left' }
      }
    ]
  },
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/item/home'),
        meta: { title: '个人管理', icon: 'user-zone' }
      }
    ]
  },

  {
    path: '/show',
    component: Layout,
    children: [
      {
        path: 'show',
        name: 'Show',
        component: () => import('@/views/item/show'),
        meta: { title: '发布管理', icon: 'show' }
      }
    ]
  },

  {
    path: '/talk',
    component: Layout,
    children: [
      {
        path: 'talk',
        name: 'Talk',
        component: () => import('@/views/item/talk'),
        meta: { title: '记录管理', icon: 'talk' }
      }
    ]
  },
  /* {
    path: '/schedule',
    component: Layout,
    children: [
      {
        path: 'schedule',
        name: 'Schedule',
        component: () => import('@/views/item/schedule'),
        meta: { title: '日程表', icon: 'schedule' }
      }
    ]
  }, */
  {
    path: '/academic',
    component: Layout,
    children: [
      {
        path: 'academic',
        name: 'Academic',
        component: () => import('@/views/item/academic'),
        meta: { title: '学术管理', icon: 'icon-academic' }
      }
    ]
  },
  {
    path: '/daily',
    component: Layout,
    children: [
      {
        path: 'daily',
        name: 'Daily',
        component: () => import('@/views/item/daily'),
        meta: { title: '日常事务', icon: 'daily' }
      }
    ]
  },
  {
    path: '/purchase',
    component: Layout,
    children: [
      {
        path: 'purchase',
        name: 'Purchase',
        component: () => import('@/views/item/purchase'),
        meta: { title: '采购管理', icon: 'purchase' }
      }
    ]
  }, /* {
    path: '/test',
    component: Layout,
    children: [
      {
        path: 'test',
        name: 'Test',
        component: () => import('@/views/item/test'),
        meta: { title: '临时测试', icon: 'test' }
      }
    ]
  }, */
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

