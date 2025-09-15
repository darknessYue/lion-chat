<!-- Dropdown.vue -->
<template>
    <div class="dropdown" ref="dropdownRef">
      <div class="dropdown-header" @click="toggleDropdown">
        <div class="dropdown-selected">
          {{ selectedOption?.label || placeholder }}
        </div>
        <div class="dropdown-arrow" :class="{ open: isOpen }">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <transition name="slide-fade">
        <div v-show="isOpen" class="dropdown-list">
          <div 
            v-for="(option, index) in options" 
            :key="index"
            class="dropdown-item"
            :class="{ selected: isSelected(option) }"
            @click="selectOption(option)"
          >
            <slot name="option" :option="option">
              {{ option.label }}
            </slot>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  
  interface DropdownOption {
    label: string;
    value: any;
  }
  
  const props = withDefaults(defineProps<{
    modelValue?: any;
    options: DropdownOption[];
    placeholder?: string;
  }>(), {
    placeholder: '请选择',
    options: () => []
  });
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void;
    (e: 'change', value: DropdownOption): void;
  }>();
  
  const isOpen = ref(false);
  const dropdownRef = ref<HTMLElement | null>(null);
  
  const selectedOption = computed(() => {
    return props.options.find(option => option.value === props.modelValue);
  });
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };
  
  const selectOption = (option: DropdownOption) => {
    emit('update:modelValue', option.value);
    emit('change', option);
    isOpen.value = false;
  };
  
  const isSelected = (option: DropdownOption) => {
    return option.value === props.modelValue;
  };
  
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
      isOpen.value = false;
    }
  };
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
  </script>
  
  <style scoped>
  .dropdown {
    position: relative;
    width: 100%;
    font-size: 12px;
  }
  
  .dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: top;
    padding: 4px 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    cursor: pointer;
    transition: border-color 0.2s;
    background-color: #fff;
  }
  
  .dropdown-header:hover {
    border-color: #9ca3af;
  }
  
  .dropdown-selected {
    flex: 1;
    color: #374151;
  }
  
  .dropdown-arrow {
    transition: transform 0.2s;
    color: #6b7280;
    height: 12px;
    margin-top: 4px;
  }
  
  .dropdown-arrow.open {
    transform: rotate(180deg);
  }
  
  .dropdown-list {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    margin-bottom: 4px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background-color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 100;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .dropdown-item {
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .dropdown-item:hover {
    background-color: #f3f4f6;
  }
  
  .dropdown-item.selected {
    background-color: #eff6ff;
    color: #3b82f6;
  }
  
  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }
  
  .slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }
  
  .slide-fade-enter-from {
    transform: translateY(-10px);
    opacity: 0;
  }
  
  .slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }
  </style>