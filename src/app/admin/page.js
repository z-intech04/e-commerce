"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminGuard from "@/components/AdminGuard";
import Link from "next/link";
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trash2
} from "lucide-react";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders")
      ]);
      const prodData = await prodRes.json();
      const ordData = await ordRes.json();

      if (prodData.products) setProducts(prodData.products);
      if (ordData.orders) setOrders(ordData.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedMessage("");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSeedMessage(data.message);
        await fetchData();
      }
    } catch (e) {
      setSeedMessage("Failed to seed data.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearAllData = async () => {
    if (!confirm("Are you sure you want to delete ALL store data (products, orders, temporary records)? This allows starting completely fresh from scratch to prevent sample data leaks.")) {
      return;
    }
    setIsClearing(true);
    setSeedMessage("");
    try {
      const res = await fetch("/api/admin/clear-all", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSeedMessage(data.message);
        await fetchData();
      } else {
        setSeedMessage(data.error || "Failed to clear data.");
      }
    } catch (e) {
      setSeedMessage("Error connecting to server to clear data.");
    } finally {
      setIsClearing(false);
    }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-8">
          
          <AdminSidebar />

          <main className="flex-1 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Executive Store Analytics
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Session 2026-27 Revenue & Student Dispatch Overview
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleClearAllData}
                  disabled={isClearing}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
                >
                  {isClearing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>Wipe All Data (Start Fresh)</span>
                </button>

                <button
                  onClick={handleSeedData}
                  disabled={isSeeding}
                  className="px-4 py-2.5 bg-amber-500 text-slate-950 font-black rounded-xl text-xs hover:bg-amber-400 transition-all shadow-md flex items-center gap-2"
                >
                  {isSeeding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                  <span>Restore Demo Inventory</span>
                </button>
              </div>
            </div>

            {seedMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" /> {seedMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales Revenue</span>
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString("en-IN")}</div>
                <p className="text-[10px] text-emerald-700 font-bold">100% Verified Receipts</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Student Orders</span>
                  <div className="p-2 bg-blue-50 text-blue-900 rounded-xl">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{orders.length}</div>
                <p className="text-[10px] text-blue-900 font-bold">Campus & Home Deliveries</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Inventory Items</span>
                  <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{products.length}</div>
                <p className="text-[10px] text-purple-700 font-bold">Uniforms, Books & Stationery</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="font-extrabold text-slate-900 text-sm">Recent Student Orders</h2>
                <Link href="/admin/orders" className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1">
                  View All Orders <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Class</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.orderId || order._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-purple-900">{order.orderId}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{order.studentName}</td>
                        <td className="px-4 py-3 text-slate-600">{order.classGrade}</td>
                        <td className="px-4 py-3 text-slate-600">{order.deliveryType}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">₹{order.totalAmount}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            order.orderStatus === "Delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-900"
                          }`}>
                            {order.orderStatus || "Processing"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
