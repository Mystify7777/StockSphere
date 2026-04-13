const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

async function apiRequest(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  let payload = null

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if ((response.status === 401 || response.status === 403) && unauthorizedHandler) {
    unauthorizedHandler()
  }

  if (!response.ok || !payload?.success) {
    const error = new Error(payload?.message || 'Request failed')
    error.status = response.status
    throw error
  }
  return payload.data
}

export function getCurrentUser(token) {
  return apiRequest('/auth/me', { token })
}

export function loginWithCredentials(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
  })
}

export function registerAccount(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export function getDashboardSummary(token) {
  return apiRequest('/dashboard/summary', { token })
}

export function getShops(token) {
  return apiRequest('/shops', { token })
}

export function createShop(token, payload) {
  return apiRequest('/shops', {
    method: 'POST',
    token,
    body: payload,
  })
}

export function updateShop(token, shopId, payload) {
  return apiRequest(`/shops/${shopId}`, {
    method: 'PUT',
    token,
    body: payload,
  })
}

export function deleteShop(token, shopId) {
  return apiRequest(`/shops/${shopId}`, {
    method: 'DELETE',
    token,
  })
}

export function getProducts(token, { shopId, search, category, lowStockOnly, sort }) {
  const params = new URLSearchParams()
  params.set('shopId', shopId)
  if (search) params.set('search', search)
  if (category) params.set('category', category)
  if (lowStockOnly) params.set('lowStockOnly', 'true')
  if (sort) params.set('sort', sort)

  return apiRequest(`/products?${params.toString()}`, { token })
}

export function createProduct(token, product) {
  return apiRequest('/products', {
    method: 'POST',
    token,
    body: product,
  })
}

export function updateProduct(token, productId, product) {
  return apiRequest(`/products/${productId}`, {
    method: 'PUT',
    token,
    body: product,
  })
}

export function deleteProduct(token, productId) {
  return apiRequest(`/products/${productId}`, {
    method: 'DELETE',
    token,
  })
}

export function patchStock(token, productId, delta) {
  return apiRequest(`/products/${productId}/stock`, {
    method: 'PATCH',
    token,
    body: { delta },
  })
}

export function getStockMovements(token, shopId) {
  const params = new URLSearchParams()
  params.set('shopId', shopId)

  return apiRequest(`/stock-movements?${params.toString()}`, { token })
}
