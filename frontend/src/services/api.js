import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
  refresh: () => api.post('/auth/refresh'),
}

// Users API
export const usersAPI = {
  getProfile: (username) => api.get(`/users/${username}`),
  updateProfile: (data) => api.put('/users/profile', data),
  follow: (username) => api.post(`/users/${username}/follow`),
  getFollowers: (username) => api.get(`/users/${username}/followers`),
  getFollowing: (username) => api.get(`/users/${username}/following`),
  search: (query) => api.get(`/users/search/${query}`),
}

// Posts API
export const postsAPI = {
  create: (data) => api.post('/posts', data),
  getFeed: (page = 1) => api.get(`/posts/feed?page=${page}`),
  getTrending: () => api.get('/posts/trending'),
  getPost: (postId) => api.get(`/posts/${postId}`),
  like: (postId) => api.post(`/posts/${postId}/like`),
  repost: (postId) => api.post(`/posts/${postId}/repost`),
  delete: (postId) => api.delete(`/posts/${postId}`),
  search: (query) => api.get(`/posts/search/${query}`),
}

// Upload API
export const uploadAPI = {
  image: (file) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  avatar: (file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  banner: (file) => {
    const formData = new FormData()
    formData.append('banner', file)
    return api.post('/upload/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}

export default api