import { generateUniqueID } from "@/utils";
import { defineStore } from "pinia";

export const useUserStore = defineStore({
 id: 'user',
 state: () => ({
  id: generateUniqueID(),
  conversation_id: '',
  sticky: false,
 }),
 actions: {
  setConversationId(id: string) {
   this.conversation_id = id;
  },
  setSticky(payload: boolean) {
   this.sticky = payload;
  }
 }
})