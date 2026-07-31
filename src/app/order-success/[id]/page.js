"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Printer, 
  ShoppingBag, 
  GraduationCap, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Package, 
  Truck, 
  Check
} from "lucide-react";

export default function OrderSuccessPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders`);
        const data = await res.json();
        if (data.orders) {
          const matched = data.orders.find((o) => o.orderId === id || o._id === id);
          if (matched) setOrder(matched);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-slate-500">Generating Official Receipt...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:p-0">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white rounded-3xl p-8 shadow-xl text-center space-y-4 print:hidden">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Order Placed Successfully!</h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Thank you for ordering through School of Scholars Official Supply Portal.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-950/40 rounded-xl text-amber-300 font-mono font-bold text-xs">
          Order ID: {id}
        </div>
      </div>

      {/* Printable Official Receipt Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg space-y-8 print:shadow-none print:border-none print:p-0">
        
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 text-amber-300 flex items-center justify-center font-black">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">School of Scholars</h2>
              <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">Official Supply Receipt</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500">
            <p><strong className="text-slate-900">Receipt No:</strong> {order?.orderId || id}</p>
            <p><strong className="text-slate-900">Date:</strong> {order?.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "31 July 2026"}</p>
            <p><strong className="text-slate-900">Payment Method:</strong> {order?.paymentMethod || "UPI (GPay)"}</p>
          </div>
        </div>

        {/* Student & Delivery Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs">
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-blue-900">
              Student Information
            </h3>
            <p><strong className="text-slate-700">Student Name:</strong> {order?.studentName || "Aarav Sharma"}</p>
            <p><strong className="text-slate-700">Class & Grade:</strong> {order?.classGrade || "Class 5"} ({order?.section || "Sec A"})</p>
            <p><strong className="text-slate-700">Roll Number:</strong> {order?.rollNo || "15"}</p>
            <p><strong className="text-slate-700">Parent Contact:</strong> {order?.parentPhone || "+91 98765 43210"}</p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-blue-900">
              Fulfillment & Delivery
            </h3>
            <p><strong className="text-slate-700">Delivery Option:</strong> {order?.deliveryType || "School Campus Pickup"}</p>
            <p><strong className="text-slate-700">Address / Location:</strong> {order?.deliveryAddress || "School Campus Gate 2 Store Counter"}</p>
            <p><strong className="text-slate-700">Status:</strong> <span className="font-bold text-emerald-700">Payment Confirmed</span></p>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Ordered Items Breakdown</h3>
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Item Description</th>
                  <th className="px-4 py-3">Size / Specs</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {order?.items ? (
                  order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-bold text-slate-900">{item.name}</td>
                      <td className="px-4 py-3 text-slate-500">{item.selectedSize || "Standard"}</td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">₹{item.price.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 text-right font-bold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-3 font-bold text-slate-900">Official Uniform Blazer & Book Set</td>
                    <td className="px-4 py-3 text-slate-500">Size 32</td>
                    <td className="px-4 py-3 text-center">1</td>
                    <td className="px-4 py-3 text-right">₹2,499</td>
                    <td className="px-4 py-3 text-right font-bold">₹2,499</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total calculation */}
        <div className="flex justify-end pt-2">
          <div className="w-full sm:w-64 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between font-extrabold text-slate-900 text-base border-t border-slate-200 pt-2">
              <span>Total Paid</span>
              <span className="text-blue-900">₹{(order?.totalAmount || 2499).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Live Order Tracker visual */}
        <div className="pt-6 border-t border-slate-100 space-y-4 print:hidden">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Live Order Dispatch Tracker</h3>
          <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
            <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 space-y-1">
              <Check className="w-5 h-5 mx-auto text-emerald-700" />
              <span>Confirmed</span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-900 rounded-2xl border border-blue-200 space-y-1 animate-pulse">
              <Package className="w-5 h-5 mx-auto text-blue-900" />
              <span>Packing Bundle</span>
            </div>
            <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl border border-slate-200 space-y-1">
              <Truck className="w-5 h-5 mx-auto" />
              <span>Out for Pickup</span>
            </div>
            <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl border border-slate-200 space-y-1">
              <CheckCircle2 className="w-5 h-5 mx-auto" />
              <span>Delivered</span>
            </div>
          </div>
        </div>

        {/* Print & Action Buttons */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <button
            onClick={handlePrintReceipt}
            className="px-5 py-2.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-200 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Download / Print Receipt PDF
          </button>

          <Link
            href="/products"
            className="px-6 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" /> Back to Store
          </Link>
        </div>

      </div>
    </div>
  );
}
