// import { history } from 'umi';
import type { AxiosError } from 'axios'
import useUserInfoStore from '@/store/userInfo'
// import redirectToLoginPage from '@/utils/redirectToLoginPage'
// import { Navigate } from '@/router'

const CODE_MAP: Record<number, string> = {
  401: '请登录',
}
function httpErrorHandler(error: AxiosError<API.Response>) {
  const status = error.request.status
  // 特殊状态码处理
  switch (status) {
    case 401:
      useUserInfoStore.getState().logout();
      break
  }

  return CODE_MAP[status!]
}

export default httpErrorHandler
