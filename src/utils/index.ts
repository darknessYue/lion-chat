

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




class MarkdownStreamRenderer {
  constructor() {
    this.buffer = '';
    this.inTable = false;
    this.openTags = []; // 跟踪已打开的标签
  }

  // 处理单行数据
  processLine(line) {
    let result = line;
    
    // 处理内联元素（适用于任何位置）
    result = this.processInlineElements(result);
    
    // 处理块级元素
    result = this.processBlockElements(result);
    
    return result;
  }

  // 处理内联元素
  processInlineElements(text) {
    return text
      .replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>')
      .replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  }

  // 处理块级元素
  processBlockElements(line) {
    // 处理标题
    if (/^#{1,6}\s+/.test(line)) {
      const match = line.match(/^(#{1,6})\s+(.*?)$/);
      const level = match[1].length;
      return `<h${level}>${match[2]}</h${level}>`;
    }
    
    // 处理列表项
    if (/^[\*\-]\s+/.test(line)) {
      const content = line.replace(/^[\*\-]\s+/, '');
      return `<li>${content}</li>`;
    }
    
    // 处理表格行
    if (line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line.trim().split('|').slice(1, -1).map(cell => cell.trim());
      
      // 表格分隔行判断
      if (/^[\|\s]*[-\s\|]+[\|\s]*$/.test(line.trim())) {
        this.inTable = true;
        return null; // 不输出分隔行
      }
      
      // 表头行
      if (!this.inTable) {
        this.inTable = true;
        this.openTags.push('table', 'thead', 'tbody');
        return `<table><thead><tr><th>${cells.join('</th><th>')}</th></tr></thead><tbody>`;
      }
      
      // 普通数据行
      return `<tr><td>${cells.join('</td><td>')}</td></tr>`;
    }
    
    // 如果之前在表格中，现在不在表格中，则关闭表格
    if (this.inTable) {
      this.inTable = false;
      this.openTags = this.openTags.filter(tag => !['table', 'thead', 'tbody'].includes(tag));
      return `</tbody></table>${line ? `<p>${line}</p>` : ''}`;
    }
    
    // 默认段落处理
    return line ? `<p>${line}</p>` : '';
  }

  // 流式处理数据
  processStream(chunk) {
    this.buffer += chunk;
    let lines = this.buffer.split('\n');
    
    // 保留最后一行在缓冲区中（可能未完成）
    this.buffer = lines.pop();
    
    let htmlOutput = '';
    for (const line of lines) {
      const processed = this.processLine(line);
      if (processed !== null) {
        htmlOutput += processed + '\n';
      }
    }
    
    return htmlOutput;
  }

  // 获取并清理剩余缓冲区内容
  flush() {
    let result = '';
    if (this.buffer) {
      const processed = this.processLine(this.buffer);
      if (processed !== null) {
        result = processed;
      }
      this.buffer = '';
    }
    
    // 关闭所有未闭合的标签
    if (this.inTable) {
      result += '</tbody></table>';
      this.inTable = false;
    }
    
    return result;
  }
}


// 模拟流式数据处理
export function simulateStreamProcessing(markdownText) {
  const renderer = new MarkdownStreamRenderer();
  const lines = markdownText.split('\n');
  let finalHtml = '';
  
  for (const line of lines) {
    // 模拟逐行接收数据
    const chunkResult = renderer.processStream(line + '\n');
    if (chunkResult) {
      // 实时渲染部分结果
      finalHtml += chunkResult;
      console.log('Partial render:', chunkResult);
    }
  }
  
  // 处理剩余缓冲区
  const remaining = renderer.flush();
  if (remaining) {
    finalHtml += remaining;
    console.log('Final chunk:', remaining);
  }
  
  return finalHtml;
}