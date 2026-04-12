import { useMemo, useState } from 'react'
import './App.css'

function App() {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState(null)

  const apiBase = useMemo(() => {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  }, [])

  async function fetchSummary() {
    if (!token.trim()) {
      setError('Paste a Bearer token first.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${apiBase}/dashboard/summary`, {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
        },
      })

      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Failed to fetch summary')
      }

      setSummary(payload.data)
    } catch (err) {
      setSummary(null)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      label: 'Total Products',
      value: summary?.totalProducts ?? '-',
      accent: 'teal',
    },
    {
      label: 'Low Stock Count',
      value: summary?.lowStockCount ?? '-',
      accent: 'orange',
    },
    {
      label: 'Inventory Value',
      value: summary ? `Rs ${Number(summary.inventoryValue).toLocaleString('en-IN')}` : '-',
      accent: 'blue',
    },
    {
      label: 'Potential Revenue',
      value: summary ? `Rs ${Number(summary.potentialRevenue).toLocaleString('en-IN')}` : '-',
      accent: 'green',
    },
    {
      label: 'Estimated Profit',
      value: summary ? `Rs ${Number(summary.estimatedProfit).toLocaleString('en-IN')}` : '-',
      accent: 'amber',
    },
  ]

  return (
    <div className="page">
      <header className="hero">
        <p className="kicker">StockSphere Dashboard</p>
        <h1>Inventory Intelligence</h1>
        <p className="subtext">
          Paste a JWT token and pull real-time metrics from
          {' '}
          <span>{apiBase}/dashboard/summary</span>
        </p>
      </header>

      <section className="panel">
        <label htmlFor="token" className="label">Bearer Token</label>
        <textarea
          id="token"
          rows={4}
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        />

        <div className="actions">
          <button type="button" onClick={fetchSummary} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Summary'}
          </button>
          {error ? <p className="error">{error}</p> : null}
        </div>
      </section>

      <section className="cards">
        {cards.map((card) => (
          <article key={card.label} className={`card ${card.accent}`}>
            <p className="metric-label">{card.label}</p>
            <p className="metric-value">{card.value}</p>
          </article>
        ))}
      </section>

      <footer className="footnote">
        <p>
          Tip: create shop and products first to see non-zero metrics.
        </p>
      </footer>
    </div>
  )
}

export default App
