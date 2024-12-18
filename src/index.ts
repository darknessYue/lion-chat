import { Plugin } from "vue";
import ChatLion from "./components/ChatLion";
import { makeInstaller } from "./utils/helper";
const components = [
ChatLion
] as Plugin[]

const installer = makeInstaller(components)

export { 
    ChatLion
}

export default installer

export * from  "./components"