"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Sparkles, 
  ShoppingBag, 
  Ruler, 
  BookOpen, 
  Shirt, 
  Backpack, 
  PenTool, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CheckCircle,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import SizeGuideModal from "@/components/SizeGuideModal";
import GradeSelectorModal from "@/components/GradeSelectorModal";
import { useCart } from "@/context/CartContext";
import { SCHOOL_CLASSES } from "@/lib/seedData";

export default function HomePage() {
  const { selectedGrade, setSelectedGrade } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.products) setProducts(data.products);
      } catch (e) {
        console.error("Failed to load products:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = selectedGrade === "All Classes"
    ? products
    : products.filter(
        (p) => p.grade === selectedGrade || p.grade === "All" || p.grade === "Class 1 to 12"
      );

  return (
    <div className="space-y-12 pb-16">
      
      {/* HERO BANNER */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white overflow-hidden py-16 lg:py-24">
        {/* Decorative Background Accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-extrabold shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Academic Session 2026-27 Supply Portal</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                Official Store for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                  School of Scholars
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Purchase verified grade-wise NCERT & CBSE textbook kits, tailored woolen blazers, house t-shirts, geometry sets, and orthopedic backpacks with direct campus distribution or home delivery.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/products"
                  className="px-6 py-3.5 bg-amber-500 text-slate-950 rounded-xl font-black text-sm hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/25 flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-950" /> Shop Catalog Now
                </Link>

                <button
                  onClick={() => setIsGradeModalOpen(true)}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 backdrop-blur-xs"
                >
                  <SlidersHorizontal className="w-4 h-4 text-amber-300" /> Filter by Grade ({selectedGrade})
                </button>

                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="px-4 py-3.5 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 hover:underline"
                >
                  <Ruler className="w-4 h-4 text-amber-400" /> Blazer Size Chart
                </button>
              </div>
            </div>

            {/* Hero Right Widget: Quick Grade Selector Card */}
            <div className="lg:col-span-5">
              <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200/80 relative">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center font-bold shadow-xs">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Select Student Class</h3>
                      <p className="text-xs text-slate-500">Auto-match textbook kits & sizes</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] font-extrabold rounded-md">
                    2026-27
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {SCHOOL_CLASSES.slice(1, 10).map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setSelectedGrade(cls)}
                      className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition-all ${
                        selectedGrade === cls
                          ? "bg-blue-900 text-white border-blue-900 shadow-md scale-102"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-900 hover:bg-blue-50"
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 font-medium flex items-center justify-between">
                  <span>Active Selection: <strong>{selectedGrade}</strong></span>
                  <Link
                    href={`/products?grade=${encodeURIComponent(selectedGrade)}`}
                    className="font-extrabold text-blue-900 hover:underline flex items-center gap-0.5"
                  >
                    View Items <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TRUST BADGES BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-blue-900" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">100% School Verified</h4>
              <p className="text-[11px] text-slate-500">Official logo & board specs</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Campus Pickup / Home</h4>
              <p className="text-[11px] text-slate-500">Free desk pickup option</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">7-Day Size Exchange</h4>
              <p className="text-[11px] text-slate-500">Instant blazer/shirt swap</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Student ID Receipt</h4>
              <p className="text-[11px] text-slate-500">Automatic order record</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Shop by Category</h2>
            <p className="text-xs text-slate-500 font-medium">Browse verified school items tailored for your student</p>
          </div>
          <Link
            href="/products"
            className="text-xs font-extrabold text-blue-900 hover:text-blue-700 flex items-center gap-1"
          >
            View All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Link
            href="/products?category=Uniforms"
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-900 transition-colors">Official Uniforms</h3>
              <p className="text-xs text-slate-500">Blazers, Shirts, Trousers, Skirts, PE Kits</p>
            </div>
          </Link>

          <Link
            href="/products?category=Books%20%26%20Notebooks"
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-900 transition-colors">Books & Notebooks</h3>
              <p className="text-xs text-slate-500">NCERT/CBSE Bundles & Custom Registers</p>
            </div>
          </Link>

          <Link
            href="/products?category=Stationery"
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <PenTool className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-900 transition-colors">Stationery & Art</h3>
              <p className="text-xs text-slate-500">Geometry boxes, Color sets, Pens</p>
            </div>
          </Link>

          <Link
            href="/products?category=Bags%20%26%20Accessories"
            className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <Backpack className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-900 transition-colors">Bags & Bottles</h3>
              <p className="text-xs text-slate-500">Orthopedic Backpacks, Insulated Flasks</p>
            </div>
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {selectedGrade === "All Classes" ? "Featured School Merchandise" : `Items for ${selectedGrade}`}
            </h2>
            <p className="text-xs text-slate-500 font-medium">Top-rated items required for academic session</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Class:</span>
            <button
              onClick={() => setIsGradeModalOpen(true)}
              className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs font-extrabold hover:bg-amber-100"
            >
              {selectedGrade} ✎
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
            <p className="text-slate-600 font-semibold text-sm">No items found for {selectedGrade}</p>
            <button
              onClick={() => setSelectedGrade("All Classes")}
              className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* UNIFORM SIZE GUIDE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-md uppercase tracking-wider">
              Measurement Helper
            </span>
            <h3 className="text-2xl font-black tracking-tight">Unsure About Blazer or Shirt Sizing?</h3>
            <p className="text-xs text-blue-100 max-w-xl">
              Check our official School of Scholars uniform measurement guide. Includes chest, waist, and length measurements in inches for Nursery through Class 12.
            </p>
          </div>

          <button
            onClick={() => setIsSizeGuideOpen(true)}
            className="px-6 py-3.5 bg-white text-blue-950 rounded-xl font-black text-xs hover:bg-amber-400 transition-all shadow-lg shrink-0 flex items-center gap-2 z-10"
          >
            <Ruler className="w-4 h-4 text-blue-900" /> Open Size Guide Table
          </button>
        </div>
      </section>

      {/* Modals */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
      <GradeSelectorModal isOpen={isGradeModalOpen} onClose={() => setIsGradeModalOpen(false)} />
    </div>
  );
}
