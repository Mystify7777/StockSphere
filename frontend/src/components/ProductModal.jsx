import { useEffect, useState } from 'react'

const EMPTY_FORM = {
  name: '',
  sku: '',
  category: '',
  qty: 0,
  costPrice: 0,
  sellingPrice: 0,
  lowStockLimit: 5,
}

function ProductModal({ isOpen, mode, product, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    if (!isOpen) return
    if (product) {
      setForm({
        name: product.name,
        sku: product.sku,
        category: product.category,
        qty: product.qty,
        costPrice: Number(product.costPrice),
        sellingPrice: Number(product.sellingPrice),
        lowStockLimit: product.lowStockLimit,
      })
      return
    }
    setForm(EMPTY_FORM)
  }, [isOpen, product])

  if (!isOpen) return null

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit({
      ...form,
      qty: Number(form.qty),
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      lowStockLimit: Number(form.lowStockLimit),
    })
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div className="modal-card" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h3>{mode === 'edit' ? 'Edit Product' : 'Add Product'}</h3>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
          </label>
          <label>
            SKU
            <input value={form.sku} onChange={(e) => updateField('sku', e.target.value)} required />
          </label>
          <label>
            Category
            <input value={form.category} onChange={(e) => updateField('category', e.target.value)} required />
          </label>
          <label>
            Quantity
            <input type="number" min="0" value={form.qty} onChange={(e) => updateField('qty', e.target.value)} required />
          </label>
          <label>
            Cost Price
            <input type="number" min="0" step="0.01" value={form.costPrice} onChange={(e) => updateField('costPrice', e.target.value)} required />
          </label>
          <label>
            Selling Price
            <input type="number" min="0" step="0.01" value={form.sellingPrice} onChange={(e) => updateField('sellingPrice', e.target.value)} required />
          </label>
          <label>
            Low Stock Limit
            <input type="number" min="1" value={form.lowStockLimit} onChange={(e) => updateField('lowStockLimit', e.target.value)} required />
          </label>

          <div className="modal-actions">
            <button type="button" className="ghost" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductModal
