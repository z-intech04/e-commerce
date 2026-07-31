"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowLeft,
  Menu,
  X
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/admin", label: "Dashboard Overview", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products Catalog Manager", icon: Package },
    { href: "/admin/orders", label: "Student Orders Manager", icon: ShoppingBag },
  ];

  return (
    <>
      {/* Mobile / Tablet Collapsible Header Bar */}
      <div className="md:hidden bg-slate-900 text-slate-300 p-4 rounded-2xl flex items-center justify-between border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="font-extrabold text-white text-xs">Admin Control Panel</h2>
            <p className="text-[9px] text-purple-300 uppercase tracking-wider font-semibold">School of Scholars</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 text-slate-300 p-4 rounded-2xl space-y-3 border border-slate-800 animate-in fade-in duration-150">
          <nav className="space-y-1 text-xs font-bold">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-purple-900 text-white shadow-md font-extrabold"
                      : "hover:bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-slate-800">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" /> Back to Storefront
            </Link>
          </div>
        </div>
      )}

      {/* Desktop & Laptop Fixed Sidebar (md:flex) */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 p-6 flex-col justify-between rounded-3xl min-h-[550px] shrink-0 border border-slate-800 shadow-xl">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-sm">Admin Control Panel</h2>
              <p className="text-[10px] text-purple-300 uppercase tracking-wider font-semibold">School of Scholars</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-bold">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-purple-900 text-white shadow-md font-extrabold"
                      : "hover:bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" /> Back to Storefront
          </Link>
        </div>
      </aside>
    </>
  );
}
