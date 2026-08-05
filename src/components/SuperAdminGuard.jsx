"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, ShieldCheck, Lock, ArrowLeft } from "lucide-react";

export default function SuperAdminGuard({ children }) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-bold text-slate-500">Verifying Z INTECH Super Admin Authority...</p>
      </div>
    );
  }

  if (!user || user.role !== "superadmin") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto shadow-inner border border-amber-300">
          <ShieldAlert className="w-10 h-10 text-amber-700" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-slate-900 text-amber-400 font-mono font-black text-xs rounded-full uppercase tracking-wider">
            Z INTECH PRIVATE LIMITED Security Guard
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Super Admin Command Center Access Required</h1>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            This dashboard is restricted to **Z INTECH PRIVATE LIMITED Super Admin** authority. Standard admins and shoppers are not permitted.
          </p>
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-2xl max-w-sm mx-auto text-xs text-left space-y-2 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Lock className="w-4 h-4" /> Default Master Credentials:
          </div>
          <p className="text-slate-300 font-mono text-[11px]">Email: <strong className="text-white">superadmin@zintech.com</strong></p>
          <p className="text-slate-300 font-mono text-[11px]">Password: <strong className="text-amber-400">zintech123</strong></p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-900 text-white font-extrabold rounded-2xl text-xs hover:bg-blue-800 transition-all inline-flex items-center gap-2 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
