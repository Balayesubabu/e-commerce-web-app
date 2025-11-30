// import axios from 'axios';

// const API = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
// });

// export function setAuthToken(token) {
//   if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   else delete API.defaults.headers.common['Authorization'];
// }

// export default API;


import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:5000/api", // use IPv4 loopback to avoid localhost IPv6 resolution issues
  withCredentials: true,
  timeout: 10000, // 10s timeout for dev
});

export function setAuthToken(token) {
  if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete API.defaults.headers.common['Authorization'];
}

export default API;
