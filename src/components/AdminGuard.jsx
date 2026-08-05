"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, Lock, LogIn } from "lucide-react";

export default function AdminGuard({ children }) {
  const { user, setIsAuthModalOpen, setAuthMode } = useAuth();

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-purple-100 text-purple-900 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8 text-purple-700" />
        </div>

        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Administrator Portal Access Restricted
        </h2>

        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          The page you are trying to access requires administrator credentials. Please sign in with an authorized store admin account.
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

  if (user.status === "paused") {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-amber-50 rounded-3xl border border-amber-300 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-amber-200 text-amber-950 rounded-full flex items-center justify-center mx-auto shadow-inner border border-amber-400">
          <ShieldAlert className="w-8 h-8 text-amber-800" />
        </div>

        <span className="px-3 py-1 bg-amber-900 text-amber-200 font-mono font-bold text-[10px] rounded-full uppercase tracking-wider">
          Account Suspended
        </span>

        <h2 className="text-2xl font-black text-amber-950 tracking-tight">
          Admin Account Paused
        </h2>

        <p className="text-xs text-amber-900 max-w-md mx-auto leading-relaxed font-medium">
          Your admin account has been **paused by Z INTECH PRIVATE LIMITED Super Admin**. You cannot perform admin duties while your account is paused. Please contact your system administrator to reactivate your access.
        </p>
      </div>
    );
  }

  return children;
}
