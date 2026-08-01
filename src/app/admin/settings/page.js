"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminGuard from "@/components/AdminGuard";
import { 
  Sparkles, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  SlidersHorizontal,
  Eye,
  Shirt,
  BookOpen,
  Laptop
} from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [settings, setSettings] = useState({
    couponTitle: "Exclusive coupon for you!",
    couponDiscount: "Flat 10% Off",
    couponSub: "Up to ₹500 on Grade Kits",
    couponStatus: "Already applied",
    
    card1Title: "Official Blazer & Uniform Sets",
    card1Price: "From ₹1,499*",
    card1Sub: "Pre-order 2026-27 Session",
    
    card2Title: "Complete Grade NCERT Textbook Kits",
    card2Discount: "Up to 25% Off",
    card2Sub: "Includes Textbooks & Workbooks",
    
    card3Title: "Casio Scientific Calculators & Bags",
    card3Price: "Special ₹899",
    card3Sub: "Approved for Class 9 to 12"
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      } catch (e) {
        console.error("Failed to load settings:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (field, val) => {
    setSettings(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Hero section updated live on the Store Home!");
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-8">
          
          <AdminSidebar />

          <main className="flex-1 space-y-6">
            
            {/* Header */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <SlidersHorizontal className="w-6 h-6 text-blue-900" /> Hero Section Content Manager
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Edit homepage promo coupon title, discounts, and banner cards in real-time
                </p>
              </div>

              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="px-5 py-2.5 bg-blue-900 text-white font-black rounded-xl text-xs hover:bg-blue-800 transition-all shadow-md flex items-center gap-2 shrink-0 disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin text-amber-300" /> : <Save className="w-4 h-4 text-amber-300" />}
                <span>Save & Publish Live</span>
              </button>
            </div>

            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {loading ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-900 mx-auto" />
                <p className="text-xs font-bold text-slate-500 mt-2">Loading hero banner settings...</p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* 1. TICKET COUPON SETTINGS */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <span className="w-3 h-3 rounded-full bg-[#0071e3]" />
                    <h2 className="text-base font-extrabold text-slate-900">Top Coupon Ticket Banner</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Coupon Heading Text</label>
                      <input
                        type="text"
                        value={settings.couponTitle}
                        onChange={(e) => handleChange("couponTitle", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                        placeholder="e.g. Exclusive coupon for you!"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Discount Headline</label>
                      <input
                        type="text"
                        value={settings.couponDiscount}
                        onChange={(e) => handleChange("couponDiscount", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                        placeholder="e.g. Flat 10% Off"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sub-Text Details</label>
                      <input
                        type="text"
                        value={settings.couponSub}
                        onChange={(e) => handleChange("couponSub", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                        placeholder="e.g. Up to ₹500 on Grade Kits"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Status Pill Tag</label>
                      <input
                        type="text"
                        value={settings.couponStatus}
                        onChange={(e) => handleChange("couponStatus", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                        placeholder="e.g. Already applied"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CARD 1: UNIFORMS */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Shirt className="w-5 h-5 text-indigo-900" />
                    <h2 className="text-base font-extrabold text-slate-900">Card 1: Official Uniforms</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Card Title</label>
                      <input
                        type="text"
                        value={settings.card1Title}
                        onChange={(e) => handleChange("card1Title", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Price Tag</label>
                      <input
                        type="text"
                        value={settings.card1Price}
                        onChange={(e) => handleChange("card1Price", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sub-Text</label>
                      <input
                        type="text"
                        value={settings.card1Sub}
                        onChange={(e) => handleChange("card1Sub", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. CARD 2: TEXTBOOK KITS */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <BookOpen className="w-5 h-5 text-emerald-700" />
                    <h2 className="text-base font-extrabold text-slate-900">Card 2: Textbook Kits Bundle</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Card Title</label>
                      <input
                        type="text"
                        value={settings.card2Title}
                        onChange={(e) => handleChange("card2Title", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Discount Tag</label>
                      <input
                        type="text"
                        value={settings.card2Discount}
                        onChange={(e) => handleChange("card2Discount", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sub-Text</label>
                      <input
                        type="text"
                        value={settings.card2Sub}
                        onChange={(e) => handleChange("card2Sub", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. CARD 3: TECH & CALCULATORS */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Laptop className="w-5 h-5 text-sky-600" />
                    <h2 className="text-base font-extrabold text-slate-900">Card 3: Student Tech & Tools</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Card Title</label>
                      <input
                        type="text"
                        value={settings.card3Title}
                        onChange={(e) => handleChange("card3Title", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Price / Special Deal Tag</label>
                      <input
                        type="text"
                        value={settings.card3Price}
                        onChange={(e) => handleChange("card3Price", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sub-Text</label>
                      <input
                        type="text"
                        value={settings.card3Sub}
                        onChange={(e) => handleChange("card3Sub", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-[#2874f0] text-white font-extrabold rounded-2xl hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2"
                  >
                    {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>Publish All Changes Live</span>
                  </button>
                </div>

              </form>
            )}

          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
