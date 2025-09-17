<template>
    <div class="" v-if="showPopup">
      <div id="chatbot-bubble-button" ref="chatBoxRef" v-draggable :style="{'--chatbot-animation-duration': `${animationDuration}s`}" :class="{'chatbot-bubble-button-sayhi': isActive}" @click.prevent="handleClick">
        
          <!-- <div class="chatbot-bubble-button-inner" v-show="!isShow"> -->
            <div class="chatbot-bubble-button-inner">
            <div :class="{'chatbot-bubble-auto-chat': true, 'active': !isShow && isActive}">
              <div :class="{'chatbot-bubble-say-hello': true, 'no-support': !ifSupportDropFilter}">
                <h2>{{ t('welcome') }}</h2>
                <p>{{ t('welcome_2') }}<span>{{ t('welcome_3') }}</span>{{ t('welcome_4') }}</p>
              </div>
            </div>
            <div class="chatbot-bubble-button-imgbox">
              <img src="../../assets/lion-default-popup.png" class="robot-default" alt="robot" />
            </div>
          </div>
      </div>
      <teleport to="body">
        <div v-if="isShow" class="chatbot-bubble-frame-mask"></div>
      </teleport>
      <teleport to="body">
        <div 
          v-show="isShow" 
          :class="{
            'chatbot-bubble-frame': true,
            [`lang-${lang}`]: true,
            'max-size': isMaxSize,
          }"
        >
          <div class="chatbot-bubble-content">
            <h1 :class="{'chatbot-bubble-title': true, 'sticky': isSticky > 100}">
              <div class="chatbot-bubble-title-head">
                <a class="chatbot-bubble-title-back" href="javascript:;" @click="handleClick">
                  <img src="../../assets/close.png" alt="" srcset="" />
                </a>
                <div class="chatbot-bubble-title-text">
                  <img src="../../assets/o-top.png" alt="">
                  {{ t('o_nickname') }}
                </div>
                <div class="chatbot-bubble-title-sheet">
                  <a class="chatbot-bubble-title-size" href="javascript:;" @click="handleSize">
                    <img v-show="!isMaxSize" src="../../assets/max.png" alt="" srcset="" />
                    <img v-show="isMaxSize" src="../../assets/min.png" alt="" srcset="" />
                  </a>
                  <a class="chatbot-bubble-title-reload" href="javascript:;" @click="handleReload">
                    <img src="../../assets/reload.png" alt="" srcset="" />
                  </a>
                </div>
              </div>
            </h1>
            <div v-if="loading" class="chatbot-bubble-tips" @click="closeXHR">
              <a class="chatbot-bubble-btn">
                <img src="../../assets/stop.svg" alt="" srcset="">
                {{ t('stop_btn') }}</a>
            </div>
            <div class="chatbot-bubble-wrapper" ref="chatbotWrapper" v-on:scroll="handleScroll">
              <div class="chatbot-bubble-message">
                <Tips @add="addMessage" />
                <!-- <QA :id="0" answer="你好！请问有什么我可以帮助你的吗？" /> -->
                <template v-for="(item, index) in history" :key="item.id">
                  <QA 
                    :message="item.question"
                    :answer="item.answer"
                    :id="item.id"
                    :history="history"
                    :context="item.context"
                    @change="updateHistory"
                    @add="addMessage"
                    :options="apiOptions"
                    :ref="el => { if (el){ childRefs[index] = el } }"
                  />
                </template>
              </div>
            </div>
          </div>
          <div class="chatbot-bubble-input-box">


            <div class="chatbot-bubble-input">
              <div class="chatbot-bubble-input-inner">
                <div  class="chatbot-bubble-input-area">
                    
                  <textarea class="chatbot-bubble-input-textarea" spellcheck="false" ref="textarea" :placeholder="t('textarea_placeholder')" v-model="input" @keydown.prevent.enter="sendMessage"></textarea>
                  <div class="chatbot-bubble-input-send">
                    <div v-if="input.length>0" class="chatbot-bubble-input-clear" alt="" @click="clearInput">
                      <SearchIcon />
                    </div>
                    <div :class="{'send-btn': true, 'disabled': !input.length || loading}" @click="sendMessage">
                      <img src="../../assets/send.svg" alt="">
                    </div>
                  </div>
                </div>


                <div class="chatbot-bubble-input-select-area">
                  <div class="chatbot-bubble-input-select">
                    <Dropdown
                      v-model="selectedProject"
                      :options="projectOptions"
                      placeholder="请选择项目类型"
                      @change="handleProjectChange"
                    />
                  </div>
                </div>

              </div>
              
            </div>
          </div>
        </div>
      </teleport>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, onUnmounted, provide, ref, onBeforeUpdate, computed } from 'vue';
  import QA from './QA.vue';
  import Tips from './Tips.vue';
  import SearchIcon from './SearchIcon.vue'
  import { reset, state } from './chatStore';
  import { t } from '../../i18n';
  import { disableScroll, enableScroll } from '../../utils';
  import Dropdown from './DropDown.vue'; 

  const childRefs = ref<any[]>([]);
  const chatBoxRef = ref<HTMLDivElement | null>(null);

  // 在更新之前重置 childRefs 数组
  onBeforeUpdate(() => {
    childRefs.value = [];
  });
    
  export interface ChatItem {
    id: number;
    question: string;
    answer: string;
    context?:string;
  }

  export interface ChatOptions {
    url: string,
    key: string,
    tool?: boolean,
    inputs?: Record<string, any>
  }

  const props = withDefaults(defineProps<{
  options: ChatOptions;
}>(), {
  options: () => ({
    url: '',
    key: '',
    tool: false,
    inputs: {}
  })
});
  
  const lang = ref((window as any).o_chatbot_config?.lang || 'zh')
  const input = ref<string>('')
  const history = ref<ChatItem[]>([]);
  const isShow = ref(false);
  const loading = ref(false);
  const textarea = ref<HTMLTextAreaElement | null>(null);
  const chatbotWrapper = ref<HTMLDivElement | null>(null);
  const isSticky = ref(0);
  const isActive = ref(false);
  // const float = ref(false);
  const ifSupportDropFilter = ref(true);
  const showPopup = ref(true);
  const animationDuration = ref(0)
  // 最大化
  const isMaxSize = ref(false)

  // 下拉选择
  const selectedProject = ref<string>('0');
  const handleProjectChange = (option: any) => {
    console.log('Selected project:', option);
  };
  // 下拉选项
  const projectOptions = ref<any[]>([
    {
      label: '项目相关',
      value: '1'
    },
    {
      label: '项目无关',
      value: '0'
    }
  ])

  const apiOptions =  computed(() => {
    return {
      ...props.options,
      inputs: {
        ...props.options.inputs,
        project: selectedProject.value
      }
    }
  })
  
  let timeout: any = null;
  
  const scrollMethod = () => {
    if(chatbotWrapper && chatbotWrapper.value) {
        if(history.value.length) {
          chatbotWrapper.value.scrollTop = chatbotWrapper.value.scrollHeight;
        } else {
          isSticky.value = 0
          chatbotWrapper.value.scrollTop = 0
        }
      }
  }
  const scrollBottom = (custom?:number) => {
    timeout && clearTimeout(timeout)
    let time:number = 100
    if(custom) {
      time = custom
      return
    }
    timeout = setTimeout(scrollMethod, time)
  }
  
  const handleScroll = () => {
    const top = chatbotWrapper.value?.scrollTop
    isSticky.value = top? top : 0 
  }
  
  const handleReload = () => {
    history.value = [];
    isSticky.value = 0
    loading.value = false
    // 中断时记录答案
    // childRefs.value = []
    state.controller?.abort()
    if(chatbotWrapper && chatbotWrapper.value) {
      chatbotWrapper.value.scrollTop = 0
    }
    reset()
  }
  
  const handleSize = () => {
    isMaxSize.value = !isMaxSize.value
  }
  
  
  const clearInput = () => {
    input.value = '';
    // textarea.value?.blur();
  };
  
  const updateHistory = ({id, answer}: {id: number, answer: string}) => {
    loading.value = false
    history.value = history.value.map(item => item.id === id ? {...item, answer} : item)
  }
  
  const handleClick = () => {
    if(chatBoxRef.value) {
      if(chatBoxRef.value.classList.contains('dragging')) {
        return
      }
    }
    
    isActive.value = false;
    isShow.value = !isShow.value;
    if(isShow.value) {
      disableScroll()
      // setTimeout(() => {scrollBottom()})
    } else {
      enableScroll()
      if(loading.value) {
        closeXHR()
      }
    }
  };
  
  const closeXHR = () => {
    const n = [...history.value]
    const nItem = n.pop() as ChatItem
    nItem.answer = t('net_cancel')
    nItem.id = nItem.id + 1
    // 中断时记录答案
    // try {
    //   const answer = childRefs.value[n.length]?.getAnswer()
    //   nItem.answer = answer ? answer : t('net_cancel')
    // } catch (error) {
    //   nItem.answer = t('net_cancel')
    // }
    history.value = [...n, nItem]
    loading.value = false
    state.controller?.abort()
  }
  
  const sendMessage = async () => {
    if(loading.value) {
      return
    }
    const question = input.value;
    if(!question) {
      return
    }
    const chatItem = {
      id: history.value.length + 1,
      question,
      answer: ''
    }
    loading.value = true;
    history.value.push(chatItem);
    clearInput()
  };
  
  const addMessage = (message: string, context?: string) => {
    if(loading.value) {
      return
    }
    loading.value = true;
    history.value.push({
      id: history.value.length + 1,
      question: message,
      answer: '',
      context: context
    })
  }
  
  // let scrollCheckId:any;
  // function checkScroll() {
  //   isActive.value = false;
  //   clearTimeout(scrollCheckId)
  
  //   scrollCheckId = setTimeout(() => {
  //     isActive.value = true;
  //   }, 2000);
  // }
    
  onMounted(() => {
    if (!window.CSS.supports('backdrop-filter', 'blur(5px)')) {
      ifSupportDropFilter.value = false
    }
    setTimeout(() => {
      isActive.value = true;
      setTimeout(() => {
        isActive.value = false;
      }, 2000)
    }, 0)
    // window.addEventListener('scroll', checkScroll)
  })
  
  onUnmounted(() => {
    // window.removeEventListener('scroll', checkScroll)
  })
  
  provide('scrollBottom', scrollBottom)
  
  </script>
  
  
  <style >
  @import './style.css';

  /* 下拉样式 */

  </style>