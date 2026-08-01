"use client";

import React, { useState } from "react";
import { 
  X, 
  Printer, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  Building2, 
  Truck, 
  ShoppingBag,
  CreditCard,
  PhoneCall,
  AlertCircle
} from "lucide-react";
import OrderTrackerTimeline from "./OrderTrackerTimeline";

export default function OrderDetailsModal({ order, isOpen, onClose, onRefresh }) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("Ordered by mistake");
  const [loading, setLoading] = useState(false);
  const [cancelError, setCancelError] = useState("");

  if (!isOpen || !order) return null;

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleConfirmCancel = async () => {
    setLoading(true);
    setCancelError("");
    try {
      const res = await fetch(`/api/orders/${order.id || order.orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: "Cancelled",
          cancelReason
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsCancelling(false);
        if (onRefresh) onRefresh();
      } else {
        setCancelError(data.message || "Failed to cancel order.");
      }
    } catch (e) {
      setCancelError("Network error. Could not cancel order.");
    } finally {
      setLoading(false);
    }
  };

  const canCancel = order.orderStatus === "Processing" || order.orderStatus === "Confirmed";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
              ORD
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                Order Details: <span className="text-amber-300 font-mono">{order.orderId || order.id}</span>
              </h3>
              <p className="text-xs text-blue-200">
                Placed on {new Date(order.createdAt || Date.now()).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintInvoice}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Print Tax Invoice"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-blue-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Live Timeline Component */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              School Live Order Status Tracking
            </h4>
            <OrderTrackerTimeline order={order} />
          </div>

          {/* Purchased Items List */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-900" /> Items in this Order
            </h4>

            <div className="divide-y divide-slate-200/80">
              {order.items && order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-blue-900 font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Size/Option: <strong className="text-slate-700">{item.selectedSize || "Standard"}</strong> | Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-black text-slate-900">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary Breakdown */}
            <div className="pt-3 border-t border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span>₹{(order.totalAmount || 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery & Handling:</span>
                <span className="text-emerald-700 font-bold">FREE (School Promo)</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Paid:</span>
                <span className="text-blue-950 font-black text-base">₹{(order.totalAmount || 0).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Student & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
              <h5 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-600" /> Student Profile Details
              </h5>
              <div className="text-slate-600 space-y-1">
                <p>Student Name: <strong className="text-slate-900 font-bold">{order.studentName}</strong></p>
                <p>Roll Number: <strong className="text-slate-900 font-bold">{order.rollNo}</strong></p>
                <p>Grade & Section: <strong className="text-slate-900 font-bold">{order.classGrade} ({order.section || 'A'})</strong></p>
                <p>Parent Phone: <strong className="text-slate-900 font-bold">{order.parentPhone}</strong></p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
              <h5 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-blue-900" /> Payment & Receipt
              </h5>
              <div className="text-slate-600 space-y-1">
                <p>Payment Method: <strong className="text-slate-900 font-bold">{order.paymentMethod}</strong></p>
                <p>Payment Status: <strong className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>{order.paymentStatus}</strong></p>
                <p>Delivery Method: <strong className="text-blue-900 font-bold">{order.deliveryType}</strong></p>
                <p>Invoice Reference: <strong className="text-slate-900 font-mono">{order.orderId || order.id}</strong></p>
              </div>
            </div>
          </div>

          {/* Cancellation section */}
          {canCancel && !isCancelling && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <p className="font-bold text-amber-950">Changed your mind?</p>
                  <p className="text-amber-800">You can cancel this order before dispatch without any cancellation fee.</p>
                </div>
              </div>
              <button
                onClick={() => setIsCancelling(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shrink-0 shadow-xs"
              >
                Request Order Cancellation
              </button>
            </div>
          )}

          {/* Cancellation Form Modal Inner */}
          {isCancelling && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h5 className="font-extrabold text-red-950 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600" /> Confirm Order Cancellation
                </h5>
                <button
                  onClick={() => setIsCancelling(false)}
                  className="text-red-700 hover:text-red-950 font-bold"
                >
                  Back
                </button>
              </div>

              {cancelError && (
                <p className="p-2 bg-white text-red-700 rounded-lg font-medium border border-red-200">
                  {cancelError}
                </p>
              )}

              <div>
                <label className="block font-bold text-red-900 mb-1">Select Reason for Cancellation:</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2 bg-white border border-red-300 rounded-xl font-medium text-slate-900 focus:outline-none"
                >
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Incorrect size or item selected">Incorrect size or item selected</option>
                  <option value="Purchased directly at school store offline">Purchased directly at school store offline</option>
                  <option value="Delivery time is too long">Delivery time is too long</option>
                  <option value="Other reasons">Other reasons</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsCancelling(false)}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100"
                >
                  Don&apos;t Cancel
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={loading}
                  className="px-4 py-1.5 bg-red-600 text-white rounded-xl font-extrabold hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </div>
          )}

          {/* Support Helpline Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-blue-900 shrink-0" />
              <div>
                <p className="font-bold text-blue-950">Need Help with this Order?</p>
                <p className="text-blue-800 text-[11px]">School Store Desk: +91 (020) 2456-7890 (9 AM - 4 PM)</p>
              </div>
            </div>
            <a
              href="tel:+9102024567890"
              className="px-3 py-1.5 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors"
            >
              Call Support
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
