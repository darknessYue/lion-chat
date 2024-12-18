import en from './en';
import zh from './zh';

type langType = 'en' | 'zh';
const messages: Record<langType, any> = {
  en,
  zh
};

let currentLang:langType = 'zh';

export function setLanguage(lang:langType) {
  if (messages[lang]) {
    currentLang = lang;
  }
}

export function t(key: string) {
  return messages[currentLang][key] || '';
}
