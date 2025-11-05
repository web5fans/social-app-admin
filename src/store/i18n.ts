import { LANGUAGE, FALLBACK_LNG } from '@/i18n/settings.ts'
import createSelectors from "@/store/helper/createSelectors";
import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer';

export type I18nStore = {
  language: LANGUAGE
}

export type I18nStoreAction = {
  setLanguage: (language: LANGUAGE) => void
}

const searchParams = new URLSearchParams(window.location.search);
const lan = searchParams.has('lang') ? searchParams.get('lang')?.indexOf('zh') !== -1 ? LANGUAGE.zh_CN : LANGUAGE.en_US : undefined

export const useI18nStore = createSelectors(
  create(
    persist(
      subscribeWithSelector(
        immer<I18nStore & I18nStoreAction>(
          (set) => ({
            language: FALLBACK_LNG,

            setLanguage: (language) => {
              set((state) => {
                state.language = language
              })
            },
          })
        )
      ),
      // {
      //   name: 'i18n-store',
      //   storage: createJSONStorage(() => {
      //     const storeValue = localStorage.getItem('i18n-store')
      //     if (lan && storeValue) {
      //       const value = JSON.parse(storeValue)
      //       value.state.language = lan
      //       localStorage.setItem('i18n-store', JSON.stringify(value))
      //     }
      //
      //     return localStorage;
      //   }),
      // }
    )
  )
)
