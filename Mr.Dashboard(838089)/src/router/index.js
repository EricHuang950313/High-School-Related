import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Panel from '../views/Panel.vue'

const routes = [
  {
    path: '/Login',
    name: 'Login',
    component: Login,
    meta: { title: 'Mr.Dashboard' }
  },
  {
    path: '/Panel',
    name: 'Panel',
    component: Panel,
    meta: { title: 'Mr.Dashboard' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;
  next()
})

export default router
