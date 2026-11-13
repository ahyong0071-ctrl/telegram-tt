// src/api/translator.ts
const cache = new Map<string, string>();

export const SUPPORTED_LANGS = [
  { code: 'my', label: 'မြန်မာ' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'th', label: 'ไทย' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'hi', label: 'हिन्दी' },
];

let currentTarget = localStorage.getItem('translate_target') || 'my';

export function getTargetLang() {
  return currentTarget;
}

export function setTargetLang(code: string) {
  currentTarget = code;
  localStorage.setItem('translate_target', code);
  cache.clear(); 
}

export async function translateText(text: string): Promise<string> {
  if (!text || text.trim().length === 0) return '';
  const target = currentTarget;
  const key = `${target}:${text}`;
  if (cache.has(key)) return cache.get(key)!;

  // 1st: MyMemory (Free API, No Key Required)
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=autodetect|${target}`;
    const res = await fetch(url);
    const data = await res.json();
    const out = data?.responseData?.translatedText;
    if (out && !out.includes('MYMEMORY WARNING')) {
      cache.set(key, out);
      return out;
    }
  } catch { /* fallback */ }

  // 2nd: Lingva (Free Google Translate Proxy)
  try {
    const url = `https://lingva.ml/api/v1/auto/${target}/${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data?.translation) {
      cache.set(key, data.translation);
      return data.translation;
    }
  } catch { /* give up */ }

  return '';
}

