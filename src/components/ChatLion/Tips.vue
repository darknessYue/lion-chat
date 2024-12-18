<template>
  <div class="o-tips">
    <img class="o-tips__img" src="../../assets/lion-default.png" alt="">
    <div class="o-tips__context">
      <div class="o-tips__context-inner">
        <div class="o-tips__context-inner-title">{{ t('frame_title') }}</div>
        <div class="o-tips__context-inner-desc">
          {{ t('frame_desc_1') }}<span>{{ t('frame_desc_2') }}</span>{{ t('frame_desc_3') }}
        </div>
        <!-- <div class="o-tips__context-inner-list">
          <ul>
            <li>
              <a href="javascript:;" @click="handleClick(t('frame_q_1'))">
                <div class="tips__context-inner-imgbox">
                  <img src="../../assets/icon-agent.png" alt="">
                </div>
                <span>{{ t('frame_q_1') }}</span>
              </a>
            </li>
            <li>
              <a href="javascript:;" @click="handleClick(t('frame_q_2'))">
                <div class="tips__context-inner-imgbox">
                  <img src="../../assets/icon-guest.png" alt="">
                </div>
                <span>{{ t('frame_q_2') }}</span>
              </a>
            </li>
            <li>
              <a href="javascript:;" @click="handleClick(t('frame_q_3'))">
                <div class="tips__context-inner-imgbox">
                  <img src="../../assets/icon-register.png" alt="">
                </div>
                <span>{{ t('frame_q_3') }}</span>
              </a>
            </li>
            <li>
              <a href="javascript:;" @click="handleClick(t('frame_q_4'))">
                <div class="tips__context-inner-imgbox">
                  <img src="../../assets/icon-location.png" alt="">
                </div>
                <span>{{ t('frame_q_4') }}</span>
              </a>
            </li>
          </ul>
        </div> -->
        <div class="o-tip__msg" v-if="t('frame_desc_4')">
          {{ t('frame_desc_4') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['add'])
import { t } from '../../i18n/index';
// const handleClick = (msg: string) => {
//   emit('add', msg, 'OTF2024,')
// }
</script>
