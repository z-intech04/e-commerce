"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Package, 
  Truck, 
  Building2, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Printer, 
  PhoneCall,
  Clock,
  Sparkles
} from "lucide-react";
import OrderTrackerTimeline from "@/components/OrderTrackerTimeline";
import OrderDetailsModal from "@/components/OrderDetailsModal";

export default function TrackOrderPage() {
  const [searchId, setSearchId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Sample quick test buttons
  const quickTestOrders = ["ORD-2026-8801", "ORD-2026-7210", "ORD-2026-9043"];

  const handleSearch = async (e, customId = null) => {
    if (e) e.preventDefault();
    const query = (customId || searchId).trim();
    if (!query) return;

    setLoading(true);
    setErrorMsg("");
    setSearchedOrder(null);

    try {
      const res = await fetch(`/api/orders?orderId=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.success && data.orders && data.orders.length > 0) {
        setSearchedOrder(data.orders[0]);
      } else {
        // Fallback: search single order route
        const resSingle = await fetch(`/api/orders/${encodeURIComponent(query)}`);
        const dataSingle = await resSingle.json();
        if (dataSingle.success && dataSingle.order) {
          setSearchedOrder(dataSingle.order);
        } else {
          setErrorMsg(`No order found matching "${query}". Please verify your Order ID on your receipt.`);
        }
      }
    } catch (err) {
      setErrorMsg("Failed to connect to order tracking service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store Home
          </Link>
        </div>

        {/* Top Header Card */}
        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-10 text-center shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> School of Scholars Live Tracker
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Track Your School Order
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
              Enter your Order ID (e.g., ORD-2026-8801) from your receipt or SMS to view real-time status and delivery timeline.
            </p>

            {/* Tracking Search Form */}
            <form onSubmit={handleSearch} className="pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-2xl shadow-lg border border-white/20">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Enter Order ID (e.g. ORD-2026-8801)..."
                    className="w-full pl-10 pr-4 py-3 text-slate-900 text-sm font-bold bg-transparent focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                    required
                  />
                  <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-colors shadow-md disabled:opacity-50 shrink-0"
                >
                  {loading ? "Searching..." : "Track Status"}
                </button>
              </div>
            </form>

            {/* Quick Demo Test Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-blue-200 font-medium text-[11px]">Sample IDs:</span>
              {quickTestOrders.map((id) => (
                <button
                  key={id}
                  onClick={(e) => {
                    setSearchId(id);
                    handleSearch(e, id);
                  }}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-amber-300 font-mono text-[11px] font-bold border border-white/10 transition-colors"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message Alert */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-900 flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="font-extrabold text-red-950">Order Not Found</p>
              <p className="mt-0.5 text-red-800">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Result Live Tracker Section */}
        {searchedOrder && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-extrabold">Order Found: {searchedOrder.orderId || searchedOrder.id}</span>
              </div>
              <span className="font-bold text-slate-700">
                Student: {searchedOrder.studentName} ({searchedOrder.classGrade})
              </span>
            </div>

            {/* Stepper Visual Timeline */}
            <OrderTrackerTimeline order={searchedOrder} />
          </div>
        )}

      </div>
    </div>
  );
}
