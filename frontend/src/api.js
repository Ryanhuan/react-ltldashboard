import axios from "axios";
import { useState } from 'react';
const baseURL = "http://localhost:3001/";
// 從 localStorage 中獲取 token
const getToken = () => {
  const userToken = {'token':localStorage.getItem('token')};
  return userToken?.token
};

const resetToken = (userToken)=>{
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
            originalRequest.headers.authorization = await JSON.stringify(resData.data.token);
            resetToken(resData.data.token);
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


// post signin
export const postLoginUser = async(postData) => instance.post("/auth/signin", postData).then((res) => res.data);

// post signup
export const postUserSignup = async(data) => instance.post("/api/signup", data).then((res) => res.data);

// get user info
export const getAllUsersInfo = async() => instance.get("/api/getAllUsers").then((res) => res.data);

// post user  edit
export const postUserEdit = async(data) => instance.post("/api/editUser", data).then((res) => res.data);
