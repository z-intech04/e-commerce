"use client";

import React, { useState, useEffect, useRef } from "react";
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
import LocationModal, { getStoredLocation, autoDetectLocationSilent } from "./LocationModal";

export default function Navbar() {
  const router = useRouter();
  const { totalItemsCount, selectedGrade } = useCart();
  const { user, logout, setIsAuthModalOpen, setAuthMode } = useAuth();
  
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState("Location not set");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync location with user session: reset to "Location not set" on logout
  useEffect(() => {
    if (!user) {
      setUserLocation("Location not set");
      try {
        localStorage.removeItem("sos_user_location");
      } catch (e) {}
    } else {
      const stored = getStoredLocation();
      if (stored && stored !== "Location not set") {
        setUserLocation(stored);
      } else {
        autoDetectLocationSilent((detectedLoc) => {
          if (detectedLoc) {
            setUserLocation(detectedLoc);
          }
        });
      }
    }
  }, [user]);

  // Dropdown menu state & refs for stable click and hover
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setIsMoreMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="bg-white border-b border-slate-100 text-xs py-2 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          
          {/* Top Yellow & Grey Store Pills with School Name */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link 
              href="/"
              className="h-[38px] sm:h-[44px] px-4 sm:px-6 bg-[#ffe500] hover:bg-yellow-400 text-blue-950 rounded-full font-black text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-xs transition-all border border-yellow-300 active:scale-98"
            >
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-950 shrink-0" />
              <span className="font-black text-blue-950 tracking-tight">School of Scholars</span>
            </Link>

            <Link 
              href="/track-order"
              className="h-[38px] sm:h-[44px] px-3.5 sm:px-5 bg-[#f0f0f0] hover:bg-slate-200 text-slate-900 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all active:scale-98"
            >
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-950 shrink-0" />
              <span className="font-bold">Campus Direct</span>
            </Link>
          </div>

          {/* Live Location Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-700 font-medium">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-900 shrink-0" />
            {userLocation !== "Location not set" ? (
              <div className="flex items-center gap-1">
                <span className="font-semibold text-slate-600">Deliver to:</span>
                <span className="font-black text-blue-950 bg-blue-50/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-blue-100 text-[11px] sm:text-xs">
                  {userLocation}
                </span>
              </div>
            ) : (
              <span className="text-slate-500 font-bold">Location not set</span>
            )}
          </div>

        </div>
      </div>

      {/* Main Header Header Row */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-8">
            
            {/* School Logo & Title */}
            <Link href="/" className="flex items-center gap-2 group shrink-0 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
              </div>
              <div className="min-w-0">
                <h1 className="font-black text-xs sm:text-base text-blue-950 tracking-tight leading-none group-hover:text-blue-900 transition-colors truncate">
                  School of Scholars
                </h1>
                <p className="text-[9px] sm:text-[10px] font-bold text-amber-600 tracking-wider uppercase mt-0.5 hidden xs:block">
                  Official Store
                </p>
              </div>
            </Link>

            {/* LIVE AUTO SEARCH INPUT BOX (Exact 44px Height & Blue Outline) - Hidden on Mobile Header */}
            <div className="hidden md:block flex-1 max-w-2xl relative">
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

            {/* ACTION ICONS SECTION (Responsive - Never crops Hamburger menu) */}
            <div className="flex items-center gap-2 sm:gap-6 shrink-0">
              
              {/* 1. LOGIN / USER DROPDOWN (Visible on Tablet & Desktop) */}
              <div ref={userMenuRef} className="relative group hidden sm:block">
                {user ? (
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    onMouseEnter={() => setIsUserMenuOpen(true)}
                    className="flex items-center gap-1.5 text-slate-800 hover:text-[#2874f0] text-sm font-bold transition-colors py-2 focus:outline-none"
                  >
                    <User className="w-4.5 h-4.5 text-slate-700" />
                    <span className="max-w-[90px] truncate">{user.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isUserMenuOpen ? "rotate-180 text-[#2874f0]" : "group-hover:rotate-180"}`} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setIsAuthModalOpen(true);
                    }}
                    onMouseEnter={() => setIsUserMenuOpen(true)}
                    className="flex items-center gap-1.5 text-slate-800 hover:text-[#2874f0] text-sm font-bold transition-colors py-2 relative focus:outline-none"
                  >
                    <User className="w-4.5 h-4.5 text-slate-700" />
                    <span>Login</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isUserMenuOpen ? "rotate-180 text-[#2874f0]" : "group-hover:rotate-180"}`} />
                  </button>
                )}

                {/* Popover Dropdown Menu */}
                <div 
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className={`absolute right-0 top-full pt-2 z-50 transition-all duration-200 ${
                    isUserMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto"
                  }`}
                >
                  <div className="w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
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
                            setIsUserMenuOpen(false);
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
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 text-slate-900 rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4 text-[#2874f0]" />
                          <span>My Profile & Account</span>
                        </Link>

                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 text-slate-900 rounded-xl transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#2874f0]" />
                          <span className="font-bold text-blue-950">Orders & Live Tracking</span>
                        </Link>

                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 text-slate-900 rounded-xl transition-colors"
                        >
                          <Heart className="w-4 h-4 text-red-500" />
                          <span>Wishlist & Saved Kits</span>
                        </Link>
                      </div>

                      <div className="py-1">
                        {user ? (
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 text-red-600 rounded-xl font-bold transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4 text-red-600" />
                            <span>Sign Out</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              setAuthMode("login");
                              setIsAuthModalOpen(true);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 text-blue-900 rounded-xl font-bold transition-colors text-left"
                          >
                            <LogIn className="w-4 h-4 text-[#2874f0]" />
                            <span>Sign In to Account</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. MORE DROPDOWN (Desktop only) */}
              <div ref={moreMenuRef} className="relative group hidden md:block">
                <button 
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  onMouseEnter={() => setIsMoreMenuOpen(true)}
                  className="flex items-center gap-1 text-slate-800 hover:text-[#2874f0] text-sm font-bold transition-colors py-2 focus:outline-none"
                >
                  <span>More</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isMoreMenuOpen ? "rotate-180 text-[#2874f0]" : "group-hover:rotate-180"}`} />
                </button>

                <div 
                  onMouseLeave={() => setIsMoreMenuOpen(false)}
                  className={`absolute right-0 top-full pt-2 z-50 transition-all duration-200 ${
                    isMoreMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto"
                  }`}
                >
                  <div className="w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2">
                    <Link
                      href="/track-order"
                      onClick={() => setIsMoreMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-amber-50 text-slate-900 text-xs font-bold rounded-xl transition-colors"
                    >
                      <Truck className="w-4 h-4 text-amber-600" />
                      <span>Track Order by ID</span>
                    </Link>

                    <a
                      href="tel:+9102024567890"
                      onClick={() => setIsMoreMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl"
                    >
                      <Headphones className="w-4 h-4 text-[#2874f0]" />
                      <span>Customer Support</span>
                    </a>

                    <button
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        setIsGradeModalOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl text-left"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                      <span>Grade: {selectedGrade}</span>
                    </button>

                    {(user?.role === "admin" || user?.role === "superadmin") && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMoreMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-purple-50 text-purple-900 text-xs font-extrabold rounded-xl"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-700" />
                        <span>Admin Control Panel</span>
                      </Link>
                    )}

                    {user?.role === "superadmin" && (
                      <Link
                        href="/super-admin"
                        onClick={() => setIsMoreMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 bg-amber-50 text-amber-950 hover:bg-amber-100 text-xs font-black rounded-xl border border-amber-300"
                      >
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>Z INTECH Command Center</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. CART ICON (Icon-only on mobile, icon + label on tablet/desktop) */}
              <Link
                href="/cart"
                className="flex items-center gap-1.5 hover:text-[#2874f0] text-slate-800 font-bold text-sm transition-colors group shrink-0 p-1"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-slate-800 group-hover:text-[#2874f0] transition-colors" />
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center animate-bounce">
                      {totalItemsCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
              </Link>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 text-slate-800 hover:text-[#2874f0] rounded-xl hover:bg-slate-100 shrink-0 border border-slate-200"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
              </button>

            </div>

          </div>
        </div>
      </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200 divide-y divide-slate-100">
            
            {/* Mobile Search Bar inside Drawer */}
            <div className="pb-3">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search uniform blazer, NCERT books, stationery..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </form>
            </div>

            {/* Quick Actions & Navigation Links */}
            <div className="pt-3 space-y-1 text-xs font-extrabold text-slate-800">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100">
                <GraduationCap className="w-4 h-4 text-blue-900" />
                <span>Home Storefront</span>
              </Link>
              
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100">
                <Package className="w-4 h-4 text-blue-900" />
                <span>All Store Inventory</span>
              </Link>

              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-blue-50 text-blue-950 font-black">
                <User className="w-4 h-4 text-[#2874f0]" />
                <span>My Profile & Order History</span>
              </Link>

              {user?.role === "superadmin" && (
                <Link href="/super-admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-400 text-slate-950 font-black shadow-xs">
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Z INTECH Command Center</span>
                </Link>
              )}

              <Link href="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50 text-amber-900 font-black">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>Track Order by ID</span>
              </Link>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsGradeModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-100 text-slate-900 font-extrabold text-left"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                  <span>Selected Grade:</span>
                </span>
                <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md text-[10px] font-black">{selectedGrade}</span>
              </button>
            </div>

            {/* Category Shortcuts */}
            <div className="pt-3 space-y-1 text-xs font-bold text-slate-700">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2 mb-1">Catalog Categories</p>
              <Link href="/products?category=Uniforms" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-100">Official Uniforms & Blazers</Link>
              <Link href="/products?category=Books%20%26%20Notebooks" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-100">CBSE/NCERT Textbook Bundles</Link>
              <Link href="/products?category=Stationery" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-100">Stationery & Art Sets</Link>
              <Link href="/products?category=Bags%20%26%20Accessories" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 rounded-lg hover:bg-slate-100">Bags & School Accessories</Link>
            </div>

            {/* Auth Actions in Mobile Menu */}
            <div className="pt-3">
              {user ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 bg-red-50 text-red-600 font-extrabold text-xs rounded-xl hover:bg-red-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out ({user.name})</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setAuthMode("login");
                      setIsAuthModalOpen(true);
                    }}
                    className="py-2.5 bg-[#2874f0] text-white font-extrabold text-xs rounded-xl text-center shadow-xs"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setAuthMode("register");
                      setIsAuthModalOpen(true);
                    }}
                    className="py-2.5 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl text-center shadow-xs"
                  >
                    Sign Up
                  </button>
                </div>
              )}
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

      {/* Location Delivery Selector Modal */}
      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
        currentLocation={userLocation}
        onLocationSelect={(loc) => setUserLocation(loc)}
      />
    </>
  );
}
