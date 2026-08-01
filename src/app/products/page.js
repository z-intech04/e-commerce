"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { SCHOOL_CLASSES, CATEGORIES } from "@/lib/seedData";
import { Filter, SlidersHorizontal, Search, RefreshCw, X, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All Categories";
  const initialSearch = searchParams.get("search") || "";
  const initialGrade = searchParams.get("grade") || "";

  const { selectedGrade, setSelectedGrade } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedGender, setSelectedGender] = useState("All Genders");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (initialGrade) {
      setSelectedGrade(initialGrade);
    }
  }, [initialGrade, setSelectedGrade]);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        let url = `/api/products?`;
        if (selectedCategory !== "All Categories") url += `category=${encodeURIComponent(selectedCategory)}&`;
        if (selectedGrade !== "All Classes") url += `grade=${encodeURIComponent(selectedGrade)}&`;
        if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;

        const res = await fetch(url);
        const data = await res.json();
        if (data.products) setProducts(data.products);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory, selectedGrade, searchQuery]);

  // Client side secondary filtering & sorting
  let filtered = products.filter((p) => {
    if (selectedGender !== "All Genders" && p.gender && p.gender !== "Unisex" && p.gender !== selectedGender) {
      return false;
    }
    if (inStockOnly && !p.inStock) {
      return false;
    }
    return true;
  });

  if (sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const clearAllFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedGrade("All Classes");
    setSearchQuery("");
    setSelectedGender("All Genders");
    setInStockOnly(false);
    setSortBy("featured");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            School Store Inventory Catalog
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Showing official uniform, textbook sets, and stationery items
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden px-3.5 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs"
          >
            <Filter className="w-4 h-4 text-amber-300" />
            <span>{isMobileFilterOpen ? "Hide Filters" : "Filter Products"}</span>
          </button>

          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-900"
          >
            <option value="featured">Featured / Bestsellers</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT FILTERS SIDEBAR (Responsive drawer on mobile/tablet, fixed on desktop) */}
        <aside className={`lg:col-span-3 space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs h-fit ${
          isMobileFilterOpen ? "block" : "hidden lg:block"
        }`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-900" /> Filter Criteria
            </h2>
            <button
              onClick={clearAllFilters}
              className="text-[11px] font-bold text-amber-700 hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search Query Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Search Keywords</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Blazer, NCERT, Geometry..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Grade / Class Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Select Grade / Class</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-950"
            >
              {SCHOOL_CLASSES.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Category</label>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setIsMobileFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-blue-900 text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Uniform Gender</label>
            <div className="grid grid-cols-3 gap-1">
              {["All Genders", "Boys", "Girls"].map((gnd) => (
                <button
                  key={gnd}
                  onClick={() => setSelectedGender(gnd)}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-bold border transition-colors ${
                    selectedGender === gnd
                      ? "bg-blue-900 text-white border-blue-900"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {gnd}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Switch */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">In-Stock Items Only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 text-blue-900 rounded accent-blue-900"
            />
          </div>
        </aside>

        {/* RIGHT PRODUCT GRID */}
        <main className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold bg-slate-100 p-3 rounded-xl">
            <span>
              Showing <strong className="text-slate-900">{filtered.length}</strong> items for{" "}
              <strong className="text-blue-900">{selectedGrade}</strong> in{" "}
              <strong className="text-blue-900">{selectedCategory}</strong>
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 bg-slate-200 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">No Matching Inventory Items Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filters or selecting &quot;All Classes&quot; to see all available items.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold">Loading Store Catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
