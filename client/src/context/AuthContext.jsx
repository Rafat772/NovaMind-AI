import { useState, useEffect, useCallback } from "react";
import authService from "../services/authService";
import { AuthContext } from "./authContextInstance";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("novamind_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("novamind_token") || null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("novamind_token");
    localStorage.removeItem("novamind_user");
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    async function verifyAuth() {
      const savedToken = localStorage.getItem("novamind_token");
      if (savedToken) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
          localStorage.setItem("novamind_user", JSON.stringify(userData));
        } catch {
          // Token is invalid or expired
          logout();
        }
      }
      setIsLoading(false);
    }

    verifyAuth();
  }, [logout]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    const accessToken = data.access_token;
    const userData = data.user;

    localStorage.setItem("novamind_token", accessToken);
    if (userData) {
      localStorage.setItem("novamind_user", JSON.stringify(userData));
      setUser(userData);
    }
    setToken(accessToken);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    const accessToken = data.access_token;
    const registeredUser = data.user;

    localStorage.setItem("novamind_token", accessToken);
    if (registeredUser) {
      localStorage.setItem("novamind_user", JSON.stringify(registeredUser));
      setUser(registeredUser);
    }
    setToken(accessToken);
    return data;
  };

  const googleLogin = async (credential) => {
    const data = await authService.googleAuth(credential);
    const accessToken = data.access_token;
    const userData = data.user;

    localStorage.setItem("novamind_token", accessToken);
    if (userData) {
      localStorage.setItem("novamind_user", JSON.stringify(userData));
      setUser(userData);
    }
    setToken(accessToken);
    return data;
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    register,
    googleLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
