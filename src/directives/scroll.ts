// import { DirectiveBinding } from 'vue';

let scrollTop:number = 0;
const vPrebventBodyScroll = {
  beforeMount() {
    const viewportWidth = document.documentElement.clientWidth;
    if(viewportWidth > 768) {
      return
    }
    scrollTop = window.scrollY
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollTop}px`;
    document.body.style.overflow = 'hidden';
  },
  beforeUnmount() {
    const viewportWidth = document.documentElement.clientWidth;
    if(viewportWidth > 768) {
      return
    }
    document.body.style.position = '';
    document.body.style.top = 0 + 'px';
    document.body.style.overflow = 'auto';
    window.scrollTo(0, scrollTop);
  }
};
 
export default vPrebventBodyScroll;