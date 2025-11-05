import type { InternalAxiosRequestConfig } from 'axios'
import storage from '@/utils/stroage'

export async function authorization(config: InternalAxiosRequestConfig) {
  const { useAuth = true } = config

  if (useAuth) {
    const token = storage.getToken()
    if (token)
      config.headers.Authorization = token
  }

  return config
}
