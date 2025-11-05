import { useEffect, useRef } from 'react'
import useUserInfoStore from '@/store/userInfo'
import storage from '@/utils/stroage';


type Option = {
  /**
   * 在本地还没有userInfo的前提下，拉取userInfo
   * - negotiation(默认): 有token才拉取
   * - true: 不管有没有token都拉取
   * - false: 不拉取
   */
  autoFetch?: boolean | 'negotiation'
  /** 强制在hooks加载的时候刷新 */
  reload?: boolean;
}

/**
 * useUserInfoStore 的二次封装，方便页面处理 read || request的逻辑
 * 原生组件可以通过 useUserInfoStore.getState().userInfo 获取用户信息
 */
export default function useCurrentUserInfo(opt: Option = { autoFetch: 'negotiation' }) {
  const { userInfo, fetchUserInfo, ...restAPI } = useUserInfoStore()
  const dataRef = useRef(userInfo)
  useEffect(() => {
    if (opt.reload) {
      fetchUserInfo()
      return;
    }
    if (!dataRef.current && opt.autoFetch) {
      if (opt.autoFetch === 'negotiation') {
        storage.getToken() && fetchUserInfo()
      }
      else { // autoFetch === true
        fetchUserInfo()
      }
    }
  }, [])

  return { userInfo, fetchUserInfo, ...restAPI }
}
