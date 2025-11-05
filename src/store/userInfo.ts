// import { globalEventBus } from '@/utils/EventBus';
import { create } from 'zustand'
import createSelectors from '@/store/helper/createSelectors'
import server from '@/server'
import throttle from 'lodash/throttle'
import storage from '@/utils/stroage'


interface UserInfoStore {
  token?: string;
  userInfo: APIDao.WebApplicationVoAdminUserDataVo | null
  fetchUserInfo: ReturnType<typeof throttle<() => Promise<void>>>
  logout: () => void
  login: (authInfo: APIDao.WebUtilsTokenVo) => Promise<void>
  // checkAndGetUserInfo: () => UserInfoStore['userInfo'];
}

const useUserInfoStore = createSelectors(
  create<UserInfoStore>((set, get) => ({
    token: storage.getToken() ?? '',
    userInfo: null,
    fetchUserInfo: throttle(async () => {
      const userInfo = await server.dao('POST /admin/admin-user/login-user-detail');
      set(() => ({ userInfo }))
    }, 1000, { leading: true, trailing: false }),
    logout: () => {
      storage.removeToken();
      set(() => ({ userInfo: null, token: '' }))
    },
    /**
     * 包含登录需要的固定执行的操作
     */
    login: async (authInfo: APIDao.WebUtilsTokenVo) => {
      // author.set(authInfo)
      storage.setToken(authInfo.accessToken!)
      set(() => ({ token: authInfo.accessToken }))
      await get().fetchUserInfo()
      // globalEventBus.publish("user-logged");
    },
    // checkAndGetUserInfo: () => {
    //   if (get().userInfo) {
    //     return get().userInfo;
    //   } else {
    //     Taro.navigateTo({ url: '/pages/login/login' });
    //     return null;
    //   }
    // }
  })),
)

export default useUserInfoStore
