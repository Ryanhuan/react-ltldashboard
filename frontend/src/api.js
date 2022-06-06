import axios from "axios";
import { useState } from 'react';
import jwt_decode from 'jwt-decode'

const baseURL = "http://localhost:3001/";
// 從 localStorage 中獲取 token
const getToken = () => {
  const userToken = {'token':localStorage.getItem('token')};
  return userToken?.token
};

const resetToken = async (userToken) => {
   localStorage.removeItem('token');
   localStorage.setItem('token', JSON.stringify(userToken));
}

const removeToken = ()=>{
  localStorage.removeItem('token');
}

export default function useToken() {
  const [token, setToken] = useState(getToken());
  
  const saveToken = (userToken) => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };
  return {
    setToken: saveToken,
    token
  }
}


// 創建一個 axios 實例
export const instance  = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    authorization: getToken(), // headers 塞 token
  },
});
let isRefreshing = false;

//request
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["authorization"] = token;

      let _token= JSON.parse(token)
      let decodeRefreshToken = jwt_decode(_token.refreshToken);
      const { exp } = decodeRefreshToken;
      const nowTime = new Date().getTime();
      if(exp<=nowTime){
        removeToken();
        window.location.href= '/login';
        return;
      }

    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


//response
instance.interceptors.response.use(
  function (response) {
    // console.log(response);

    // Do something with response data
    return response;
  },
  async function (error) {
    if (error.response){
      switch (error.response.status) {
        case 401:
          if (!isRefreshing) {
            console.log('isRefreshingToken ')
            isRefreshing = true; 
            const originalRequest = error.config;
            console.log("401!! Unauthorized!")
            const resData = await instance.post("/auth/refreshToken");
            originalRequest.headers.authorization = JSON.stringify(resData.data.token);
            await resetToken(resData.data.token);
            this.setToken(resData.data.token);
            isRefreshing = false;
            return axios(originalRequest);
          }
          break;
        case 403:
          console.log("403!! Forbidden!")
          removeToken();
          window.location.href= '/login';
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


// [get] userId
export const getUserId =() =>{return JSON.parse(localStorage.getItem('userId'));}

// [post] signin
export const postLoginUser = async(data) => instance.post("/auth/signin", data).then((res) => res.data);

// [post] signup
export const postUserSignup = async(data) => instance.post("/api/signup", data).then((res) => res.data);

// [get] user info
export const getAllUsersInfo = async() => instance.get("/api/getAllUsers").then((res) => res.data);

// [post] user  edit
export const postUserEdit = async(data) => instance.post("/api/editUser", data).then((res) => res.data);

// [post] get code_type => return seq&desc
export const getSelectOption = async(data) => instance.post("/api/getSelectOption", data).then((res) => res.data);

// [post] insert mat data
export const insertMatData = async(data) => instance.post("/api/insertMatData", data).then((res) => res.data);

// [post] get mat data
export const getMatData = async(data) => instance.post("/api/getMatData", data).then((res) => res.data);
