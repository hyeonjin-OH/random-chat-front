import axios from "axios";

const serverURL = "http://54.180.62.214:8080"
const localURL = "http://localhost:8080"

export const instanceE =
  axios.create({
    baseURL: localURL,
    withCredentials: true,
  });


export const instance = (token) =>
  axios.create({
    baseURL: localURL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    withCredentials: true,
  });
