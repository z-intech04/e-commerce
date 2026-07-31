"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import SizeGuideModal from "@/components/SizeGuideModal";
import { 
  Star, 
  ShoppingBag, 
  Check, 
  Ruler, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  ArrowLeft,
  User,
  Plus,
  Minus,
  CheckCircle2
} from "lucide-react";

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const { requireAuth } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customNameBadge, setCustomNameBadge] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          if (data.product.sizes?.length) {
            setSelectedSize(data.product.sizes[0]);
          } else {
            setSelectedSize("Standard");
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs font-bold text-slate-500">Loading Product Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <Link href="/products" className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold inline-block">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!requireAuth("register", "Please register or sign in to add items to your cart.")) {
      return;
    }
    addToCart(product, selectedSize, quantity, customNameBadge);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!requireAuth("register", "Please register or sign in to purchase items.")) {
      return;
    }
    addToCart(product, selectedSize, quantity, customNameBadge);
    router.push("/cart");
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button */}
      <Link href="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Store Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
            <img
              src={product.images?.[activeImageIndex] || "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 right-4 px-3 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-lg shadow-md">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? "border-blue-900 scale-105" : "border-slate-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Features bullet list */}
          {product.features?.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Product Highlights</h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {product.features.map((ft, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{ft}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-900 text-white font-bold text-[10px] rounded-md uppercase">
                {product.category}
              </span>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-md">
                Grade: {product.grade}
              </span>
              {product.gender && (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-[10px] rounded-md">
                  {product.gender}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating || 4.8}</span>
                <span className="text-slate-400">({product.reviewsCount || 48} verified parent reviews)</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700 font-bold">
                {product.inStock ? "✓ In Stock for Session 2026-27" : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Official School Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              Saved ₹{(product.originalPrice || product.price) - product.price}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>

          {/* Size Selector */}
          {product.sizes?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900">Select Uniform / Bundle Size:</label>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" /> View Size Chart
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 px-4 rounded-xl border text-xs font-extrabold transition-all ${
                      selectedSize === sz
                        ? "bg-blue-900 text-white border-blue-900 shadow-md scale-105"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Name Badge Tag option */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" /> Optional Embroidered Student Name Badge (+₹50)
              </span>
            </div>
            <input
              type="text"
              value={customNameBadge}
              onChange={(e) => setCustomNameBadge(e.target.value)}
              placeholder="e.g. AARAV SHARMA (Class 5-A)"
              className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-[10px] text-amber-800">
              Name tag will be stitched inside blazer/bag to prevent misplacement at school campus.
            </p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-700">Quantity:</span>
            <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-slate-600 hover:text-slate-900"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-black text-slate-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-slate-600 hover:text-slate-900"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Primary CTA Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              onClick={handleAddToCart}
              className={`py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-blue-900 text-white hover:bg-blue-800"
              }`}
            >
              {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4 text-amber-300" />}
              {isAdded ? "Added to Cart!" : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              className="py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1"
            >
              Buy Now
            </button>
          </div>

          {/* Delivery & Assurance Pills */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
            <div className="p-2 bg-slate-50 rounded-xl text-[11px] text-slate-600">
              <Truck className="w-4 h-4 text-blue-900 mx-auto mb-1" /> Campus Pickup
            </div>
            <div className="p-2 bg-slate-50 rounded-xl text-[11px] text-slate-600">
              <RotateCcw className="w-4 h-4 text-blue-900 mx-auto mb-1" /> Easy Exchange
            </div>
            <div className="p-2 bg-slate-50 rounded-xl text-[11px] text-slate-600">
              <ShieldCheck className="w-4 h-4 text-blue-900 mx-auto mb-1" /> 100% Original
            </div>
          </div>

        </div>

      </div>

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}
