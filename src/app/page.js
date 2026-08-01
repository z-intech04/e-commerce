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
  ChevronRight,
  Smartphone,
  Laptop,
  Tv,
  Smile,
  Coffee,
  Trophy,
  Package
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
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState("For You");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  const [heroSettings, setHeroSettings] = useState({
    couponTitle: "Exclusive coupon for you!",
    couponDiscount: "Flat 10% Off",
    couponSub: "Up to ₹500 on Grade Kits",
    couponStatus: "Already applied",
    card1Title: "Official Blazer & Uniform Sets",
    card1Price: "From ₹1,499*",
    card1Sub: "Pre-order 2026-27 Session",
    card2Title: "Complete Grade NCERT Textbook Kits",
    card2Discount: "Up to 25% Off",
    card2Sub: "Includes Textbooks & Workbooks",
    card3Title: "Casio Scientific Calculators & Bags",
    card3Price: "Special ₹899",
    card3Sub: "Approved for Class 9 to 12"
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, setRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/settings")
        ]);
        const prodData = await prodRes.json();
        const setData = await setRes.json();
        if (prodData.products) setProducts(prodData.products);
        if (setData.success && setData.settings) setHeroSettings(setData.settings);
      } catch (e) {
        console.error("Failed to load products or settings:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchGrade = selectedGrade === "All Classes" || p.grade === selectedGrade || p.grade === "All" || p.grade === "Class 1 to 12";
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    return matchGrade && matchCat;
  });

  const categories = [
    { label: "For You", icon: ShoppingBag, cat: "All" },
    { label: "Uniforms", icon: Shirt, cat: "Uniforms" },
    { label: "Textbook Kits", icon: BookOpen, cat: "Books & Notebooks" },
    { label: "Stationery & Art", icon: PenTool, cat: "Stationery" },
    { label: "Bags & Bottles", icon: Backpack, cat: "Bags & Accessories" },
    { label: "Winter Wear", icon: Shirt, cat: "Uniforms" },
    { label: "Sports & Fitness", icon: Trophy, cat: "Stationery" },
    { label: "Tech & Calculators", icon: Laptop, cat: "Stationery" },
    { label: "Exam Supplies", icon: ShieldCheck, cat: "Stationery" }
  ];

  return (
    <div className="space-y-6 pb-16 bg-slate-50 min-h-screen">
      
      {/* 1. RESPONSIVE CATEGORY ICON STRIP (NO VISIBLE SCROLLBAR & STRICT SINGLE ITEM SELECTION) */}
      <section className="bg-white border-b border-slate-200 py-2 sm:py-3 shadow-xs sticky top-16 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-1 px-2">
            {categories.map((cat, idx) => {
              const IconComp = cat.icon;
              // STRICT SINGLE ITEM SELECTION: Only match exact clicked label!
              const isSelected = selectedCategoryLabel === cat.label;
              
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCategoryLabel(cat.label);
                    setActiveCategory(cat.cat);
                  }}
                  className="flex flex-col items-center gap-1.5 group shrink-0 relative px-1 sm:px-2 py-1 transition-all focus:outline-none"
                >
                  {/* Category Graphic Box */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isSelected 
                      ? "bg-blue-50 border-2 border-[#2874f0] text-[#2874f0] shadow-xs" 
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
                  }`}>
                    <IconComp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                  </div>

                  {/* Category Label */}
                  <span className={`text-[11px] sm:text-[12px] font-bold whitespace-nowrap ${
                    isSelected ? "text-[#2874f0]" : "text-slate-700 group-hover:text-slate-900"
                  }`}>
                    {cat.label}
                  </span>

                  {/* Active Blue Underline Indicator */}
                  {isSelected && (
                    <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-8 sm:w-10 h-1 bg-[#2874f0] rounded-t-md animate-in fade-in" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* 2. EXCLUSIVE TICKET COUPON BANNER (Dynamic Admin Config) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative bg-[#0071e3] text-white rounded-2xl p-4 sm:p-6 shadow-md overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 border border-blue-600">
          
          {/* Ticket Left Notch */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-8 bg-slate-50 rounded-r-full border-r border-blue-700 hidden sm:block" />
          {/* Ticket Right Notch */}
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-8 bg-slate-50 rounded-l-full border-l border-blue-700 hidden sm:block" />

          {/* Ticket Left Content */}
          <div className="flex-1 text-center md:text-left pl-0 sm:pl-4">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {heroSettings.couponTitle}
            </h2>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block w-px h-16 bg-blue-400/40" />

          {/* Ticket Right Content */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pr-0 sm:pr-4 text-center sm:text-right">
            <div>
              <p className="text-2xl sm:text-3xl font-black">{heroSettings.couponDiscount}</p>
              <p className="text-sm font-bold text-blue-100">{heroSettings.couponSub}</p>
            </div>
            <span className="px-5 py-2.5 bg-white text-[#0071e3] font-black text-sm rounded-full shadow-md whitespace-nowrap">
              {heroSettings.couponStatus}
            </span>
          </div>

        </div>
      </section>

      {/* 3. PROMOTIONAL HERO BANNER CARDS GRID (Dynamic Admin Config) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* CARD 1: Uniform Theme */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-64 shadow-lg border border-purple-900/50 group hover:scale-[1.01] transition-transform">
            <div>
              <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                SCHOOL OF SCHOLARS
              </span>
              <h3 className="text-xl font-black mt-2 leading-tight">
                {heroSettings.card1Title}
              </h3>
              <p className="text-sm font-extrabold text-amber-300 mt-1">{heroSettings.card1Price}</p>
              <p className="text-[10px] text-slate-300 font-medium mt-0.5">{heroSettings.card1Sub}</p>
            </div>

            {/* Graphic Illustration */}
            <div className="absolute right-3 bottom-3 w-28 h-28 opacity-90 group-hover:scale-105 transition-transform">
              <Shirt className="w-full h-full text-indigo-400/30" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
              <Link href="/products?category=Uniforms" className="text-xs font-bold text-white hover:underline flex items-center gap-1">
                Shop Uniforms <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </Link>
              <span className="text-[9px] font-extrabold text-slate-400 bg-white/10 px-1.5 py-0.5 rounded">OFFICIAL</span>
            </div>
          </div>

          {/* CARD 2: Textbook Kits Bundle Theme */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 text-slate-900 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-64 shadow-lg border border-emerald-200 group hover:scale-[1.01] transition-transform">
            <div>
              <span className="text-[10px] font-black tracking-widest text-emerald-800 uppercase bg-emerald-200/60 px-2 py-0.5 rounded border border-emerald-300">
                ACADEMIC BUNDLE
              </span>
              <h3 className="text-xl font-black mt-2 text-emerald-950 leading-tight">
                {heroSettings.card2Title}
              </h3>
              <p className="text-sm font-black text-emerald-700 mt-1">{heroSettings.card2Discount}</p>
              <p className="text-[10px] text-slate-600 font-semibold mt-0.5">{heroSettings.card2Sub}</p>
            </div>

            {/* Graphic Illustration */}
            <div className="absolute right-3 bottom-8 w-28 h-28 opacity-90 group-hover:scale-105 transition-transform">
              <BookOpen className="w-full h-full text-emerald-600/30" />
            </div>

            {/* Pagination Carousel Dots */}
            <div className="flex items-center justify-center gap-1.5 my-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span className="w-4 h-1.5 rounded-full bg-[#2874f0]" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 relative z-10">
              <Link href="/products?category=Books%20%26%20Notebooks" className="text-xs font-bold text-emerald-900 hover:underline flex items-center gap-1">
                Explore Kits <ChevronRight className="w-3.5 h-3.5 text-emerald-700" />
              </Link>
              <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-200/80 px-1.5 py-0.5 rounded">FEATURED</span>
            </div>
          </div>

          {/* CARD 3: Student Tech Theme */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-64 shadow-lg border border-slate-800 group hover:scale-[1.01] transition-transform">
            <div>
              <span className="text-[10px] font-black tracking-widest text-sky-400 uppercase bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/30">
                BOARD EXAM READY
              </span>
              <h3 className="text-xl font-black mt-2 leading-tight">
                {heroSettings.card3Title}
              </h3>
              <p className="text-sm font-extrabold text-sky-300 mt-1">{heroSettings.card3Price}</p>
              <p className="text-[10px] text-slate-300 font-medium mt-0.5">{heroSettings.card3Sub}</p>
            </div>

            {/* Graphic Illustration */}
            <div className="absolute right-3 bottom-3 w-28 h-28 opacity-90 group-hover:scale-105 transition-transform">
              <Laptop className="w-full h-full text-sky-400/30" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
              <Link href="/products?category=Stationery" className="text-xs font-bold text-white hover:underline flex items-center gap-1">
                Shop Exam Tools <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
              </Link>
              <span className="text-[9px] font-extrabold text-slate-400 bg-white/10 px-1.5 py-0.5 rounded">AD</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. "IN DEMAND" MINT GREEN PRODUCT SHELF (Exact Screenshot Match) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#e6f7f3] rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs">
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">In demand</h3>
              <span className="px-2 py-0.5 bg-emerald-200 text-emerald-950 font-bold text-xs rounded-full">Hot Picks</span>
            </div>

            <Link href="/products" className="text-xs font-extrabold text-[#2874f0] hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* In Demand Product Carousel Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {products.slice(0, 5).map((product) => {
              const prodId = product.id || product._id;
              const prodImage = product.images?.[0] || product.image || "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800";
              const prodName = product.name || product.title || "School Item";

              return (
                <Link 
                  key={prodId} 
                  href={`/products/${prodId}`}
                  className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200/80 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="relative aspect-square mb-2 bg-slate-50 rounded-xl overflow-hidden p-2 flex items-center justify-center">
                    <img 
                      src={prodImage} 
                      alt={prodName} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                    />
                    <span className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded">
                      {product.grade || "All"}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1 group-hover:text-[#2874f0]">
                      {prodName}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-black text-slate-900">₹{product.price}</span>
                      <span className="text-[10px] text-slate-400 line-through">₹{product.originalPrice || (product.price + 200)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
