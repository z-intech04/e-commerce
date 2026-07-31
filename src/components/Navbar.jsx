"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  Search, 
  User, 
  GraduationCap, 
  ShieldCheck, 
  Menu, 
  X, 
  SlidersHorizontal,
  ChevronDown,
  LogOut,
  Sparkles,
  Phone,
  MapPin,
  LogIn,
  UserPlus
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import GradeSelectorModal from "./GradeSelectorModal";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const router = useRouter();
  const { totalItemsCount, selectedGrade } = useCart();
  const { user, logout, setIsAuthModalOpen, setAuthMode } = useAuth();
  
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-blue-900 text-white text-xs py-2 px-4 flex flex-wrap justify-between items-center border-b border-blue-800">
        <div className="flex items-center gap-2 sm:gap-4 mx-auto md:mx-0 text-center sm:text-left">
          <span className="flex items-center gap-1 font-medium text-amber-300">
            <Sparkles className="w-3.5 h-3.5" /> Academic Year 2026-27 Inventory Live!
          </span>
          <span className="hidden md:inline text-blue-200">|</span>
          <span className="hidden md:inline text-blue-100">
            Get 10% Bundle Discount on Complete Grade Textbook Sets
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-6 text-blue-200 text-xs">
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-amber-400" /> Helpline: +91 (020) 2456-7890
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" /> Campus Pickup: Counter 2 (9 AM - 4 PM)
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            
            {/* School Logo */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-amber-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7 text-amber-300" />
              </div>
              <div>
                <h1 className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight leading-none group-hover:text-blue-900 transition-colors">
                  School of Scholars
                </h1>
                <p className="text-[10px] sm:text-xs font-semibold text-amber-600 tracking-wider uppercase mt-0.5">
                  Official Store Portal
                </p>
              </div>
            </Link>

            {/* Desktop Live Search Bar */}
            <form 
              onSubmit={handleSearchSubmit} 
              className="hidden lg:flex flex-1 max-w-md relative items-center"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search uniform blazer, Class 5 NCERT books, stationery..."
                className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-300 rounded-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-1.5 bg-blue-900 text-white rounded-full text-xs font-medium hover:bg-blue-800 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              
              {/* Grade Selector Trigger Button */}
              <button
                onClick={() => setIsGradeModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 hover:bg-amber-100 transition-colors text-[11px] sm:text-xs font-bold shadow-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="hidden xs:inline">Class:</span>
                <strong className="text-blue-900">{selectedGrade}</strong>
                <ChevronDown className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              </button>

              {/* User Authentication */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-800 text-xs font-bold border border-slate-200 transition-colors">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-900 shrink-0" />
                    <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                    <span className={`px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black uppercase rounded ${
                      user.role === "admin" ? "bg-purple-900 text-amber-300" : "bg-blue-900 text-white"
                    }`}>
                      {user.role}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  </button>

                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl hidden group-hover:block p-2 z-50 animate-in fade-in duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 space-y-0.5">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-400 font-medium truncate">{user.email}</p>
                    </div>

                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-extrabold text-purple-700 hover:bg-purple-50 rounded-xl mt-1 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-700" /> Admin Control Panel
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 font-bold hover:bg-red-50 rounded-xl mt-1 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-900 text-white rounded-xl text-[11px] sm:text-xs font-bold hover:bg-blue-800 transition-colors flex items-center gap-1 shadow-md"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-300" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Cart Icon */}
              <Link
                href="/cart"
                className="relative p-2 sm:p-2.5 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-transform active:scale-95 shadow-md flex items-center justify-center shrink-0"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-amber-500 text-slate-950 font-black text-[10px] sm:text-[11px] rounded-full flex items-center justify-center shadow-xs animate-bounce">
                    {totalItemsCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>

          {/* Secondary Sub-Header Menu (Desktop) */}
          <nav className="hidden lg:flex items-center justify-between py-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-8">
              <Link href="/" className="hover:text-blue-900 transition-colors">Home</Link>
              <Link href="/products" className="hover:text-blue-900 transition-colors">All Products</Link>
              <Link href="/products?category=Uniforms" className="hover:text-blue-900 transition-colors">Official Uniforms</Link>
              <Link href="/products?category=Books%20%26%20Notebooks" className="hover:text-blue-900 transition-colors">Textbook Kits</Link>
              <Link href="/products?category=Stationery" className="hover:text-blue-900 transition-colors">Stationery & Art</Link>
              <Link href="/products?category=Bags%20%26%20Accessories" className="hover:text-blue-900 transition-colors">Bags & Bottles</Link>
            </div>
            <div className="text-slate-500 font-medium">
              School Code: <span className="font-bold text-slate-900">SCH-SCHOLARS-2026</span>
            </div>
          </nav>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search uniform blazer, NCERT books..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>

            <div className="space-y-1 text-xs font-extrabold text-slate-800">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-100">Home</Link>
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-100">All Products</Link>
              <Link href="/products?category=Uniforms" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-100">Official Uniforms</Link>
              <Link href="/products?category=Books%20%26%20Notebooks" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-100">Textbook Kits</Link>
              <Link href="/products?category=Stationery" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-100">Stationery & Art</Link>
              <Link href="/products?category=Bags%20%26%20Accessories" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-100">Bags & Bottles</Link>
              
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-2 rounded-lg bg-purple-100 text-purple-900 font-black flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-700" /> Admin Control Panel
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Grade Filter Modal */}
      <GradeSelectorModal 
        isOpen={isGradeModalOpen} 
        onClose={() => setIsGradeModalOpen(false)} 
      />

      {/* Auth Modal */}
      <AuthModal />
    </>
  );
}
