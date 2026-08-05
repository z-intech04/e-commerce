"use client";

import React, { useEffect, useState } from "react";
import SuperAdminGuard from "@/components/SuperAdminGuard";
import { useAuth } from "@/context/AuthContext";
import { 
  ShieldCheck, 
  UserPlus, 
  PauseCircle, 
  PlayCircle, 
  Trash2, 
  Key, 
  Mail, 
  User, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  X, 
  Lock, 
  Sparkles, 
  ShoppingBag, 
  DollarSign, 
  Layers, 
  Shield, 
  Edit3,
  SlidersHorizontal
} from "lucide-react";

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [stats, setStats] = useState({
    totalAdmins: 0,
    activeAdmins: 0,
    pausedAdmins: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "Inventory Operations"
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    department: ""
  });

  // Self credentials form state
  const [selfForm, setSelfForm] = useState({
    email: user?.email || "superadmin@zintech.com",
    password: ""
  });
  const [selfSuccess, setSelfSuccess] = useState("");

  const fetchSuperAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/super-admin/admins");
      const data = await res.json();
      if (data.success) {
        setAdmins(data.admins || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  const handleCreateAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/super-admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm)
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Admin account created successfully!");
        setIsCreateModalOpen(false);
        setCreateForm({ name: "", email: "", password: "", department: "Inventory Operations" });
        await fetchSuperAdminData();
      } else {
        alert(data.message || "Failed to create Admin account.");
      }
    } catch (e) {
      alert("Error creating admin account.");
    }
  };

  const handleToggleAdminStatus = async (admin) => {
    const adminId = admin.id || admin._id;
    const newStatus = admin.status === "paused" ? "active" : "paused";
    const actionText = newStatus === "paused" ? "pause" : "resume";

    if (!confirm(`Are you sure you want to ${actionText} the admin account for ${admin.name}?`)) return;

    try {
      const res = await fetch("/api/super-admin/admins", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        await fetchSuperAdminData();
      } else {
        alert(data.message || "Failed to update admin status.");
      }
    } catch (e) {
      alert("Error updating admin status.");
    }
  };

  const handleOpenEditModal = (admin) => {
    setSelectedAdmin(admin);
    setEditForm({
      name: admin.name,
      email: admin.email,
      password: "",
      department: admin.department || "Operations"
    });
    setIsEditModalOpen(true);
  };

  const handleEditAdminSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;
    const adminId = selectedAdmin.id || selectedAdmin._id;

    try {
      const res = await fetch("/api/super-admin/admins", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId,
          name: editForm.name,
          email: editForm.email,
          ...(editForm.password && { password: editForm.password }),
          department: editForm.department
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Admin credentials updated!");
        setIsEditModalOpen(false);
        await fetchSuperAdminData();
      } else {
        alert(data.message || "Failed to update admin credentials.");
      }
    } catch (e) {
      alert("Error updating admin credentials.");
    }
  };

  const handleDeleteAdmin = async (admin) => {
    const adminId = admin.id || admin._id;
    if (admin.role === "superadmin") {
      alert("Cannot delete master Super Admin account.");
      return;
    }
    if (!confirm(`Permanently delete admin account for ${admin.name}? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/super-admin/admins?adminId=${adminId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await fetchSuperAdminData();
      } else {
        alert(data.message || "Failed to delete admin.");
      }
    } catch (e) {
      alert("Error deleting admin account.");
    }
  };

  const handleSelfUpdate = async (e) => {
    e.preventDefault();
    setSelfSuccess("");
    try {
      const userId = user?.id || user?._id;
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_credentials",
          userId,
          newEmail: selfForm.email,
          ...(selfForm.password && { newPassword: selfForm.password })
        })
      });
      const data = await res.json();
      if (data.success) {
        setSelfSuccess("Super Admin credentials updated successfully! Changes will reflect on next login.");
        setSelfForm((prev) => ({ ...prev, password: "" }));
      } else {
        alert(data.message || "Failed to update credentials.");
      }
    } catch (e) {
      alert("Error updating credentials.");
    }
  };

  const filteredAdmins = admins.filter((a) => {
    if (statusFilter !== "All" && a.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.department && a.department.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <SuperAdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* COMPANY BRANDING HEADER */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded-md uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-slate-950" /> Official Super Admin Authority
              </span>
              <span className="px-3 py-1 bg-slate-800 text-slate-300 font-mono text-[10px] rounded-md font-bold">
                Session 2026-27
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
              <span>Z INTECH PRIVATE LIMITED</span>
            </h1>

            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Master Governance & Multi-Tier Admin Command Center. Manage Store Administrators, pause/resume accounts, update credentials, and monitor system metrics.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 shrink-0">
            <button
              onClick={fetchSuperAdminData}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-extrabold transition-all border border-slate-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" /> Refresh System Stats
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-2xl text-xs transition-all shadow-lg flex items-center gap-2 active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-slate-950" /> Provision New Admin
            </button>
          </div>
        </div>

        {/* OVERVIEW SYSTEM STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Managed Admin Accounts</span>
              <User className="w-4 h-4 text-purple-700" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalAdmins}</span>
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">{stats.activeAdmins} Active</span>
                {stats.pausedAdmins > 0 && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded">{stats.pausedAdmins} Paused</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>System Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Fulfillment Orders</span>
              <ShoppingBag className="w-4 h-4 text-blue-900" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.totalOrders}
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Active Catalog Inventory</span>
              <Layers className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.totalProducts}
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT 8 COLS: ADMIN MANAGEMENT TABLE */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-black text-slate-900 text-base">Store Administrator Governance</h2>
                <p className="text-xs text-slate-500 font-medium">Control admin access status (Pause / Resume) or update credentials</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search admins..."
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="All">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>

            {/* Admins List Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Showing {filteredAdmins.length} Administrator Accounts</span>
                <span className="text-amber-800 font-extrabold text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Master Authority: Z INTECH
                </span>
              </div>

              {loading ? (
                <div className="p-8 text-center text-xs font-bold text-slate-500">Loading Admin Governance Data...</div>
              ) : filteredAdmins.length === 0 ? (
                <div className="p-8 text-center text-xs font-bold text-slate-500">No Admin accounts found matching query.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredAdmins.map((admin) => (
                    <div key={admin.id || admin._id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                      
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 ${
                          admin.role === "superadmin" ? "bg-amber-500 text-slate-950" : "bg-purple-900"
                        }`}>
                          {admin.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-slate-900 text-sm truncate">{admin.name}</h3>
                            {admin.role === "superadmin" ? (
                              <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[9px] rounded uppercase">
                                Super Admin
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-purple-900 text-white font-bold text-[9px] rounded uppercase">
                                Admin
                              </span>
                            )}

                            {/* Status Badge */}
                            <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase tracking-wider ${
                              admin.status === "paused"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                            }`}>
                              {admin.status === "paused" ? "✕ PAUSED" : "✓ ACTIVE"}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 font-mono font-medium truncate">{admin.email}</p>
                          <p className="text-[11px] text-slate-400">Department: <strong className="text-slate-700 font-bold">{admin.department || "Operations"}</strong></p>
                        </div>
                      </div>

                      {/* Action Control Buttons */}
                      {admin.role !== "superadmin" && (
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {/* Pause / Resume Button */}
                          <button
                            onClick={() => handleToggleAdminStatus(admin)}
                            className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                              admin.status === "paused"
                                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                : "bg-amber-500 hover:bg-amber-400 text-slate-950"
                            }`}
                            title={admin.status === "paused" ? "Resume Admin Account Access" : "Pause Admin Account Access"}
                          >
                            {admin.status === "paused" ? (
                              <>
                                <PlayCircle className="w-4 h-4" /> Resume Access
                              </>
                            ) : (
                              <>
                                <PauseCircle className="w-4 h-4" /> Pause Access
                              </>
                            )}
                          </button>

                          {/* Edit Email / Reset Password Button */}
                          <button
                            onClick={() => handleOpenEditModal(admin)}
                            className="p-2 bg-blue-50 text-blue-900 hover:bg-blue-100 rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
                            title="Edit Admin Email & Password"
                          >
                            <Key className="w-4 h-4" />
                            <span className="hidden sm:inline">Credentials</span>
                          </button>

                          {/* Delete Admin Button */}
                          <button
                            onClick={() => handleDeleteAdmin(admin)}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                            title="Delete Admin Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT 4 COLS: SUPER ADMIN CREDENTIALS SETTINGS */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm border-b border-slate-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <span>Z INTECH Master Credentials</span>
              </div>

              <p className="text-xs text-slate-500">
                Update your Super Admin master email address and access password.
              </p>

              {selfSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-bold">
                  {selfSuccess}
                </div>
              )}

              <form onSubmit={handleSelfUpdate} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Super Admin Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={selfForm.email}
                      onChange={(e) => setSelfForm({ ...selfForm, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 font-bold"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">New Master Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Leave blank to keep current"
                      value={selfForm.password}
                      onChange={(e) => setSelfForm({ ...selfForm, password: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 font-bold"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 text-white font-extrabold text-xs rounded-xl hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4 text-amber-400" /> Update Master Credentials
                </button>
              </form>
            </div>

            <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl text-amber-950 space-y-2 text-xs">
              <h4 className="font-extrabold flex items-center gap-1.5 text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" /> Governance Rules & Safeguards:
              </h4>
              <ul className="space-y-1 text-slate-700 text-[11px] list-disc pl-4">
                <li>Admins **cannot self-register** on the storefront.</li>
                <li>Pausing an Admin account **blocks access immediately** with a suspension notification.</li>
                <li>Super Admin can reset any Admin password or update their email instantly.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* MODAL 1: PROVISION NEW ADMIN ACCOUNT */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative">
            
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                <UserPlus className="w-4 h-4" /> Z INTECH Admin Provisioning
              </div>
              <h3 className="text-xl font-black text-slate-900">Create New Admin Account</h3>
              <p className="text-xs text-slate-500">Provide credentials for the store manager.</p>
            </div>

            <form onSubmit={handleCreateAdminSubmit} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Official Admin Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. manager@schoolofscholars.edu"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Temporary Login Password *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin123"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Department / Role</label>
                <select
                  value={createForm.department}
                  onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                >
                  <option value="Inventory & Fulfillment">Inventory & Fulfillment</option>
                  <option value="Orders Management">Orders Management</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="General Operations">General Operations</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
                >
                  Provision Admin Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ADMIN EMAIL & RESET PASSWORD */}
      {isEditModalOpen && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative">
            
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
                <Key className="w-4 h-4" /> Z INTECH Credentials Manager
              </div>
              <h3 className="text-xl font-black text-slate-900">Edit Admin Email & Password</h3>
              <p className="text-xs text-slate-500">Updating credentials for <strong className="text-slate-900">{selectedAdmin.name}</strong>.</p>
            </div>

            <form onSubmit={handleEditAdminSubmit} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Admin Display Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Admin Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Reset Password</label>
                <input
                  type="password"
                  placeholder="Enter new password (or leave blank to keep unchanged)"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Department</label>
                <input
                  type="text"
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
                >
                  Save Credential Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </SuperAdminGuard>
  );
}
