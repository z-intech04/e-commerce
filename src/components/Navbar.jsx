"use client";

import React, { useState, useEffect } from "react";
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
  Package,
  Heart,
  Truck,
  Headphones
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
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Live Auto Search fetching
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        if (data.products) {
          setSearchResults(data.products.slice(0, 6)); // Top 6 instant matches
        }
      } catch (e) {
        console.error("Auto search error:", e);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Location & Delivery Bar */}
      <div className="bg-white border-b border-slate-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Top Yellow & Grey Store Pills with School Name */}
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="h-[44px] px-6 bg-[#ffe500] hover:bg-yellow-400 text-blue-950 rounded-full font-black text-sm flex items-center gap-2 shadow-xs transition-all border border-yellow-300 active:scale-98"
            >
              <GraduationCap className="w-5 h-5 text-blue-950 shrink-0" />
              <span className="font-black text-blue-950 tracking-tight">School of Scholars</span>
            </Link>

            <Link 
              href="/track-order"
              className="h-[44px] px-5 bg-[#f0f0f0] hover:bg-slate-200 text-slate-900 rounded-full font-bold text-sm flex items-center gap-2 transition-all active:scale-98"
            >
              <Truck className="w-4 h-4 text-blue-950 shrink-0" />
              <span className="font-bold">Campus Direct</span>
            </Link>
          </div>

          {/* Location Delivery Selector (Exact Screenshot Match) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
            <MapPin className="w-4 h-4 text-slate-900 shrink-0" />
            <span>Location not set</span>
            <button 
              onClick={() => setIsGradeModalOpen(true)}
              className="text-[#2874f0] font-bold text-xs hover:underline flex items-center gap-0.5"
            >
              <span>Select delivery location</span>
              <span>&gt;</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Header Header Row */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4 sm:gap-8">
            
            {/* School Logo & Title */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h1 className="font-black text-base sm:text-lg text-blue-950 tracking-tight leading-none group-hover:text-blue-900 transition-colors">
                  School of Scholars
                </h1>
                <p className="text-[10px] font-bold text-amber-600 tracking-wider uppercase mt-0.5">
                  Official Store
                </p>
              </div>
            </Link>

            {/* LIVE AUTO SEARCH INPUT BOX (Exact 44px Height & Blue Outline) */}
            <div className="flex-1 max-w-2xl relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-3.5 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Products, Brands and More"
                  className="w-full h-[44px] pl-11 pr-4 bg-white border-2 border-[#2874f0] rounded-xl text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none shadow-xs transition-all"
                />
              </form>

              {/* LIVE AUTO SEARCH SUGGESTIONS OVERLAY DROPDOWN */}
              {isSearchFocused && searchQuery.trim().length >= 2 && (
                <div 
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in duration-150 divide-y divide-slate-100"
                  onMouseDown={(e) => e.preventDefault()} // Prevents input blur on click
                >
                  <div className="p-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>Auto Suggestions ({searchResults.length})</span>
                    {isSearching && <span className="text-[#2874f0] animate-pulse">Searching...</span>}
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                      {searchResults.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setIsSearchFocused(false);
                            router.push(`/products/${item.id}`);
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-blue-50/60 cursor-pointer transition-colors group"
                        >
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-10 h-10 object-contain rounded-lg border border-slate-200 bg-white p-1 shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-extrabold text-slate-900 group-hover:text-[#2874f0] truncate">
                              {item.title}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold mt-0.5">
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{item.category}</span>
                              <span>•</span>
                              <span className="text-amber-700 font-bold">{item.grade}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-slate-900">₹{item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    !isSearching && (
                      <div className="p-6 text-center text-xs text-slate-500 font-medium">
                        No matching school products found for &quot;{searchQuery}&quot;
                      </div>
                    )
                  )}

                  <button
                    onClick={handleSearchSubmit}
                    className="w-full p-2.5 text-center bg-blue-50 text-[#2874f0] hover:bg-blue-100 font-extrabold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>View all search results for &quot;{searchQuery}&quot;</span>
                    <span>&gt;</span>
                  </button>
                </div>
              )}
            </div>

            {/* ACTION ICONS SECTION (Login v, More v, Cart) */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              
              {/* 1. LOGIN DROPDOWN */}
              <div className="relative group">
                {user ? (
                  <button className="flex items-center gap-1.5 text-slate-800 hover:text-[#2874f0] text-sm font-bold transition-colors py-2">
                    <User className="w-4.5 h-4.5 text-slate-700" />
                    <span className="max-w-[90px] truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 transition-transform group-hover:rotate-180" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setIsAuthModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-slate-800 hover:text-[#2874f0] text-sm font-bold transition-colors py-2 relative"
                  >
                    <User className="w-4.5 h-4.5 text-slate-700" />
                    <span>Login</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 transition-transform group-hover:rotate-180" />

                    {/* Blue Hover Badge */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-1 bg-[#2874f0] text-white font-bold text-[11px] rounded-md shadow-lg hidden group-hover:flex items-center gap-1 whitespace-nowrap z-50 animate-in fade-in">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2874f0] rotate-45" />
                      Login
                    </div>
                  </button>
                )}

                {/* Login Popover */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl hidden group-hover:block z-50 animate-in fade-in duration-150 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      {user ? (
                        <>
                          <p className="text-xs font-extrabold text-slate-900">{user.name}</p>
                          <p className="text-[10px] font-medium text-slate-500 truncate max-w-[130px]">{user.email}</p>
                        </>
                      ) : (
                        <p className="text-xs font-extrabold text-slate-900">New customer?</p>
                      )}
                    </div>
                    {!user && (
                      <button
                        onClick={() => {
                          setAuthMode("register");
                          setIsAuthModalOpen(true);
                        }}
                        className="px-3 py-1 bg-[#2874f0] text-white font-bold text-xs rounded-md shadow-xs hover:bg-blue-600 transition-colors"
                      >
                        Sign Up
                      </button>
                    )}
                  </div>

                  <div className="p-1 text-xs font-semibold text-slate-800 divide-y divide-slate-100">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 text-slate-900 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-[#2874f0]" />
                        <span>My Profile & Account</span>
                      </Link>

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 text-slate-900 rounded-xl transition-colors"
                      >
                        <Package className="w-4 h-4 text-[#2874f0]" />
                        <span className="font-bold text-blue-950">Orders & Live Tracking</span>
                      </Link>

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 text-slate-900 rounded-xl transition-colors"
                      >
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>Wishlist & Saved Kits</span>
                      </Link>
                    </div>

                    <div className="py-1">
                      {user && (
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 text-red-600 rounded-xl font-bold transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span>Sign Out</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. MORE DROPDOWN (As Shown in Screenshot) */}
              <div className="relative group hidden sm:block">
                <button className="flex items-center gap-1 text-slate-800 hover:text-[#2874f0] text-sm font-bold transition-colors py-2">
                  <span>More</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 transition-transform group-hover:rotate-180" />
                </button>

                {/* More Menu Popover */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl hidden group-hover:block z-50 p-2 animate-in fade-in duration-150">
                  <Link
                    href="/track-order"
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-amber-50 text-slate-900 text-xs font-bold rounded-xl transition-colors"
                  >
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>Track Order by ID</span>
                  </Link>

                  <a
                    href="tel:+9102024567890"
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl"
                  >
                    <Headphones className="w-4 h-4 text-[#2874f0]" />
                    <span>Customer Support</span>
                  </a>

                  <button
                    onClick={() => setIsGradeModalOpen(true)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl text-left"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                    <span>Grade: {selectedGrade}</span>
                  </button>

                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-purple-50 text-purple-900 text-xs font-extrabold rounded-xl"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                      <span>Admin Control Panel</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* 3. CART ICON WITH TEXT (As Shown in Screenshot) */}
              <Link
                href="/cart"
                className="flex items-center gap-2 hover:text-[#2874f0] text-slate-800 font-bold text-sm transition-colors group shrink-0"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-slate-800 group-hover:text-[#2874f0] transition-colors" />
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center animate-bounce">
                      {totalItemsCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>

          </div>
        </div>
      </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search uniform blazer, NCERT books..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </form>

            <div className="space-y-1 text-xs font-extrabold text-slate-800">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block p-2.5 rounded-xl hover:bg-slate-100">Home</Link>
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="block p-2.5 rounded-xl hover:bg-slate-100">All Products</Link>
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block p-2.5 rounded-xl bg-blue-50 text-blue-950 font-black">📦 My Profile & Orders</Link>
              <Link href="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="block p-2.5 rounded-xl bg-amber-50 text-amber-900 font-black">🚚 Track Order by ID</Link>
              <Link href="/products?category=Uniforms" onClick={() => setIsMobileMenuOpen(false)} className="block p-2.5 rounded-xl hover:bg-slate-100">Official Uniforms</Link>
              <Link href="/products?category=Books%20%26%20Notebooks" onClick={() => setIsMobileMenuOpen(false)} className="block p-2.5 rounded-xl hover:bg-slate-100">Textbook Kits</Link>
              <Link href="/products?category=Stationery" onClick={() => setIsMobileMenuOpen(false)} className="block p-2.5 rounded-xl hover:bg-slate-100">Stationery & Art</Link>
            </div>
          </div>
        )}

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
