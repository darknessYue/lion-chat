/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue"
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-typed-js'
declare module 'vue3-markdown-it'
declare module 'dompurify'