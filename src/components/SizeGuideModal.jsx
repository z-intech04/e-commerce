"use client";

import React from "react";
import { X, Ruler, Info } from "lucide-react";

export default function SizeGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shadow-xs">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Official Uniform Size Measurement Chart</h2>
            <p className="text-xs text-slate-500">School of Scholars standard sizing guidelines in inches</p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl mb-4">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Size Tag</th>
                <th className="px-4 py-3">Recommended Class</th>
                <th className="px-4 py-3">Chest (Inches)</th>
                <th className="px-4 py-3">Waist (Inches)</th>
                <th className="px-4 py-3">Blazer / Shirt Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-bold text-blue-900">Size 24-26</td>
                <td className="px-4 py-2.5">Nursery / LKG / UKG</td>
                <td className="px-4 py-2.5">24" - 26"</td>
                <td className="px-4 py-2.5">20" - 22"</td>
                <td className="px-4 py-2.5">18"</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-bold text-blue-900">Size 28-30</td>
                <td className="px-4 py-2.5">Class 1 to Class 3</td>
                <td className="px-4 py-2.5">28" - 30"</td>
                <td className="px-4 py-2.5">23" - 25"</td>
                <td className="px-4 py-2.5">21"</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-bold text-blue-900">Size 32-34</td>
                <td className="px-4 py-2.5">Class 4 to Class 7</td>
                <td className="px-4 py-2.5">32" - 34"</td>
                <td className="px-4 py-2.5">26" - 28"</td>
                <td className="px-4 py-2.5">24"</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-bold text-blue-900">Size 36-38</td>
                <td className="px-4 py-2.5">Class 8 to Class 10</td>
                <td className="px-4 py-2.5">36" - 38"</td>
                <td className="px-4 py-2.5">29" - 32"</td>
                <td className="px-4 py-2.5">27"</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-bold text-blue-900">Size 40+</td>
                <td className="px-4 py-2.5">Class 11 & Class 12</td>
                <td className="px-4 py-2.5">40" - 42"</td>
                <td className="px-4 py-2.5">33" - 36"</td>
                <td className="px-4 py-2.5">29"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2 text-xs text-blue-950 font-medium">
          <Info className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
          <p>
            <strong>Note for Blazer Fitting:</strong> We recommend selecting 1 size larger than exact chest measurement to comfortably wear over woollen sweaters during winter. Free size exchange at school store within 7 days.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
