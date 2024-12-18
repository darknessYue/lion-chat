import { App } from "vue";
import { RouteRecordRaw, createRouter, createWebHistory  } from 'vue-router'


const routes:RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/Chatbox.vue'),
  }
]


const create = () => {
  return createRouter({
    history: createWebHistory('/otf/'),
    routes,
    scrollBehavior: (_to, _from, savedPosition) => {
      // const scrollStore = useScrollStore()
      // scrollStore.backTop()
      const top = savedPosition?savedPosition.top: 0
      window.scrollTo({
        top,
        // @ts-ignore
        behavior: 'instant'
      })
      
    }
  })
}

export const router = create()

export function setupRouter(app: App<Element>) {
  app.use(router)
}
