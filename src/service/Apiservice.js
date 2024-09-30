import { API_BASE_URL } from "../app-config";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN = "ACCESS_TOKEN";

export async function call(api, method, request) {
  let options ={
    headers: new Headers({
        "Content-Type": "application/json",
    }),
    url: API_BASE_URL + api,
    method: method,
  };


  // 시큐어 스토리지에서 ACCESS TOKEN 가져오기
  const accessToken = SecureStore.getItem(ACCESS_TOKEN);
  if (accessToken && accessToken !== null) {
    headers.append("Authorization", "Bearer " + accessToken);
  }

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

export function signin(userDTO) {
  console.log("token");
  return call("/auth/signin","POST", userDTO)
  .then((response) => {
    if (response.token) {
        SecureStore.setItem(ACCESS_TOKEN, response.token);
        console.log(response.token);
        console.log("saved token");
        // redirection

    }
  })
}

export function signup(userDTO) {
    return call("/auth/signup", "POST", userDTO);
}

export function signout() {

    SecureStore.setItem(ACCESS_TOKEN, null);
    // redirection
}