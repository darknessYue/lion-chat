

// 生成随机数
export function generateUniqueID() {
  const timestamp = Date.now();
  const randomPart = Math.floor(Math.random() * 100000000).toString(36);
  return `${timestamp}-${randomPart}`;
}

// 给table嵌套div
export function wrapTableInDiv(htmlString:string) {
  // 正则表达式用于匹配 <table> 标签
  const regex = /<table\b[^>]*>/gi;

  // 使用正则表达式的全局替换功能，在每个匹配到的 <table> 前后添加 <div>
  const wrappedStr = htmlString.replace(regex, (match) => {
      return `<div class="table_container">${match}`;
  });

  // 由于正则只匹配了开始标签，现在需要处理结束标签 </table>
  // 假设每个 <table> 都有一个对应的 </table>，我们可以简单地在最后添加 </div>
  const finalStr = wrappedStr.replace(/<\/table>/g, (match) => {
      return `${match}</div>`;
  });

  return finalStr;
}

// 给图片链接改为img
export function replaceAToImg(html:string) {
  
  // 正则表达式匹配<a>标签，并捕获href属性值
  const regex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/g;
  
  // 使用正则表达式进行全局替换
  return html.replace(regex, (match, href, text) => {
     
      // 检查href是否为图片链接
      const imgRegex = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
      if (imgRegex.test(href)) {
          if(html.indexOf(`<img src="${href}"`) !== -1) {
            return match;
          }
          // 替换为<img>标签
          return `<img src="${href}" alt="${text}" />`;
      }
      // const iframeRegex = /(kol-analysis\/static\/html)/i;
      // if (iframeRegex.test(href)) {
      //     if(html.indexOf(`<iframe src="${href}"`) !== -1) {
      //       return match;
      //     }
      //     // 替换为<img>标签
      //     return `<iframe src="${href}" width="100%" height="500px" />`;
      // }
      // 不是图片链接则保留原始<a>标签
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });
}


export function replaceCode(html: string) {
  const regex = /(```html|```)/g;
  return html.replace(regex, '');
}


export function replaceIframe(html: string) {
  const regex = /(kol-analysis\/static\/html)/g;
  return html.replace(regex, `<iframe src="${regex}" width="100%" height="500px"></iframe>`);
}

export function markdownTransform(html: string) {
  return replaceAToImg(wrapTableInDiv(html));
}

// 方法用于生成两个不重复的0-9之间的随机整数
export function generateUniqueRandomNumbers(max: number) {
  const usedNumbers = new Set<number>();
 
  if(max === 1) {
    return [0];
  }
  if(max === 0) {
    return [];
  }
  while (usedNumbers.size < 2) {
    let randomNumber = Math.floor(Math.random() * 10);
    if (!usedNumbers.has(randomNumber) && randomNumber <= max) {
      usedNumbers.add(randomNumber);
    }
  }

  return [...usedNumbers]
}

// 禁止遮罩层背部滚动
// let scrollTop = 0;
// const scrollListener = (e:Event) => {
//   const mask = document.querySelector('.chatbot-bubble-frame');
//   if (mask && !(mask.contains(e.target as Node))) {
//     console.log(123)
//     e.preventDefault();
//   }
  
// }
export function disableScroll() {
  
  const viewportWidth = document.documentElement.clientWidth;
  if(viewportWidth > 768) {
    return
  }
  // document.body.classList.add('no-scroll')
  // document.body.addEventListener('touchmove', scrollListener, { passive: false });
  // scrollTop = window.scrollY
  // document.body.style.position = 'fixed';
  // document.body.style.top = `-${scrollTop}px`;
  // document.body.style.overflow = 'hidden';
}

export function enableScroll() {
  const viewportWidth = document.documentElement.clientWidth;
  if(viewportWidth > 768) {
    return
  }
  // document.body.classList.remove('no-scroll')
  // document.body.removeEventListener('touchmove', scrollListener);
  // document.body.style.position = '';
  // document.body.style.top = 0 + 'px';
  // document.body.style.overflow = 'auto';
  // window.scrollTo(0, scrollTop);
}


/**
 * 兼容性文本复制方法
 * @param text - 需要复制的文本
 * @returns 复制成功返回true，失败返回false
 */
export async function copyText(text: string): Promise<boolean> {
  // 1. 优先使用现代 Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Clipboard API 失败时回退到传统方法
      return fallbackCopyText(text);
    }
  } else {
    // 2. 回退到传统方法
    return fallbackCopyText(text);
  }
}

/**
 * 传统复制方法（兼容老版本浏览器）
 * @param text - 需要复制的文本
 * @returns 复制是否成功
 */
function fallbackCopyText(text: string): boolean {
  try {
    // 创建临时 textarea 元素
    const textarea = document.createElement('textarea');
    textarea.value = text;
    
    // 设置样式使其不可见
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    
    // 添加到页面
    document.body.appendChild(textarea);
    
    // 选择文本并复制
    textarea.select();
    textarea.setSelectionRange(0, 99999); // 兼容移动端
    
    // 执行复制
    const success = document.execCommand('copy');
    
    // 清理临时元素
    document.body.removeChild(textarea);
    
    return success;
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
}