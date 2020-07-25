import axios from 'axios'
import { getToken } from './auth'

const api = axios.create({
  baseURL: 'http://31.220.50.222:3333',
  timeout: 5000,
})


api.interceptors.request.use(async config => {
  // console.log('*** config', config)
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // console.log('*** config', config)
  return config
})

export default api
