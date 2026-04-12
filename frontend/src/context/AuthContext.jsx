import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { clearToken, getToken, saveToken } from "../utils/storage";
import { getCurrentUser, setUnauthorizedHandler } from "../services/productApi";

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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const expiryTimerRef = useRef(null);

  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
  };

  const expireSession = () => {
    clearToken();
    setToken(null);
    setUser(null);
    toast.error("Session expired. Please login again.");
  };

  const fetchCurrentUser = async (nextToken = getToken()) => {
    if (!nextToken) {
      return null;
    }

    try {
      const currentUser = await getCurrentUser(nextToken);
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      logout();
      throw error;
    }
  };

  useEffect(() => {
    setUnauthorizedHandler(expireSession);

    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  useEffect(() => {
    fetchCurrentUser().finally(() => setLoading(false));
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

  const login = async (newToken) => {
    const nextToken = newToken.trim();

    if (!nextToken) {
      logout();
      return null;
    }

    saveToken(nextToken);
    setToken(nextToken);
    return fetchCurrentUser(nextToken);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setUser,
        isAuthenticated: !!token,
        loading,
        login,
        fetchCurrentUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);