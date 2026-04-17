import axios from 'axios'

// Since Vite proxies /api → localhost:5000, we just use /api
const api = axios.create({
  baseURL: '/api',
})

// Interceptor: attach token from localStorage on every request
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('smartpark_user')
  if (user) {
    const { token } = JSON.parse(user)
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
