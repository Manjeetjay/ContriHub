import axios from 'axios'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080').replace(/\/+$/, '')

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  try {
    const raw = window.localStorage.getItem('contrihub.auth.session')
    const session = raw ? JSON.parse(raw) : null
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`
    }
  } catch {
    // ignore parse errors
  }
  return config
})

export function getErrorMessage(error) {
  const responsePayload = error?.response?.data

  if (typeof responsePayload?.message === 'string' && responsePayload.message.trim()) {
    return responsePayload.message
  }

  if (typeof responsePayload === 'string' && responsePayload.trim()) {
    return responsePayload
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}
