

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
      // 不是图片链接则保留原始<a>标签
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });
}


export function replaceCode(html: string) {
  const regex = /(```html|```)/g;
  return html.replace(regex, '');
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