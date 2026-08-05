"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import PaymentModal from "@/components/PaymentModal";
import { SCHOOL_CLASSES } from "@/lib/seedData";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  GraduationCap, 
  MapPin, 
  Phone, 
  User, 
  Building, 
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft
} from "lucide-react";

export default function CartPage() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    deliveryFee, 
    grandTotal, 
    studentInfo, 
    setStudentInfo 
  } = useCart();

  const { requireAuth } = useAuth();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleStudentInfoChange = (field, value) => {
    setStudentInfo({ ...studentInfo, [field]: value });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();

    if (!requireAuth("register", "Please register or sign in to complete your checkout.")) {
      return;
    }

    if (!studentInfo.studentName || !studentInfo.parentPhone) {
      alert("Please enter Student Name and Parent Phone Number to allocate order.");
      return;
    }
    setIsPaymentModalOpen(true);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Store Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Add student uniforms, NCERT textbook sets, or stationery to proceed with official school order.
        </p>
        <Link
          href="/products"
          className="px-6 py-3 bg-blue-900 text-white font-extrabold rounded-2xl text-xs hover:bg-blue-800 transition-all inline-flex items-center gap-2 shadow-md"
        >
          <ShoppingBag className="w-4 h-4 text-amber-300" /> Browse Store Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-900" /> School Cart & Allocation
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Confirm student details for accurate campus or home fulfillment
          </p>
        </div>
        <Link href="/products" className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT 7 COLS: CART ITEMS LIST */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {cart.map((item, index) => {
              const productId = item.product.id || item.product._id;
              return (
                <div key={`${productId}-${item.selectedSize}-${index}`} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-3.5 flex-1 min-w-0 w-full sm:w-auto">
                    <img
                      src={item.product.images?.[0] || "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800"}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-900 text-white font-bold text-[9px] rounded uppercase">
                          {item.product.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          Grade: {item.product.grade}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm truncate">{item.product.name}</h3>

                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span>Size: <strong className="text-slate-900 font-extrabold">{item.selectedSize}</strong></span>
                        {item.customName && (
                          <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[10px]">
                            Tag: {item.customName} (+₹50)
                          </span>
                        )}
                      </div>

                      <div className="font-extrabold text-slate-900 text-sm pt-1">
                        ₹{item.product.price.toLocaleString("en-IN")}{" "}
                        <span className="text-[10px] text-slate-400 font-normal">/ unit</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls & Delete */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-3 shrink-0">
                    <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50">
                      <button
                        onClick={() => updateQuantity(productId, item.selectedSize, item.quantity - 1)}
                        className="p-1.5 text-slate-600 hover:text-slate-900"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-black text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(productId, item.selectedSize, item.quantity + 1)}
                        className="p-1.5 text-slate-600 hover:text-slate-900"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(productId, item.selectedSize)}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Option Switcher */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-900" /> Select Delivery Option
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleStudentInfoChange("deliveryType", "School Pickup")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  studentInfo.deliveryType === "School Pickup"
                    ? "bg-blue-900 text-white border-blue-900 shadow-md"
                    : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between font-extrabold text-xs mb-1">
                  <span>Campus Store Pickup</span>
                  <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] rounded uppercase font-black">
                    FREE
                  </span>
                </div>
                <p className={`text-[11px] ${studentInfo.deliveryType === "School Pickup" ? "text-blue-100" : "text-slate-500"}`}>
                  Collect directly from School Counter Gate 2 during school hours.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleStudentInfoChange("deliveryType", "Home Delivery")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  studentInfo.deliveryType === "Home Delivery"
                    ? "bg-blue-900 text-white border-blue-900 shadow-md"
                    : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between font-extrabold text-xs mb-1">
                  <span>Deliver to Home Address</span>
                  <span className="text-[11px]">₹99 (Free over ₹1999)</span>
                </div>
                <p className={`text-[11px] ${studentInfo.deliveryType === "Home Delivery" ? "text-blue-100" : "text-slate-500"}`}>
                  Direct courier delivery to your residential address.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLS: STUDENT FORM & ORDER SUMMARY */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Student Allocation Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm border-b border-slate-100 pb-3">
              <GraduationCap className="w-5 h-5 text-amber-600" />
              <span>Student Details Allocation</span>
            </div>

            <form onSubmit={handleProceedToPayment} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Student Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={studentInfo.studentName}
                    onChange={(e) => handleStudentInfoChange("studentName", e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-900"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Class / Grade *</label>
                  <select
                    value={studentInfo.classGrade}
                    onChange={(e) => handleStudentInfoChange("classGrade", e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  >
                    {SCHOOL_CLASSES.slice(1).map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Section / Roll No</label>
                  <input
                    type="text"
                    value={studentInfo.rollNo}
                    onChange={(e) => handleStudentInfoChange("rollNo", e.target.value)}
                    placeholder="Sec A, Roll 18"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Parent Contact Phone *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={studentInfo.parentPhone}
                    onChange={(e) => handleStudentInfoChange("parentPhone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-900"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {studentInfo.deliveryType === "Home Delivery" && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Home Delivery Address *</label>
                  <div className="relative">
                    <textarea
                      required
                      value={studentInfo.deliveryAddress}
                      onChange={(e) => handleStudentInfoChange("deliveryAddress", e.target.value)}
                      placeholder="Street name, Flat/House No, Landmark, Pincode"
                      rows={2}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-900 text-xs"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
            <h3 className="font-extrabold text-base border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Order Total Summary</span>
              <span className="text-xs font-bold text-amber-400">School Session 2026-27</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between text-lg font-black text-white">
                <span>Grand Total</span>
                <span className="text-amber-400">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToPayment}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black rounded-2xl shadow-lg hover:from-amber-400 hover:to-amber-300 transition-all flex items-center justify-center gap-2 text-sm active:scale-98"
            >
              <span>Proceed to Payment Gateway</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}
