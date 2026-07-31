"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ShoppingBag, Check, Sparkles, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { requireAuth } = useAuth();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "Standard");

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Guard: Prevent adding to cart without user registration/login
    if (!requireAuth("register", "Please register or sign in to add items to your cart.")) {
      return;
    }

    addToCart(product, selectedSize, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      <div>
        {/* Product Image Header */}
        <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
          <img
            src={product.images?.[0] || "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isBestseller && (
              <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-md shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-slate-950" /> Bestseller
              </span>
            )}
            <span className="px-2.5 py-1 bg-blue-900/90 text-white font-bold text-[10px] rounded-md backdrop-blur-xs shadow-xs">
              {product.grade}
            </span>
          </div>

          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-[10px] rounded-md shadow-xs">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span className="text-blue-900 font-bold uppercase tracking-wider text-[11px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating || 4.8}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount || 40})</span>
            </div>
          </div>

          <Link href={`/products/${product.id || product._id}`}>
            <h3 className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-blue-900 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2">
            {product.description}
          </p>

          {/* Size Pills */}
          {product.sizes && product.sizes.length > 1 && (
            <div className="pt-1 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Size:</span>
              {product.sizes.slice(0, 4).map((sz) => (
                <button
                  key={sz}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(sz);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                    selectedSize === sz
                      ? "bg-blue-900 text-white border-blue-900"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {sz}
                </button>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[10px] text-slate-400 font-medium">+{product.sizes.length - 4} more</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Pricing & Add Button */}
      <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-slate-900 text-base">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Incl. all school taxes</p>
        </div>

        <button
          onClick={handleQuickAdd}
          className={`px-3.5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
            isAdded
              ? "bg-emerald-600 text-white"
              : "bg-blue-900 text-white hover:bg-blue-800 active:scale-95"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" /> Added!
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-amber-300" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
