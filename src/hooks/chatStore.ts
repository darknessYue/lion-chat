// src/store.js
import { generateUniqueID } from '@/utils';
import { reactive } from 'vue';

const state = reactive<{
  id: string,
  conversation_id: string,
  controller: AbortController | null
}>({
  id: generateUniqueID(),
  conversation_id: '',
  controller: null,
});

function setConversationId(id: string) {
  state.conversation_id = id;
}

function reset() {
  state.id = generateUniqueID();
  state.conversation_id = '';
}

function setController(payload: AbortController) {
  state.controller = payload;
}

export { state, setConversationId, reset, setController };
