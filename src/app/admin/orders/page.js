"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminGuard from "@/components/AdminGuard";
import { 
  ShoppingBag, 
  CheckCircle2, 
  Truck, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  RefreshCw,
  Search,
  Filter
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      await fetchOrders();
    } catch (e) {
      alert("Failed to update order status.");
    }
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== "All" && o.orderStatus !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderId.toLowerCase().includes(q) ||
        o.studentName.toLowerCase().includes(q) ||
        o.classGrade.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-8">
          
          <AdminSidebar />

          <main className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Student Orders & Fulfillment
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Track incoming orders, update status, and manage campus counter pickups
                </p>
              </div>

              <button
                onClick={fetchOrders}
                className="px-4 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-200 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Refresh Orders List
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Order ID, Student Name, Class..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-semibold"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-bold"
                >
                  <option value="All">All Statuses</option>
                  <option value="Processing">Processing</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped / Out for Pickup</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="p-8 text-center text-xs font-bold text-slate-500">Loading Orders...</div>
              ) : filtered.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-500 font-medium">
                  No orders match your filter criteria.
                </div>
              ) : (
                filtered.map((order) => (
                  <div
                    key={order.orderId || order._id}
                    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-purple-900 text-white font-mono font-bold text-xs rounded-xl">
                          {order.orderId}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : "Recent"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Status:</span>
                        <select
                          value={order.orderStatus || "Processing"}
                          onChange={(e) => handleUpdateStatus(order.orderId || order._id, e.target.value)}
                          className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-extrabold text-amber-950 focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped / Out for Pickup</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <h4 className="font-bold text-slate-400 uppercase text-[10px]">Student</h4>
                        <p className="font-extrabold text-slate-900">{order.studentName}</p>
                        <p className="text-slate-500">{order.classGrade} ({order.section || "A"}) | Roll #{order.rollNo}</p>
                        <p className="text-slate-500">{order.parentPhone}</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-400 uppercase text-[10px]">Fulfillment</h4>
                        <p className="font-bold text-blue-900">{order.deliveryType}</p>
                        <p className="text-slate-500 line-clamp-2">{order.deliveryAddress}</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-400 uppercase text-[10px]">Payment</h4>
                        <p className="font-extrabold text-slate-900">₹{order.totalAmount}</p>
                        <p className="text-emerald-700 font-bold">{order.paymentMethod}</p>
                      </div>
                    </div>

                    {order.items?.length > 0 && (
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                        <span className="font-bold text-slate-700 block mb-1">Items ({order.items.length}):</span>
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((it, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-800">
                              {it.name} <strong className="text-blue-900">x{it.quantity}</strong> ({it.selectedSize})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
