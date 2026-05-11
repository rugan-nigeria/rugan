import axios from 'axios'

export function getApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  if (!configuredBaseUrl) return '/api'

  const normalizedBaseUrl = configuredBaseUrl.replace(/\/+$/, '')
  return normalizedBaseUrl.endsWith('/api')
    ? normalizedBaseUrl
    : `${normalizedBaseUrl}/api`
}

export function resolveApiAssetUrl(url) {
  const rawUrl = String(url || '').trim()

  if (!rawUrl) return ''
  if (/^(?:[a-z]+:)?\/\//i.test(rawUrl) || rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) {
    return rawUrl
  }

  if (!rawUrl.startsWith('/')) {
    return rawUrl
  }

  const apiRoot = getApiBaseUrl().replace(/\/api\/?$/, '')

  if (/^https?:\/\//i.test(apiRoot)) {
    return `${apiRoot}${rawUrl}`
  }

  if (typeof window !== 'undefined') {
    return new URL(rawUrl, window.location.origin).toString()
  }

  return rawUrl
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const requestUrl = err.config?.url || ''

    const isLoginPage = ['/login', '/admin/login'].includes(window.location.pathname);
    if (
      err.response?.status === 401 &&
      requestUrl !== '/auth/login' &&
      !isLoginPage
    ) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
