"use client";

import React from "react";
import { 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  CheckCheck, 
  XCircle, 
  AlertTriangle,
  Building2,
  MapPin,
  ExternalLink
} from "lucide-react";

export default function OrderTrackerTimeline({ order }) {
  if (!order) return null;

  const isCancelled = order.orderStatus === "Cancelled";

  // Standard order stages
  const defaultSteps = [
    { key: "Processing", label: "Order Placed", desc: "Order details received & recorded", icon: Package },
    { key: "Confirmed", label: "Order Confirmed", desc: "Verified & packed by school store", icon: CheckCircle2 },
    { key: "Shipped", label: order.deliveryType === "School Pickup" ? "Ready for Pickup" : "Shipped", desc: order.deliveryType === "School Pickup" ? "Dispatched to Campus Counter" : `Handed over to ${order.courierName || 'Courier Partner'}`, icon: Truck },
    { key: "Out for Delivery", label: order.deliveryType === "School Pickup" ? "At Campus Counter" : "Out for Delivery", desc: order.deliveryType === "School Pickup" ? "Ready at Counter 2 (9 AM - 4 PM)" : "Out for local delivery", icon: MapPin },
    { key: "Delivered", label: order.deliveryType === "School Pickup" ? "Handed Over" : "Delivered", desc: "Successfully delivered", icon: CheckCheck }
  ];

  const getStepStatus = (stepKey, index) => {
    if (isCancelled) return "cancelled";

    const statusOrder = ["Processing", "Confirmed", "Shipped", "Out for Delivery", "Delivered"];
    const currentIndex = statusOrder.indexOf(order.orderStatus);

    if (index < currentIndex) return "completed";
    if (index === currentIndex) return "current";
    return "upcoming";
  };

  const getTimelineDate = (stepKey) => {
    if (order.timeline && Array.isArray(order.timeline)) {
      const found = order.timeline.find(t => t.status === stepKey);
      if (found && found.date) return found.date;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-6">
      
      {/* Tracker Top Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Delivery Type:
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-1">
              {order.deliveryType === "School Pickup" ? <Building2 className="w-3 h-3 text-blue-800" /> : <Truck className="w-3 h-3 text-blue-800" />}
              {order.deliveryType}
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
            {isCancelled ? (
              <span className="text-red-600 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Order Cancelled
              </span>
            ) : (
              <span className="text-emerald-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                Est. {order.deliveryType === "School Pickup" ? "Pickup" : "Delivery"}: <strong className="text-slate-900 font-bold">{order.estimatedDelivery || "Within 2-3 Days"}</strong>
              </span>
            )}
          </h4>
        </div>

        {/* Courier / Tracking ID info badge */}
        {!isCancelled && order.trackingNumber && (
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between sm:justify-start gap-4">
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Tracking / AWB No:</p>
              <p className="font-mono font-bold text-slate-900">{order.trackingNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-500 font-medium">Courier / Desk:</p>
              <p className="font-bold text-blue-900">{order.courierName || "Delhivery Express"}</p>
            </div>
          </div>
        )}
      </div>

      {/* Cancelled Banner */}
      {isCancelled ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-red-950">This order was cancelled</p>
            <p className="mt-0.5 text-red-800">
              If any payment was deducted, refund processing initiates automatically within 3-5 business days to original payment method ({order.paymentMethod}).
            </p>
          </div>
        </div>
      ) : (
        /* Stepper Timeline (Desktop & Mobile Responsive) */
        <div className="py-2">
          {/* Progress Bar Stepper Track (Desktop Horizontal) */}
          <div className="hidden md:block relative mb-8">
            <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 rounded-full -z-0">
              {/* Active fill line */}
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    order.orderStatus === "Processing" ? "10%" :
                    order.orderStatus === "Confirmed" ? "33%" :
                    order.orderStatus === "Shipped" ? "66%" :
                    order.orderStatus === "Out for Delivery" ? "85%" :
                    order.orderStatus === "Delivered" ? "100%" : "0%"
                  }`
                }}
              />
            </div>

            <div className="grid grid-cols-5 relative z-10 text-center">
              {defaultSteps.map((step, idx) => {
                const state = getStepStatus(step.key, idx);
                const stepDate = getTimelineDate(step.key);
                const IconComponent = step.icon;

                return (
                  <div key={step.key} className="flex flex-col items-center group">
                    {/* Circle Node */}
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all border-2 shadow-sm ${
                        state === "completed"
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : state === "current"
                          ? "bg-blue-900 text-white border-blue-900 ring-4 ring-blue-100 animate-pulse"
                          : "bg-white text-slate-400 border-slate-300"
                      }`}
                    >
                      {state === "completed" ? (
                        <CheckCheck className="w-5 h-5" />
                      ) : (
                        <IconComponent className="w-4 h-4" />
                      )}
                    </div>

                    {/* Step Title */}
                    <p className={`text-xs font-bold mt-2.5 ${
                      state === "completed" ? "text-slate-900" :
                      state === "current" ? "text-blue-900 font-extrabold" : "text-slate-400"
                    }`}>
                      {step.label}
                    </p>

                    {/* Step Date */}
                    {stepDate && (
                      <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                        {stepDate}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vertical Stepper List (Mobile & Detail View) */}
          <div className="space-y-4 md:space-y-3 relative pl-4 border-l-2 border-slate-200 ml-2">
            {defaultSteps.map((step, idx) => {
              const state = getStepStatus(step.key, idx);
              const stepDate = getTimelineDate(step.key);
              const IconComponent = step.icon;

              return (
                <div key={step.key} className="relative flex items-start gap-3.5 group">
                  {/* Vertical Node Indicator */}
                  <div 
                    className={`absolute -left-[25px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold shadow-xs ${
                      state === "completed"
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : state === "current"
                        ? "bg-blue-900 text-white border-blue-900 ring-2 ring-blue-100"
                        : "bg-white text-slate-400 border-slate-300"
                    }`}
                  >
                    {state === "completed" ? <CheckCheck className="w-3.5 h-3.5" /> : idx + 1}
                  </div>

                  <div className="flex-1 bg-slate-50/60 p-3 rounded-xl border border-slate-100 group-hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className={`text-xs font-bold ${
                        state === "completed" ? "text-slate-900" :
                        state === "current" ? "text-blue-900 font-extrabold" : "text-slate-500"
                      }`}>
                        {step.label}
                      </h5>

                      {stepDate && (
                        <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {stepDate}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Address & Delivery Receiver Details Box */}
      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block mb-1">
            Shipping Address / Pickup Desk
          </span>
          <p className="font-bold text-slate-900">{order.studentName} ({order.classGrade} - {order.section})</p>
          <p className="text-slate-600 mt-0.5 font-medium leading-relaxed">{order.deliveryAddress}</p>
        </div>

        <div>
          <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block mb-1">
            Contact & Roll Info
          </span>
          <p className="text-slate-700">Roll No: <strong className="text-slate-900 font-bold">{order.rollNo}</strong></p>
          <p className="text-slate-700 mt-0.5">Parent Mobile: <strong className="text-slate-900 font-bold">{order.parentPhone}</strong></p>
          <p className="text-slate-700 mt-0.5">Payment: <strong className="text-emerald-700 font-bold">{order.paymentMethod} ({order.paymentStatus})</strong></p>
        </div>
      </div>

    </div>
  );
}
