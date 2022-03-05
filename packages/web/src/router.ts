import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import { createRouter, createWebHistory } from 'vue-router'

const routes = setupLayouts(generatedRoutes)

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
