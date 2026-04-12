import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import ProductModal from '../components/ProductModal'
import ProductTable from '../components/ProductTable'
import { useAuth } from '../context/AuthContext'
import {
  createShop,
  createProduct,
  deleteProduct,
  getDashboardSummary,
  getProducts,
  getShops,
  patchStock,
  updateProduct,
} from '../services/productApi'

function Products() {
  const { token } = useAuth()
  const [shops, setShops] = useState([])
  const [selectedShopId, setSelectedShopId] = useState('')
  const [products, setProducts] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [sort, setSort] = useState('')

  const [modalState, setModalState] = useState({ open: false, mode: 'add', product: null })
  const [saving, setSaving] = useState(false)
  const [shopModalOpen, setShopModalOpen] = useState(false)
  const [creatingShop, setCreatingShop] = useState(false)
  const [shopForm, setShopForm] = useState({ name: '', publicStatus: false })

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((item) => item.category))).sort()
  }, [products])

  useEffect(() => {
    if (!token) return

    async function loadShopsAndSummary() {
      setError('')
      try {
        const [shopData, summaryData] = await Promise.all([
          getShops(token),
          getDashboardSummary(token),
        ])
        setShops(shopData)
        setSummary(summaryData)
        if (shopData.length && !selectedShopId) {
          setSelectedShopId(shopData[0].id)
        }
      } catch (err) {
        setError(err.message)
        if (err.status !== 401 && err.status !== 403) {
          toast.error(err.message)
        }
      }
    }

    loadShopsAndSummary()
  }, [token])

  useEffect(() => {
    if (!token || !selectedShopId) return

    async function loadProducts() {
      setLoading(true)
      setError('')
      try {
        const data = await getProducts(token, {
          shopId: selectedShopId,
          search,
          category,
          lowStockOnly,
          sort,
        })
        setProducts(data)
      } catch (err) {
        setError(err.message)
        if (err.status !== 401 && err.status !== 403) {
          toast.error(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [token, selectedShopId, search, category, lowStockOnly, sort])

  async function refreshAll() {
    if (!token) return
    const summaryData = await getDashboardSummary(token)
    setSummary(summaryData)

    if (!selectedShopId) {
      setProducts([])
      return
    }

    const productData = await getProducts(token, {
      shopId: selectedShopId,
      search,
      category,
      lowStockOnly,
      sort,
    })
    setProducts(productData)
  }

  async function handleCreateShop(event) {
    event.preventDefault()

    if (!shopForm.name.trim()) {
      setError('Shop name is required.')
      toast.error('Shop name is required.')
      return
    }

    setCreatingShop(true)
    setError('')

    try {
      const created = await createShop(token, {
        name: shopForm.name.trim(),
        publicStatus: shopForm.publicStatus,
      })

      const updatedShops = await getShops(token)
      setShops(updatedShops)
      setSelectedShopId(created.id)
      setShopModalOpen(false)
      setShopForm({ name: '', publicStatus: false })
      toast.success('Shop created')
      await refreshAll()
    } catch (err) {
      setError(err.message)
      if (err.status !== 401 && err.status !== 403) {
        toast.error(err.message)
      }
    } finally {
      setCreatingShop(false)
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(`Delete ${product.name}?`)
    if (!confirmed) return

    try {
      await deleteProduct(token, product.id)
      await refreshAll()
      toast.success('Product deleted')
    } catch (err) {
      setError(err.message)
      if (err.status !== 401 && err.status !== 403) {
        toast.error(err.message)
      }
    }
  }

  async function handleAdjust(product, delta) {
    try {
      await patchStock(token, product.id, delta)
      await refreshAll()
      toast.success('Stock updated')
    } catch (err) {
      setError(err.message)
      if (err.status !== 401 && err.status !== 403) {
        toast.error(err.message)
      }
    }
  }

  function openAddModal() {
    setModalState({ open: true, mode: 'add', product: null })
  }

  function openEditModal(product) {
    setModalState({ open: true, mode: 'edit', product })
  }

  function closeModal() {
    setModalState({ open: false, mode: 'add', product: null })
  }

  async function handleModalSubmit(formData) {
    if (!selectedShopId) {
      setError('Select a shop before saving products.')
      toast.error('Select a shop before saving products.')
      return
    }

    setSaving(true)
    setError('')
    try {
      if (modalState.mode === 'edit' && modalState.product) {
        await updateProduct(token, modalState.product.id, formData)
        toast.success('Product updated')
      } else {
        await createProduct(token, {
          ...formData,
          shopId: selectedShopId,
        })
        toast.success('Product added')
      }
      closeModal()
      await refreshAll()
    } catch (err) {
      setError(err.message)
      if (err.status !== 401 && err.status !== 403) {
        toast.error(err.message)
      }
    } finally {
      setSaving(false)
    }
  }

  const statCards = [
    { label: 'Total Products', value: summary?.totalProducts ?? '-' },
    { label: 'Low Stock Items', value: summary?.lowStockCount ?? '-' },
    { label: 'Inventory Value', value: summary ? `Rs ${Number(summary.inventoryValue).toLocaleString('en-IN')}` : '-' },
    { label: 'Expected Profit', value: summary ? `Rs ${Number(summary.estimatedProfit).toLocaleString('en-IN')}` : '-' },
  ]

  if (!token) {
    return <EmptyState text="Session expired. Sign in again to use Products." />
  }

  return (
    <div className="products-page">
      <section className="stats-row">
        {statCards.map((card) => (
          <article className="stat-card" key={card.label}>
            <p>{card.label}</p>
            <h3>{card.value}</h3>
          </article>
        ))}
      </section>

      <section className="controls-row">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={selectedShopId} onChange={(e) => setSelectedShopId(e.target.value)}>
          <option value="">Select shop</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>{shop.name}</option>
          ))}
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Newest</option>
          <option value="qtyAsc">Qty asc</option>
          <option value="qtyDesc">Qty desc</option>
          <option value="profit">Profit</option>
        </select>

        <label className="toggle">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />
          Low stock only
        </label>

        <button type="button" onClick={openAddModal}>Add Product</button>
      </section>

      {error ? <div className="error-box">{error}</div> : null}
      {loading ? <Loader text="Loading products..." /> : null}

      {!loading && !shops.length ? (
        <div className="empty-state">
          <p>No shops yet. Create your first shop to begin inventory management.</p>
          <div className="auth-actions">
            <button type="button" onClick={() => setShopModalOpen(true)}>
              Create Shop
            </button>
          </div>
        </div>
      ) : null}

      {!loading && selectedShopId ? (
        <ProductTable
          products={products}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onAdjustStock={handleAdjust}
        />
      ) : null}

      {!loading && selectedShopId && !products.length ? (
        <EmptyState text="No products yet. Add your first product." />
      ) : null}

      <ProductModal
        isOpen={modalState.open}
        mode={modalState.mode}
        product={modalState.product}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        saving={saving}
      />

      {shopModalOpen ? (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Create shop">
          <div className="modal-card">
            <h3>Create your first shop</h3>
            <form className="modal-form" onSubmit={handleCreateShop}>
              <label>
                Shop name
                <input
                  type="text"
                  value={shopForm.name}
                  onChange={(event) =>
                    setShopForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="My Main Store"
                  required
                />
              </label>

              <label>
                Visibility
                <select
                  value={shopForm.publicStatus ? 'public' : 'private'}
                  onChange={(event) =>
                    setShopForm((prev) => ({
                      ...prev,
                      publicStatus: event.target.value === 'public',
                    }))
                  }
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" className="ghost" onClick={() => setShopModalOpen(false)} disabled={creatingShop}>
                  Cancel
                </button>
                <button type="submit" disabled={creatingShop}>
                  {creatingShop ? <Loader text="Creating..." /> : 'Create Shop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Products
