import axios from 'axios';

const instance = axios.create({
  baseURL:"https://attendance-server-psi.vercel.app/api",
  withCredentials: true,
});

export default instance;
