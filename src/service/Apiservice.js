import { API_BASE_URL } from "../app-config";
import * as SecureStore from "expo-secure-store";

export const ACCESS_TOKEN = "ACCESS_TOKEN";

export async function call(api, method, request) {
  let headers = new Headers({
    "Content-Type": "application/json",
  });

  // 시큐어 스토리지에서 ACCESS TOKEN 가져오기
  const accessToken = SecureStore.getItem(ACCESS_TOKEN);
  if (accessToken && accessToken !== null) {
    headers.append("Authorization", "Bearer " + accessToken);
  }

  let options ={
    headers: headers,
    url: API_BASE_URL + api,
    method: method,
  };

  if (request) {
    options.body = JSON.stringify(request);
  }

  return await fetch(options.url, options)
  .then((response) => response.json().then((json) => {
    if(!response.ok){
        return Promise.reject(json);
    }
    return json;
  })).catch((error) => {
    console.log(error.status);
    if (error.status === 403) {
        //redirection
    }
    return Promise.reject(error);
  })
}

export async function signin(userDTO) {
  return call("/auth/signin","POST", userDTO)
  .then((response) => {
    if (response.token) {
        SecureStore.setItem(ACCESS_TOKEN, response.token);
        SecureStore.setItem("userId", response.userId);
        const exp = new Date();
        SecureStore.setItem("exp", exp.getTime().toString());
        console.log(response.token);
        console.log(response.userId);
        console.log("saved token");
    }
  })
}


export function signup(userDTO) {
    return call("/auth/signup", "POST", userDTO);
}

export function signout() {

    SecureStore.deleteItemAsync(ACCESS_TOKEN);
    // redirection
}