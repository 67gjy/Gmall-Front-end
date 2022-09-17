import Vue from 'vue'
import VueRouter from 'vue-router'
import store from  '@/store'

Vue.use(VueRouter)

const routes = [
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
  },
  {
    path: '/404',
    name: '404',
    component: () => import( '../views/404')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//重置路由
// export const resetRoutes = () =>{
//   router.matcher =new VueRouter({
//     mode: 'history',
//     base: process.env.BASE_URL,
//     routes
//   })
// }


export const setRoutes = () =>{
  const storeMenus = localStorage.getItem("menus");
  if (storeMenus){
    //获取当前路由对象名称数组
    const currentRoutesNames = router.getRoutes().map(v => v.name)
    if (!currentRoutesNames.includes('ManageView')){
      //拼装动态路由
      const manageRoute = {
        path: '/',
        name: 'ManageView',
        component: () => import('../views/ManageView'),
        redirect: "/home",
        children:[
          {path : 'person',name: '个人信息',component: () => import('../views/PersonView')}
        ]
      }
      const menus = JSON.parse(storeMenus)
      menus.forEach(item => {
        if (item.path){
          let itemMenu = {path: item.path.replace("/",""), name: item.name, component: () => import('../views/'+item.pagePath +'')}
          manageRoute.children.push(itemMenu)
        }else if (item.children.length){
          item.children.forEach(item => {
            if (item.path){
              let itemMenu = {path: item.path.replace("/",""), name: item.name, component: () => import('../views/' +item.pagePath + '')}
              manageRoute.children.push(itemMenu)
            }
          })
        }
      })
      //动态添加
      router.addRoute(manageRoute)
    }
  }
}

setRoutes()


router.beforeEach((to,from,next) => {
  localStorage.setItem("currentPathName",to.name)
  store.commit("setPath")
  const storeMenus = localStorage.getItem("menus")
  //未找到路由
  if(!to.matched .length){
    if (storeMenus){
      next("/404")
    }else {
      next("/login")
    }
  }
  next()
})

export default router
