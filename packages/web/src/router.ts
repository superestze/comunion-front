import routes from 'virtual:generated-pages'
import { createRouter, createWebHistory } from 'vue-router'

console.log(routes)

const router = createRouter({
  history: createWebHistory(),
  // ...
  routes,
  scrollBehavior(to, from, savedPosition) {
    window.scrollTo({ top: savedPosition?.top ?? 0 })
  }
})

export default router
