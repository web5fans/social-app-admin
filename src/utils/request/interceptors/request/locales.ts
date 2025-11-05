import { useI18nStore } from '@/store/i18n.ts';
import type { InternalAxiosRequestConfig } from 'axios'

export async function locales(config: InternalAxiosRequestConfig) {
  config.headers['Accept-Language'] = useI18nStore.getState().language;

  return config
}
