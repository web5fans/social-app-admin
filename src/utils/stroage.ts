


const ACCESS_TOKEN_STORE_KEY = '@xiangjiandao-admin:token';
// const REFRESH_TOKEN_STORE_KEY = 'refresh_token';

const storage = {
  getItem: localStorage.getItem.bind(localStorage),
  setItem: localStorage.setItem.bind(localStorage),
  removeItem: localStorage.removeItem.bind(localStorage),
  clear: localStorage.clear.bind(localStorage),
  setToken(accTokenVal: string) { // , refreshTokenVal: string
    localStorage.setItem(ACCESS_TOKEN_STORE_KEY, accTokenVal);
    // AuthUtils.syncToken(accTokenVal, refreshTokenVal);
  },
  getToken() {
    return localStorage.getItem(ACCESS_TOKEN_STORE_KEY);
  },
  // getRefreshToken() {
  //   return localStorage.getItem(REFRESH_TOKEN);
  // },
  removeToken() {
    localStorage.removeItem(ACCESS_TOKEN_STORE_KEY);
    // localStorage.removeItem(REFRESH_TOKEN);
    // AuthUtils.clearAuthToken();
  },
}

export default storage;