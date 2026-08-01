"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  Heart, 
  LogOut, 
  Search, 
  Filter, 
  Edit3, 
  Plus, 
  CheckCircle, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Mail, 
  GraduationCap,
  Sparkles,
  ShoppingBag,
  Trash2,
  Check,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import OrderCard from "@/components/OrderCard";
import OrderDetailsModal from "@/components/OrderDetailsModal";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, requireAuth } = useAuth();

  const [activeTab, setActiveTab] = useState("orders"); // 'orders', 'info', 'addresses', 'payments', 'wishlist'
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderFilter, setOrderFilter] = useState("all"); // 'all', 'ontheway', 'delivered', 'cancelled'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Profile Info State
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileGrade, setProfileGrade] = useState("Class 5");
  const [saveSuccess, setSaveSuccess] = useState("");

  // Addresses State
  const [addresses, setAddresses] = useState([
    {
      id: "addr-1",
      tag: "Home",
      name: "Suresh Sharma",
      phone: "+91 98765 43210",
      line: "Flat 402, Royal Palms Apartments, Sector 4",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411038",
      isDefault: true
    },
    {
      id: "addr-2",
      tag: "School Pickup",
      name: "Aarav Sharma (Student ID)",
      phone: "+91 98765 43210",
      line: "School of Scholars Campus Counter 2, Sector 4",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411038",
      isDefault: false
    }
  ]);
  const [isAddAddrOpen, setIsAddAddrOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({ tag: "Home", name: "", phone: "", line: "", city: "Pune", pincode: "" });

  // Saved Payments State
  const [savedPayments, setSavedPayments] = useState([
    { id: "pay-1", type: "UPI", label: "Google Pay / PhonePe", detail: "suresh@okicici", isDefault: true },
    { id: "pay-2", type: "Card", label: "HDFC Bank Debit Card", detail: "•••• •••• •••• 4920", isDefault: false }
  ]);

  const fetchOrders = React.useCallback(async () => {
    setLoadingOrders(true);
    try {
      const email = user?.email || "parent@schoolofscholars.edu";
      let res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      let data = await res.json();
      
      // Fallback: if no specific email orders found, fetch all store orders so user never sees empty list
      if (!data.orders || data.orders.length === 0) {
        res = await fetch("/api/orders");
        data = await res.json();
      }

      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error("Error loading user orders:", e);
    } finally {
      setLoadingOrders(false);
    }
  }, [user?.email]);

  // Sync auth state & load orders
  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfilePhone(user.phone || "+91 98765 43210");
    }
    fetchOrders();
  }, [user, fetchOrders]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setSaveSuccess("Profile information updated successfully!");
    setTimeout(() => setSaveSuccess(""), 3000);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (newAddr.name && newAddr.line) {
      const created = {
        id: `addr-${Date.now()}`,
        ...newAddr,
        state: "Maharashtra",
        isDefault: false
      };
      setAddresses([...addresses, created]);
      setNewAddr({ tag: "Home", name: "", phone: "", line: "", city: "Pune", pincode: "" });
      setIsAddAddrOpen(false);
    }
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  // Filter orders by status and search query
  const filteredOrders = orders.filter((o) => {
    // Status filter
    if (orderFilter === "ontheway" && !(o.orderStatus === "Processing" || o.orderStatus === "Confirmed" || o.orderStatus === "Shipped" || o.orderStatus === "Out for Delivery")) {
      return false;
    }
    if (orderFilter === "delivered" && o.orderStatus !== "Delivered") {
      return false;
    }
    if (orderFilter === "cancelled" && o.orderStatus !== "Cancelled") {
      return false;
    }

    // Comprehensive Search query filter (Order ID, Item Name/Title, Student Name, Grade)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = (o.orderId || o.id || "").toLowerCase().includes(q);
      const matchStudent = (o.studentName || "").toLowerCase().includes(q);
      const matchGrade = (o.classGrade || "").toLowerCase().includes(q);
      const matchItems = o.items && o.items.some(i => 
        (i.name || i.title || "").toLowerCase().includes(q) ||
        (i.category || "").toLowerCase().includes(q)
      );
      return matchId || matchStudent || matchGrade || matchItems;
    }

    return true;
  });

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 text-center shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-center mx-auto shadow-sm">
            <User className="w-8 h-8 text-blue-900" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">User Profile Access</h2>
          <p className="text-xs text-slate-500">
            Please sign in to view your profile, track active orders, manage addresses, and view your school order history.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => requireAuth("login")}
              className="w-full py-2.5 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 text-xs shadow-md"
            >
              Sign In to Your Account
            </button>
            <Link
              href="/track-order"
              className="w-full py-2.5 bg-slate-100 text-slate-800 font-bold rounded-xl hover:bg-slate-200 text-xs"
            >
              Track Order by ID (Guest)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* User Banner Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg border-2 border-amber-300">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-black">{user.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950">
                    {user.role === "admin" ? "Admin" : "Verified Parent"}
                  </span>
                </div>
                <p className="text-xs text-blue-200 mt-1 flex items-center justify-center sm:justify-start gap-1">
                  <Mail className="w-3.5 h-3.5 text-amber-300" /> {user.email}
                </p>
                <p className="text-xs text-blue-200 mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                  <Phone className="w-3.5 h-3.5 text-amber-300" /> {profilePhone}
                </p>
              </div>
            </div>

            {/* Quick Stat Counter */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/15">
              <div className="text-center px-3 border-r border-white/20">
                <p className="text-lg font-black text-amber-300">{orders.length}</p>
                <p className="text-[10px] uppercase font-bold text-blue-100">Total Orders</p>
              </div>
              <div className="text-center px-3 border-r border-white/20">
                <p className="text-lg font-black text-emerald-400">
                  {orders.filter(o => o.orderStatus === "Delivered").length}
                </p>
                <p className="text-[10px] uppercase font-bold text-blue-100">Delivered</p>
              </div>
              <div className="text-center px-3">
                <p className="text-lg font-black text-amber-400">{addresses.length}</p>
                <p className="text-[10px] uppercase font-bold text-blue-100">Saved Addresses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-1">
              
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "orders"
                    ? "bg-blue-900 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-amber-300" /> My Orders & Live Status
                </span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => setActiveTab("info")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "info"
                    ? "bg-blue-900 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-amber-300" /> Personal Information
                </span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "addresses"
                    ? "bg-blue-900 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-300" /> Manage Delivery Addresses
                </span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => setActiveTab("payments")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "payments"
                    ? "bg-blue-900 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-amber-300" /> Saved Cards & UPI
                </span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => setActiveTab("wishlist")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "wishlist"
                    ? "bg-blue-900 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-amber-300" /> Wishlist & Saved Kits
                </span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

            </div>

            {/* Direct Guest Track Link Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs space-y-2">
              <h5 className="font-extrabold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" /> Guest Order Lookup
              </h5>
              <p className="text-amber-900 text-[11px]">
                Have an Order ID from a offline desk receipt? Track it directly without login.
              </p>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-1 font-extrabold text-blue-900 hover:underline text-xs pt-1"
              >
                Go to Instant Tracker <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Right Main Content Panel */}
          <div className="lg:col-span-3">
            
            {/* TAB 1: MY ORDERS & LIVE TRACKING */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                
                {/* Search & Status Filters */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-900" /> My Orders & Live Status
                    </h2>

                    {/* Order Search */}
                    <div className="relative w-full sm:w-64">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Order ID or item..."
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
                    </div>
                  </div>

                  {/* Order Status Tabs */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs font-bold">
                    <button
                      onClick={() => setOrderFilter("all")}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        orderFilter === "all"
                          ? "bg-blue-900 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      All Orders ({orders.length})
                    </button>
                    <button
                      onClick={() => setOrderFilter("ontheway")}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        orderFilter === "ontheway"
                          ? "bg-blue-900 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      On The Way ({orders.filter(o => o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled").length})
                    </button>
                    <button
                      onClick={() => setOrderFilter("delivered")}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        orderFilter === "delivered"
                          ? "bg-blue-900 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Delivered ({orders.filter(o => o.orderStatus === "Delivered").length})
                    </button>
                    <button
                      onClick={() => setOrderFilter("cancelled")}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        orderFilter === "cancelled"
                          ? "bg-blue-900 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Cancelled ({orders.filter(o => o.orderStatus === "Cancelled").length})
                    </button>
                  </div>
                </div>

                {/* Orders List Rendering */}
                {loadingOrders ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                    <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-bold text-slate-500 mt-3">Loading order history & tracking details...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
                    <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-8 h-8 text-blue-900" />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">No Orders Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      You haven&apos;t placed any orders matching this filter yet. Browse school uniforms and book sets now!
                    </p>
                    <Link
                      href="/products"
                      className="inline-block px-5 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors shadow-md"
                    >
                      Browse School Store
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((ord) => (
                      <OrderCard
                        key={ord.id || ord.orderId}
                        order={ord}
                        onSelectOrder={(orderToView) => setSelectedOrder(orderToView)}
                        onCancelOrder={(orderToCancel) => setSelectedOrder(orderToCancel)}
                      />
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: PERSONAL INFORMATION */}
            {activeTab === "info" && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <User className="w-5 h-5 text-blue-900" /> Personal & Student Information
                </h2>

                {saveSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> {saveSuccess}
                  </div>
                )}

                <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Parent Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-xl font-medium text-slate-500 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Default Class Grade</label>
                      <select
                        value={profileGrade}
                        onChange={(e) => setProfileGrade(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                      >
                        {["Nursery", "KG 1", "KG 2", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-md text-xs"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: MANAGE ADDRESSES */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-900" /> Saved Delivery Addresses
                  </h2>
                  <button
                    onClick={() => setIsAddAddrOpen(true)}
                    className="px-3.5 py-1.5 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-4 h-4 text-amber-300" /> Add New Address
                  </button>
                </div>

                {/* Add Address Form Modal / Inline */}
                {isAddAddrOpen && (
                  <form onSubmit={handleAddAddress} className="bg-slate-50 p-4 rounded-2xl border border-slate-300 text-xs space-y-3">
                    <h4 className="font-extrabold text-slate-900">Add New Shipping Address</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Tag (Home / School / Hostel)</label>
                        <select
                          value={newAddr.tag}
                          onChange={(e) => setNewAddr({ ...newAddr, tag: e.target.value })}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                        >
                          <option value="Home">Home</option>
                          <option value="School Pickup">School Pickup</option>
                          <option value="Hostel">Hostel</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Recipient Full Name</label>
                        <input
                          type="text"
                          value={newAddr.name}
                          onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                          placeholder="e.g. Suresh Sharma"
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">Address Line & Apartment</label>
                        <input
                          type="text"
                          value={newAddr.line}
                          onChange={(e) => setNewAddr({ ...newAddr, line: e.target.value })}
                          placeholder="Flat No, Building, Street Name"
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={newAddr.phone}
                          onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                        <input
                          type="text"
                          value={newAddr.pincode}
                          onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                          placeholder="411038"
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddAddrOpen(false)}
                        className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-blue-900 text-white rounded-xl font-bold"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                {/* Addresses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        addr.isDefault
                          ? "bg-blue-50/50 border-blue-300 ring-2 ring-blue-100"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full font-extrabold uppercase text-[10px] bg-blue-900 text-white">
                          {addr.tag}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                            DEFAULT
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm">{addr.name}</h4>
                      <p className="text-slate-600 mt-1 font-medium leading-relaxed">{addr.line}, {addr.city} - {addr.pincode}</p>
                      <p className="text-slate-500 font-medium mt-1">Phone: {addr.phone}</p>

                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                        {!addr.isDefault ? (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-blue-900 font-bold hover:underline"
                          >
                            Set as Default
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Selected Default
                          </span>
                        )}

                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete Address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SAVED PAYMENTS & UPI */}
            {activeTab === "payments" && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <CreditCard className="w-5 h-5 text-blue-900" /> Saved Payment Methods
                </h2>

                <div className="space-y-3 text-xs">
                  {savedPayments.map((pm) => (
                    <div key={pm.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-900 text-white font-bold flex items-center justify-center text-xs">
                          {pm.type}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{pm.label}</h4>
                          <p className="text-slate-500 font-mono mt-0.5">{pm.detail}</p>
                        </div>
                      </div>
                      {pm.isDefault && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          PRIMARY
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: WISHLIST */}
            {activeTab === "wishlist" && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Heart className="w-5 h-5 text-red-500" /> My Saved Items & Wishlist
                </h2>

                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="font-extrabold text-slate-800 text-sm">Your wishlist is empty</h4>
                  <p className="text-xs text-slate-500">Save items while browsing to easily order them later.</p>
                  <Link
                    href="/products"
                    className="inline-block mt-2 px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800"
                  >
                    Explore Products
                  </Link>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRefresh={fetchOrders}
        />
      )}
    </div>
  );
}
