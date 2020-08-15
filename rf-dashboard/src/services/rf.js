import axios from 'axios'
import { getToken } from './auth'

const prot = window.location.protocol

const api = axios.create({
  baseURL: `${prot}//www.retornofacil.com.br:3333`,
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
