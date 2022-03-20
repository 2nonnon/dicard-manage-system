import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import request from '../utils/request.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: {
      path: 'userManage'
    },
    children: [
      {
        path: 'userManage',
        name: 'UserManage',
        component: () => import(/* webpackChunkName: "userManage" */ '../views/UserManage.vue')
      },
      {
        path: 'categoryManage',
        name: 'CategoryManage',
        component: () => import(/* webpackChunkName: "categoryManage" */ '../views/CategoryManage.vue')
      },
      {
        path: 'orderManage',
        name: 'OrderManage',
        component: () => import(/* webpackChunkName: "orderManage" */ '../views/OrderManage.vue')
      },
      {
        path: 'goodsManage',
        name: 'GoodsManage',
        component: () => import(/* webpackChunkName: "goodsManage" */ '../views/GoodsManage.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "notFound" */ '../views/NotFound.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'Login' || to.name === 'NotFound') {
    next()
  } else {
    const token = sessionStorage.getItem("token")
    console.log(to, token)
    if (!token) {
      router.push({ name: 'Login' }).catch(err => console.log(err))
      // next({ name: 'Login' })
    } else {
      request.post('/manager/login', JSON.parse(token)).then(res => {
        console.log(res)
        if (res.code === '0') {
          next()
        } else {
          router.push({ name: 'Login' }).catch(err => console.log(err))
          // next({ name: 'Login' })
        }
      })
    }
  }
})

export default router
