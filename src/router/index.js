import Vue from 'vue'
import VueRouter from 'vue-router'
import store from  '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ManageView',
    component: () => import('../views/ManageView'),
    redirect: "/home",
    children:[
      {path: 'home', name: '首页', component: () => import('../views/HomeView')},
      {path: 'user', name: '用户管理', component: () => import('../views/UserView')},
      {path: 'Person', name: '个人信息', component: () => import('../views/PersonView')},
      {path: 'file', name: '文件管理', component: () => import('../views/FileView')},
      {path: 'role', name: '角色管理', component: () => import('../views/RoleView')},
      {path: 'menu', name: '菜单管理', component: () => import('../views/MenuView')}
    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'LoginView',
    component: () => import( '../views/LoginView')
  },
  {
    path: '/register',
    name: 'RegisterView',
    component: () => import( '../views/RegisterView')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to,from,next) => {
  localStorage.setItem("currentPathName",to.name)
  store.commit("setPath")
  next()
})

export default router
