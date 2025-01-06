
const vDraggable = {
    mounted(el: HTMLElement) {
      let isDragging = false;
      let offsetX: number, offsetY: number;
      let startX: number, startY: number;
      const dragThreshold = 5; // 拖拽阈值，单位为像素
      let timer:any = null;
  
      const onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        isDragging = false;
        startX = e.clientX;
        startY = e.clientY;
        offsetX = e.clientX - el.offsetLeft;
        offsetY = e.clientY - el.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };
  
      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) {
            const dx = Math.abs(e.clientX - startX);
            const dy = Math.abs(e.clientY - startY);
            if (dx > dragThreshold || dy > dragThreshold) {
              isDragging = true;
              el.classList.add('dragging');
            }
            return;
        };
        // el.style.position = 'absolute';
        el.style.left = `${e.clientX - offsetX}px`;
        el.style.top = `${e.clientY - offsetY}px`;
      };
  
      const onMouseUp = () => {
        isDragging = false;
        clearTimeout(timer);
        timer = setTimeout(() => {
            el.classList.remove('dragging');
        }, 200);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      const resizeHandle = () => {
        // 获取视口的宽度和高度
        if(el.style.left) {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const offsetLeft = parseInt(el.style.left);
            const offsetTop = parseInt(el.style.top);
            const left = (viewportWidth - el.offsetWidth);
            const top = (viewportHeight - el.offsetHeight);
            el.style.left = `${Math.min(offsetLeft, left)}px`;
            el.style.top = `${Math.min(offsetTop, top)}px`;
        }
      }
  
      el.addEventListener('mousedown', onMouseDown);
      window.addEventListener('resize', resizeHandle)
    },
    unmounted(el: HTMLElement) {
      el.removeEventListener('mousedown', () => {});
    },
  };
   
  export default vDraggable;
