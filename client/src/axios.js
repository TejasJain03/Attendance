import axios from "axios";

let instance;

if (import.meta.env.NODE_ENV === 'production') {
  instance = axios.create({
    baseURL: import.meta.env.SERVER_API_URL,
    withCredentials: true,
    timeout: 10000, // 10 seconds
  });
} else {
  instance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
    timeout: 10000, // 10 seconds
  });
}

export default instance;
