import axios from "axios";


export const instanceE =
  axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });


export const instance = (accessToken) =>
  axios.create({
    baseURL: "http://localhost:8080",
    headers: {
      Authorization: `${accessToken}`,
    },
    withCredentials: true,
  });
