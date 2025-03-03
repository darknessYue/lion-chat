
import { state, setConversationId, setController } from '../components/ChatLion/chatStore';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { t } from '../i18n';
import { ChatOptions } from '../components/ChatLion/ChatLion.vue';

export async function sse({payload, progress, end, onerror, options}: {options: ChatOptions,payload:string, progress: (data: string) => void, end: () => void, onerror?: (err: any) => void}) {
   
  const controller = new AbortController();
  const signal = controller.signal
  setController(controller)
  let str: string  = ''
  let tool: string = ''
  let tool_input:string = ''
  let tool_mark = false
  await fetchEventSource(options.url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + options.key
      },
      body: JSON.stringify({
        "inputs": {},
        "query": payload + t('sse_context'),
        "response_mode": "streaming",
        "conversation_id": state.conversation_id,
        "user": state.id,
        "files": []
      }),
      signal: signal,
      openWhenHidden: true,
      async onopen() {
        // console.log('sse', controller, state.controller)
      },
      onmessage(ev) {
        
        try {
          const msg = JSON.parse(ev.data);
          if(!tool_mark && tool && tool_input) {
            tool_mark = true
            if(options.tool) {
              console.table([
                {
                  name: '问题',
                  value: payload
                },
                {
                  name: '工具名',
                  value: tool
                },
                {
                  name: '工具参数',
                  value: tool_input
                }
              ])
            }
          }
          if(msg['conversation_id'] && !state.conversation_id) {
            setConversationId(msg['conversation_id'])
          }
          if(msg && msg['event'] === 'agent_message') {
            progress(msg['answer'])
            str+= msg['answer']
          }
          if(msg && msg['event'] === 'agent_thought') {
            if(msg['tool']) {
              tool = msg['tool']
            }
            if(msg['tool_input']) {
              tool_input = msg['tool_input']
            }
          }
          if(msg && msg['event'] === 'message_end') {
            
            if(options.tool) {
              console.log(str)
            }
            end()
            controller.abort()
          }
        }  catch(e) {}
      },
      onerror(err) {
        onerror && onerror(err)
        throw err;
      }
  });

}