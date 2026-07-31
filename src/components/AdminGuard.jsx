"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, Lock, LogIn } from "lucide-react";

export default function AdminGuard({ children }) {
  const { user, setIsAuthModalOpen, setAuthMode } = useAuth();

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-purple-100 text-purple-900 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8 text-purple-700" />
        </div>

        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Administrator Portal Access Restricted
        </h2>

        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          The page you are trying to access requires administrator authentication. Please log in with a School Administrator account to manage inventory and orders.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => {
              setAuthMode("login");
              setIsAuthModalOpen(true);
            }}
            className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl font-black text-xs shadow-md transition-all flex items-center gap-2"
          >
            <LogIn className="w-4 h-4 text-amber-300" /> Sign In as Admin
          </button>
        </div>
      </div>
    );
  }

  return children;
}
