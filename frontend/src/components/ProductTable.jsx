function currency(amount) {
  return `Rs ${Number(amount || 0).toLocaleString('en-IN')}`
}

function statusLabel(product) {
  if (product.qty === 0) return { text: 'Out of Stock', type: 'danger' }
  if (product.qty <= product.lowStockLimit) return { text: 'Low Stock', type: 'warn' }
  return { text: 'Healthy', type: 'ok' }
}

function ProductTable({ products, onEdit, onDelete, onAdjustStock }) {
  if (!products.length) {
    return <div className="empty-state">No products yet. Add your first inventory item.</div>
  }

  return (
    <div className="table-wrap">
      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Cost</th>
            <th>Sell</th>
            <th>Margin</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const status = statusLabel(product)
            const margin = Number(product.sellingPrice) - Number(product.costPrice)
            return (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.category}</td>
                <td>{product.qty}</td>
                <td>{currency(product.costPrice)}</td>
                <td>{currency(product.sellingPrice)}</td>
                <td>{currency(margin)}</td>
                <td>
                  <span className={`badge ${status.type}`}>{status.text}</span>
                </td>
                <td>
                  <div className="row-actions">
                    <button type="button" onClick={() => onEdit(product)} className="mini">Edit</button>
                    <button type="button" onClick={() => onDelete(product)} className="mini danger">Delete</button>
                    <button type="button" onClick={() => onAdjustStock(product, 1)} className="mini">+1</button>
                    <button type="button" onClick={() => onAdjustStock(product, 5)} className="mini">+5</button>
                    <button type="button" onClick={() => onAdjustStock(product, -1)} className="mini">-1</button>
                    <button type="button" onClick={() => onAdjustStock(product, -5)} className="mini">-5</button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable
