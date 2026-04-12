import { useEffect, useState } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from './components/Loader.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { loginWithCredentials, registerAccount } from './services/productApi'
import Products from './pages/Products'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const ROLE_MAP = {
  OWNER: 'ROLE_OWNER',
  STAFF: 'ROLE_STAFF',
  BUYER: 'ROLE_BUYER',
}

const ROLE_LABELS = {
  ROLE_OWNER: 'Owner',
  ROLE_STAFF: 'Staff',
  ROLE_BUYER: 'Buyer',
}

function AuthLanding() {
  const { isAuthenticated, loading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('login')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'OWNER',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [serverReady, setServerReady] = useState(false)
  const [serverChecking, setServerChecking] = useState(true)
  const [warmingUp, setWarmingUp] = useState(false)
  const [showSlowWakeHint, setShowSlowWakeHint] = useState(false)
  const hasPasswordMismatch =
    mode === 'register' &&
    registerForm.confirmPassword.length > 0 &&
    registerForm.password !== registerForm.confirmPassword

  async function checkServerHealth(applyState = true) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    try {
      const response = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        signal: controller.signal,
      })
      if (applyState) {
        setServerReady(response.ok)
      }
      return response.ok
    } catch {
      if (applyState) {
        setServerReady(false)
      }
      return false
    } finally {
      clearTimeout(timeoutId)
      if (applyState) {
        setServerChecking(false)
      }
    }
  }

  useEffect(() => {
    let mounted = true

    async function pingHealth() {
      try {
        const ready = await checkServerHealth(false)
        if (mounted) {
          setServerReady(ready)
          setServerChecking(false)
        }
      } catch {
        if (mounted) {
          setServerReady(false)
          setServerChecking(false)
        }
      }
    }

    pingHealth()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!serverReady && (serverChecking || warmingUp)) {
      const timeoutId = setTimeout(() => {
        setShowSlowWakeHint(true)
      }, 10000)

      return () => {
        clearTimeout(timeoutId)
      }
    }

    setShowSlowWakeHint(false)
  }, [serverReady, serverChecking, warmingUp])

  if (loading) {
    return (
      <div className="auth-panel">
        <Loader text="Restoring session..." />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/products" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (mode === 'register') {
      if (registerForm.password !== registerForm.confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    if (!serverReady) {
      setShowSlowWakeHint(false)
      setWarmingUp(true)
      toast.info('Free-tier backend waking up. First request may take 30-60 seconds.')

      try {
        const ready = await checkServerHealth()
        if (ready) {
          setServerReady(true)
        }
      } catch {
        setServerReady(false)
      } finally {
        setWarmingUp(false)
      }
    }

    setSubmitting(true)

    try {
      const authPayload =
        mode === 'login'
          ? await loginWithCredentials(loginForm)
          : await registerAccount({
              ...registerForm,
              role: ROLE_MAP[registerForm.role] || ROLE_MAP.STAFF,
            })

      await login(authPayload.token)
      toast.success(mode === 'login' ? 'Logged in' : 'Account created')
      navigate(location.state?.from?.pathname || '/products', { replace: true })
    } catch (err) {
      const message = err?.message || 'Authentication failed. Please check your inputs.'
      setError(message)
      if (err.status !== 401 && err.status !== 403) {
        toast.error(message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-panel">
      <div className="auth-layout">
        <aside className="auth-hero" aria-label="StockSphere highlights">
          <p className="kicker">StockSphere</p>
          <h2>Inventory clarity for teams that move fast.</h2>
          <p className="auth-copy">
            Keep stock healthy, spot low inventory early, and update products in seconds.
          </p>
          <ul className="auth-benefits">
            <li>Live stock visibility across shops</li>
            <li>Fast add, edit, and quantity updates</li>
            <li>Secure session handling with auto-expiry</li>
          </ul>
        </aside>

        <div className="auth-card">
          <p className="kicker">Account Access</p>
          <h3>{mode === 'login' ? 'Sign in to continue' : 'Create your account'}</h3>
          <div className={`server-status ${serverReady ? 'ready' : 'warming'}`}>
            <div className="server-status-line">
              {serverChecking ? 'Waking server...' : serverReady ? 'Server ready' : 'Backend waking up (free hosting). First request may take ~30 seconds.'}
            </div>
            {!serverReady ? (
              <button
                type="button"
                className="server-retry"
                onClick={() => {
                  setShowSlowWakeHint(false)
                  setServerChecking(true)
                  checkServerHealth()
                }}
                disabled={serverChecking || warmingUp}
              >
                {serverChecking ? 'Checking...' : 'Retry health check'}
              </button>
            ) : null}
            {showSlowWakeHint && !serverReady ? (
              <div className="server-slow-hint">Still waking up... free hosting cold starts can take up to a minute.</div>
            ) : null}
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Authentication tabs">
            <button
              type="button"
              className={mode === 'login' ? 'auth-tab active' : 'auth-tab'}
              onClick={() => {
                setMode('login')
                setError('')
              }}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'auth-tab active' : 'auth-tab'}
              onClick={() => {
                setMode('register')
                setError('')
              }}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' ? (
              <>
                <label htmlFor="register-name">Name</label>
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  value={registerForm.name}
                  onChange={(event) => setRegisterForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Your full name"
                  required
                />
              </>
            ) : null}

            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={mode === 'login' ? loginForm.email : registerForm.email}
              onChange={(event) => {
                const nextEmail = event.target.value
                if (mode === 'login') {
                  setLoginForm((prev) => ({ ...prev, email: nextEmail }))
                } else {
                  setRegisterForm((prev) => ({ ...prev, email: nextEmail }))
                }
              }}
              placeholder="you@example.com"
              required
            />

            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={mode === 'login' ? loginForm.password : registerForm.password}
              onChange={(event) => {
                const nextPassword = event.target.value
                if (mode === 'login') {
                  setLoginForm((prev) => ({ ...prev, password: nextPassword }))
                } else {
                  setRegisterForm((prev) => ({ ...prev, password: nextPassword }))
                }
              }}
              minLength={8}
              placeholder="At least 8 characters"
              required
            />

            {mode === 'register' ? (
              <>
                <label htmlFor="register-confirm-password">Confirm password</label>
                <input
                  id="register-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={registerForm.confirmPassword}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({
                      ...prev,
                      confirmPassword: event.target.value,
                    }))
                  }
                  minLength={8}
                  placeholder="Re-enter your password"
                  required
                />
                {hasPasswordMismatch ? <small className="field-hint error">Passwords do not match.</small> : null}

                <label htmlFor="register-role">Role</label>
                <select
                  id="register-role"
                  value={registerForm.role}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({
                      ...prev,
                      role: event.target.value,
                    }))
                  }
                >
                  <option value="OWNER">Owner</option>
                  <option value="BUYER">Buyer</option>
                </select>
              </>
            ) : null}

            <div className="auth-actions">
              <button type="submit" disabled={submitting || hasPasswordMismatch || warmingUp}>
                {submitting ? <Loader text="Please wait..." /> : mode === 'login' ? 'Login' : 'Create Account'}
              </button>
            </div>
          </form>

          {error ? <div className="error-box">{error}</div> : null}
        </div>
      </div>
    </section>
  )
}

function AppShell() {
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <div className="app-shell">
      <header className="top-shell">
        <div>
          <p className="kicker">StockSphere</p>
          <h1>Product Management Console</h1>
          <p className="shell-note">Auth persistence, protected routes, and inventory workflow in one place.</p>
        </div>

        {isAuthenticated ? (
          <nav className="nav-links">
            <NavLink to="/products">Products</NavLink>
          </nav>
        ) : (
          <div />
        )}

        <div className="shell-actions">
          {user ? (
            <small className="session-note">
              Welcome, {user.name} · {ROLE_LABELS[user.role] || user.role?.replace('ROLE_', '')}
            </small>
          ) : null}
          {isAuthenticated ? (
            <button type="button" className="ghost" onClick={logout}>
              Logout
            </button>
          ) : null}
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
          <Route path="*" element={<Navigate to={isAuthenticated ? '/products' : '/'} replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return <AppShell />
}

export default App
