import axios from 'axios'
import { getToken } from './auth'

const api = axios.create({
  baseURL: 'http://127.0.0.1:3333',
  timeout: 5000,
})


api.interceptors.request.use(async config => {
  console.log('*** config', config)
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // console.log('config', config)
  return config
})

axios.interceptors.response.use(response => {
  console.log('*** response', response)
  return response
}, error => {
  console.log('*** response-error', error)
  if (error.response.status === 401) {
    error.status = 401
  }
  return error
})

axios.interceptors.response.use(undefined, err => {
  console.log('*** undefined', undefined, err)
  const error = err.response
  error.status = 401
  // if error is 401 
  if (error.status === 401 && error.config &&
    !error.config.__isRetryRequest) {
    // request for a new token
  }
})

const UNAUTHORIZED = 401
axios.interceptors.response.use(response => response, error => {
  console.log('*** response-2', error)
  const { status } = error.response
  if (status === UNAUTHORIZED) {
    error.response.status = 401
  }
  return Promise.reject(error)
})

export default api
