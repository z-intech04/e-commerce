"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null when logged out
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'register'
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("sos_auth_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to load saved user session:", e);
    }
  }, []);

  const login = async (email, password) => {
    setAuthError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password })
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("sos_auth_user", JSON.stringify(data.user));
        setIsAuthModalOpen(false);
        setAuthError("");
        return { success: true };
      } else {
        setAuthError(data.message || "Invalid credentials.");
        return { success: false, message: data.message };
      }
    } catch (e) {
      setAuthError("Server connection error.");
      return { success: false, message: "Server connection error." };
    }
  };

  const register = async (name, email, password, phone = "") => {
    setAuthError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", name, email, password, phone })
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("sos_auth_user", JSON.stringify(data.user));
        setIsAuthModalOpen(false);
        setAuthError("");
        return { success: true };
      } else {
        setAuthError(data.message || "Registration failed.");
        return { success: false, message: data.message };
      }
    } catch (e) {
      setAuthError("Server connection error.");
      return { success: false, message: "Server connection error." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sos_auth_user");
  };

  // Helper method to guard actions: returns true if logged in, or opens AuthModal if not
  const requireAuth = (mode = "register", message = "Please register or sign in to continue.") => {
    if (!user) {
      setAuthMode(mode);
      setAuthError(message);
      setIsAuthModalOpen(true);
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        requireAuth,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        authError,
        setAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
