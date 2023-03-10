import axios from "axios";
import jwt_decode from 'jwt-decode'

const baseURL = "http://localhost:3001/";
// 從 localStorage 中獲取 token
const getToken = () => {
  const userToken = { 'token': localStorage.getItem('token') };
  return userToken?.token
};

const resetToken = async (userToken) => {
  localStorage.removeItem('token');
  localStorage.setItem('token', JSON.stringify(userToken));
}

const removeToken = () => {
  localStorage.removeItem('token');
}

// 創建一個 axios 實例
export const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    authorization: getToken(), // headers 塞 token
  },
});

//request
instance.interceptors.request.use(
  (request) => {
    const token = getToken();
    if (token) {
      request.headers['authorization'] = token;
      let _token = JSON.parse(token)
      let decodeRefreshToken: any = jwt_decode(_token.refreshToken);
      const { exp } = decodeRefreshToken;
      const nowTime = new Date().getTime();
      if (exp <= nowTime) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
        return;
      }
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//response
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          const originalRequest = error.config;
          if (!originalRequest._retry) {
            try {
              console.log('isRefreshingToken')
              originalRequest._retry = true;
              // console.log("401!! Unauthorized!")
              const resData = await instance.post("/auth/refreshToken");
              originalRequest.headers['authorization'] = JSON.stringify(resData.data.token);
              await resetToken(resData.data.token);
              return axios(originalRequest);
            } catch (_error) {
              return Promise.reject(_error);
            }
          }
          break;
        case 403:
          console.log("403!! Forbidden!")
          removeToken();
          window.location.href = '/login';
          break

        case 404:
          console.log("你要找的頁面不存在")
          // go to 404 page
          break
        case 500:
          console.log("程式發生問題")
          // go to 500 page
          break
        default:
          console.log(error.message)
      }
    }
    if (!window.navigator.onLine) {
      alert("網路出了點問題，請重新連線後重整網頁");
      return;
    }
    return Promise.reject(error);
  }
);

// [post] 
export const postData = async (url: string, data?: any) => instance.post(url, data).then((res) => res.data);

// [get] 
export const getData = async (url: string) => instance.get(url).then((res) => res.data);

// get userId
export const getUserId = () => { return JSON.parse(localStorage.getItem('userId')); }


