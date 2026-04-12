import { useMemo, useState } from 'react'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import Products from './pages/Products'
import './App.css'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('ss_token') || '')

  const apiBase = useMemo(() => {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  }, [])

  function handleTokenChange(value) {
    setToken(value)
    localStorage.setItem('ss_token', value)
  }

  return (
    <div className="app-shell">
      <header className="top-shell">
        <div>
          <p className="kicker">StockSphere</p>
          <h1>Product Management Console</h1>
        </div>

        <nav className="nav-links">
          <NavLink to="/products">Products</NavLink>
        </nav>

        <div className="token-box">
          <label htmlFor="token">Bearer Token</label>
          <textarea
            id="token"
            rows={3}
            value={token}
            onChange={(e) => handleTokenChange(e.target.value)}
            placeholder="Paste JWT token for authenticated API calls"
          />
          <small>API Base: {apiBase}</small>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<Products token={token.trim()} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
