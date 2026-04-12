import { createContext, useContext, useEffect, useRef, useState } from "react";
import { clearToken, getToken, saveToken } from "../utils/storage";

const AuthContext = createContext(null);

function decodeJwtPayload(token) {
  const parts = token.split(".");

  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function getExpiryMs(token) {
  const payload = decodeJwtPayload(token);

  if (!payload || typeof payload.exp !== "number") {
    return null;
  }

  return payload.exp * 1000;
}

function isExpired(token) {
  const expiryMs = getExpiryMs(token);

  return expiryMs !== null && expiryMs <= Date.now();
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const storedToken = getToken();

    if (!storedToken || isExpired(storedToken)) {
      clearToken();
      return null;
    }

    return storedToken;
  });
  const [loading, setLoading] = useState(true);
  const expiryTimerRef = useRef(null);

  useEffect(() => {
    const storedToken = getToken();

    if (!storedToken || isExpired(storedToken)) {
      clearToken();
      setToken(null);
      setLoading(false);
      return;
    }

    setToken(storedToken);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }

    if (!token) {
      return;
    }

    const expiryMs = getExpiryMs(token);

    if (!expiryMs) {
      return;
    }

    const remainingMs = expiryMs - Date.now();

    if (remainingMs <= 0) {
      clearToken();
      setToken(null);
      return;
    }

    expiryTimerRef.current = setTimeout(() => {
      clearToken();
      setToken(null);
    }, remainingMs);

    return () => {
      if (expiryTimerRef.current) {
        clearTimeout(expiryTimerRef.current);
      }
    };
  }, [token]);

  const login = (newToken) => {
    const nextToken = newToken.trim();

    if (!nextToken) {
      clearToken();
      setToken(null);
      return;
    }

    saveToken(nextToken);
    setToken(nextToken);
  };

  const logout = () => {
    clearToken();
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);