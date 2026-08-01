"use client";

import React from "react";
import { 
  Package, 
  ChevronRight, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText,
  RotateCcw,
  ShoppingBag,
  Building2
} from "lucide-react";

export default function OrderCard({ order, onSelectOrder, onCancelOrder }) {
  if (!order) return null;

  const isCancelled = order.orderStatus === "Cancelled";
  const isDelivered = order.orderStatus === "Delivered";
  const canCancel = order.orderStatus === "Processing" || order.orderStatus === "Confirmed";

  // Status Badge Helper
  const getStatusBadge = () => {
    switch (order.orderStatus) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Delivered
          </span>
        );
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <Truck className="w-3.5 h-3.5 text-blue-700" /> Shipped & In Transit
          </span>
        );
      case "Processing":
      case "Confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" /> Processing
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3.5 h-3.5 text-red-700" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
            {order.orderStatus}
          </span>
        );
    }
  };

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : "Recently";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200">
      
      {/* Top Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono font-extrabold text-slate-900">{order.orderId || order.id}</span>
            <span className="text-slate-400 font-medium ml-2">Placed on {formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge()}
        </div>
      </div>

      {/* Items Preview */}
      <div className="py-4 space-y-3">
        {order.items && order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400 font-bold text-xs">
              <ShoppingBag className="w-5 h-5 text-blue-900" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {item.name}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Qty: {item.quantity} | Size/Option: <strong className="text-slate-700">{item.selectedSize || "Standard"}</strong>
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs sm:text-sm font-black text-slate-900">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        
        {/* Total & Student Tag */}
        <div>
          <span className="text-slate-500 font-medium">Total Amount: </span>
          <strong className="text-sm font-extrabold text-blue-950">
            ₹{order.totalAmount ? order.totalAmount.toLocaleString("en-IN") : 0}
          </strong>
          <span className="text-slate-400 text-[11px] font-medium block">
            Student: {order.studentName} ({order.classGrade})
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {canCancel && onCancelOrder && (
            <button
              onClick={() => onCancelOrder(order)}
              className="px-3 py-1.5 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors"
            >
              Cancel Order
            </button>
          )}

          <button
            onClick={() => onSelectOrder(order)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
          >
            <span>Track Order & Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
