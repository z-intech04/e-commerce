"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Lock, Mail, User, Phone, ShieldCheck, Sparkles, AlertCircle, LogIn, UserPlus } from "lucide-react";

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authMode, 
    setAuthMode, 
    login, 
    register, 
    authError, 
    setAuthError 
  } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (authMode === "login") {
      await login(email, password);
    } else {
      await register(name, email, password, phone);
    }
    setLoading(false);
  };

  const handleQuickFillParent = async () => {
    setEmail("parent@schoolofscholars.edu");
    setPassword("parent123");
    setLoading(true);
    await login("parent@schoolofscholars.edu", "parent123");
    setLoading(false);
  };

  const handleQuickFillAdmin = async () => {
    setEmail("admin@schoolofscholars.edu");
    setPassword("admin123");
    setLoading(true);
    await login("admin@schoolofscholars.edu", "admin123");
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Icon & Title */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-900 text-amber-300 flex items-center justify-center mx-auto mb-3 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {authMode === "login" ? "Sign In to Your Account" : "Register Parent / Student Account"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            School of Scholars Official Supply Portal Authentication
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              setAuthError("");
            }}
            className={`py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === "login"
                ? "bg-white text-blue-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("register");
              setAuthError("");
            }}
            className={`py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === "register"
                ? "bg-white text-blue-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Register New User
          </button>
        </div>

        {/* Error alert banner */}
        {authError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{authError}</span>
          </div>
        )}

        {/* Quick Demo Login Fillers */}
        {authMode === "login" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-5 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-1.5 font-extrabold text-amber-900 text-[11px]">
              <Sparkles className="w-4 h-4 text-amber-600" /> One-Click Quick Demo Sign In:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickFillParent}
                className="px-3 py-2 bg-white border border-amber-300 rounded-xl font-extrabold text-amber-900 hover:bg-amber-100 transition-all text-[11px] flex items-center justify-center gap-1"
              >
                <span>Parent Login</span>
              </button>
              <button
                type="button"
                onClick={handleQuickFillAdmin}
                className="px-3 py-2 bg-purple-900 text-white rounded-xl font-extrabold hover:bg-purple-800 transition-all text-[11px] flex items-center justify-center gap-1 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs font-medium">
          {authMode === "register" && (
            <div>
              <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@domain.com or admin@schoolofscholars.edu"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 font-semibold"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Password *</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 font-bold"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {authMode === "register" && (
            <div>
              <label className="block text-slate-700 font-bold mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-900 text-white font-extrabold rounded-xl shadow-md hover:bg-blue-800 transition-colors text-sm mt-2 flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : authMode === "login" ? "Sign In" : "Register Account"}
          </button>
        </form>

        <div className="mt-5 pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
          {authMode === "login" ? (
            <span>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setAuthError("");
                }}
                className="font-extrabold text-blue-900 hover:underline"
              >
                Register New Account
              </button>
            </span>
          ) : (
            <span>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
                className="font-extrabold text-blue-900 hover:underline"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
