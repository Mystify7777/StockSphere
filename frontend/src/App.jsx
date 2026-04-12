import { useEffect, useMemo, useState } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useAuth } from './context/AuthContext.jsx'
import Products from './pages/Products'
import './App.css'

function AuthLanding() {
  const { isAuthenticated, loading, login, token } = useAuth()
  const apiBase = useMemo(() => {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  }, [])
  const navigate = useNavigate()
  const location = useLocation()
  const [draftToken, setDraftToken] = useState(token || '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setDraftToken(token || '')
  }, [token])

  if (loading) {
    return <div className="auth-panel">Restoring session...</div>
  }

  if (isAuthenticated) {
    return <Navigate to="/products" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const nextToken = draftToken.trim()

    if (!nextToken) {
      setError('Paste a valid token to continue.')
      return
    }

    setSubmitting(true)

    try {
      await login(nextToken)
      navigate(location.state?.from?.pathname || '/products', { replace: true })
    } catch {
      setError('Token rejected. Session cleared.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-panel">
      <div className="auth-card">
        <p className="kicker">Secure Session</p>
        <h2>Restore your StockSphere session</h2>
        <p className="auth-copy">
          Paste a valid JWT to keep the dashboard and products area open after refresh.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="auth-token">JWT token</label>
          <textarea
            id="auth-token"
            rows={4}
            value={draftToken}
            onChange={(event) => setDraftToken(event.target.value)}
            placeholder="Paste your bearer token here"
          />

          <div className="auth-actions">
            <button type="submit" disabled={submitting}>{submitting ? 'Restoring...' : 'Continue'}</button>
          </div>
        </form>

        {error ? <div className="error-box">{error}</div> : null}

        <small className="auth-meta">API Base: {apiBase}</small>
      </div>
    </section>
  )
}

function AppShell() {
  const { isAuthenticated, loading, logout, user } = useAuth()
  const apiBase = useMemo(() => {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  }, [])

  return (
    <div className="app-shell">
      <header className="top-shell">
        <div>
          <p className="kicker">StockSphere</p>
          <h1>Product Management Console</h1>
          <p className="shell-note">Auth persistence, protected routes, and inventory workflow in one place.</p>
        </div>

        <nav className="nav-links">
          <NavLink to="/products">Products</NavLink>
        </nav>

        <div className="shell-actions">
          <span className={`session-pill ${isAuthenticated ? 'active' : 'inactive'}`}>
            {loading ? 'Session loading' : isAuthenticated ? 'Session active' : 'Signed out'}
          </span>
          {user ? (
            <small className="session-note">
              Welcome, {user.name} · {user.role}
            </small>
          ) : null}
          <small className="session-note">API Base: {apiBase}</small>
          {isAuthenticated ? (
            <button type="button" className="ghost" onClick={logout}>
              Logout
            </button>
          ) : (
            <small className="session-note">Sign in from the home screen</small>
          )}
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<AuthLanding />} />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return <AppShell />
}

export default App
