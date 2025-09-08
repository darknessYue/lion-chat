<template>
  <div class="q-a">
    <div v-if="message" class="q-a-req">
      <div class="q-a-req-content">
        <span>{{ message }}</span>
        <div style="height: 18px;"></div>
        <span class="q-a-req-content-copy" @click="copyTextHandle(message)">{{ t('copy') }}
          <RightIcon v-if="copySuccess" />
        </span>
      </div>
    </div>
    <div class="q-a-res">
      <img class="q-a-res-img" src="../../assets/lion-default.png" alt="" />
      <div class="q-a-res-content">
        <p class="q-a-res-content-nickname">{{ t('o_nickname') }}</p>
        <span>
          <div v-if="isLoading || (!isLoading && answer === '')" class="loading-box"><div class="load-text">{{ t('o_loading') }}</div><div class="loading-dot"></div></div>
          <template v-else>
            <div class="markdown-content" v-html="renderedAnswer"></div>
            <!-- <MdPreview editor-id="res-o-answer"  :model-value="answer" :sanitize="sanitize" /> -->
          </template>
        </span>
        <div v-if="isEnd && randomNumber?.length" class="recommend-questions">
          <p>{{ t('more_tips') }}</p>
          <ul>
            <li v-for="item in randomNumber" :key="item" @click="emit('add', questionList[item])">{{ questionList[item] }}</li>
          </ul>
        </div>
        <div style="height: 18px;"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sse } from '../../utils/sse';
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import { t } from '../../i18n/index';
import { marked } from 'marked';
import DOMPurify from 'dompurify';


// import { MdPreview  } from 'md-editor-v3';
import { copyText, markdownTransform, replaceCode } from '../../utils/index';
import { ChatItem, ChatOptions } from './ChatLion.vue';
import RightIcon from './RightIcon.vue';

const questionList = ref<string[]>(t('questions'))
const copySuccess = ref(false)

const renderMarkdown = (content: string): string => {
  const rawHtml = marked(content) as string;
  const sanitizedHtml = DOMPurify.sanitize(rawHtml, {ADD_TAGS: ['img'],ADD_ATTR: ['src', 'alt', 'height', 'width']});
  
  
  // 为图片添加包装容器和错误处理
  const modifiedHtml = sanitizedHtml.replace(/<img([^>]*)>/g, (match: any, imgAttrs: any) => {
    return `
      <span class="img-wrapper" style="display: inline-block; position: relative; min-height: 20px; min-width: 20px;">
        <img${imgAttrs} 
             onload="this.parentElement.style.minHeight='auto'; this.parentElement.style.minWidth='auto';"
             onerror="this.style.display='none'">
      </span>
    `;
  });
  
  // 为a标签添加target="_blank"和rel="noopener noreferrer"属性
  const finalHtml = modifiedHtml.replace(/<a(?![^>]*target=)/g, '<a target="_blank" rel="noopener noreferrer"');
  return markdownTransform(finalHtml);
};

// const { setConversationId, conversation_id } = useUserStore()

const props = defineProps({
  options: {
    type: Object,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    default: () => ''
  },
  answer: {
    type: String,
    default: () => ''
  },
  context: {
    type: String,
    default: () => ''
  },
  history: {
    type: Array<ChatItem>,
    default: () => []
  }
})

const emit = defineEmits(['change', 'add'])

const isLoading = ref(true);
const isEnd = ref(false);
const answer = ref<string>(props.answer);
// const loaded = ref(!!props.answer);


const randomNumber = ref<number[]>()
// const sanitize = (str:string) => {
//   return markdownTransform(str)
// }

// 页面切换 重新请求
// const handleVisibilityChange = () => {
//   const visibilityState = document.visibilityState;
//   if (visibilityState === 'visible') {
//     if(!isEnd.value) {
//       isLoading.value = true;
//       answer.value = props.answer
//     }
//   }
// };
const scrollBottom:any = inject('scrollBottom');

const renderedAnswer = computed(() => {
  return renderMarkdown(answer.value);
});


const timer = ref<any>(null)
const copyTextHandle = async (text: string) => {
  const success = await copyText(text);
  if (success) {
    copySuccess.value = true;
    timer.value && clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } else {
    copySuccess.value = false;
  }
}


const getAnswer = async () => {
  try {
    await sse({
      options: props.options as ChatOptions,
      payload: props.context + props.message,
      progress: (data: string) => {
        const str = data
        if(str && isLoading.value) {
          isLoading.value = false;
        }
        answer.value = replaceCode(answer.value + str)
        
        scrollBottom && scrollBottom()
      },
      end: () => {
        if(isLoading.value) {
          isLoading.value = false;
        }
        if(!answer.value) {
          answer.value = t('net_error')
        }
        isEnd.value = true
        emit('change', {
          id: props.id,
          answer: answer.value || t('net_error')
        })
      }
    })
  } catch (error) {
    isLoading.value = false;
    isEnd.value = true
    answer.value = t('net_error')
    emit('change', {
      id: props.id,
      answer: t('net_error')
    })
  }
}
onMounted(() => {
  
  if(props.answer) {
    answer.value = props.answer
    isLoading.value = false;
    isEnd.value = true
  } else {
    getAnswer()
  }
  scrollBottom && scrollBottom(0)
  // 随机问题
  // const history = props.history.map(item => item.question)
  // questionList.value = questionList.value.filter(item => !history.includes(item))
  // randomNumber.value = generateUniqueRandomNumbers(questionList.value.length - 1)
  // 监听页面切换
  // document.addEventListener('visibilitychange', handleVisibilityChange);
})

onUnmounted(() => {
  timer.value && clearTimeout(timer.value);
  // document.removeEventListener('visibilitychange', handleVisibilityChange);
})

defineExpose({
  getAnswer: () => answer.value
})

</script>
