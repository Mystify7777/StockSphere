const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

async function apiRequest(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  const payload = await response.json()
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Request failed')
  }
  return payload.data
}

export function getDashboardSummary(token) {
  return apiRequest('/dashboard/summary', { token })
}

export function getShops(token) {
  return apiRequest('/shops', { token })
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
