import { Directive, Plugin } from "vue";
import ChatLion from "./components/ChatLion";
import { makeInstaller } from "./utils/helper";
import draggable from './directives/draggable';

const components = [
ChatLion
] as Plugin[]

const directive = [
    {
        name: 'draggable',
        d: draggable
    }
] as {name: string, d: Directive}[]

const installer = makeInstaller(components, directive)

export { 
    ChatLion
}

export default installer

export * from  "./components"