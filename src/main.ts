import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import preventScroll from './directives/scroll';
import draggable from './directives/draggable';
import { setLanguage } from './i18n/index';


function bootstrap() {
  const app = createApp(App)
  app.directive('preventScroll', preventScroll);
  app.directive('draggable', draggable);
  app.mount('#o-chatbot')
}


document.addEventListener('DOMContentLoaded', () => {
  let lang = 'zh'
  if((window as any).o_chatbot_config && (window as any).o_chatbot_config?.lang === 'en') {
    setLanguage('en')
    lang = 'en'
  }
  const odiv = document.createElement('div')
  odiv.setAttribute('id', 'o-chatbot')
  odiv.classList.add(`lang-${lang}`)
  document.body.appendChild(odiv)
  bootstrap()
});
