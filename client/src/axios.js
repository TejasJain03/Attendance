import axios from "axios";

const instance = axios.create({
  // baseURL:"https://attendance-server-psi.vercel.app/api",
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export default instance;
