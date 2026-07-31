"use client";

import React from "react";
import { SCHOOL_CLASSES } from "@/lib/seedData";
import { useCart } from "@/context/CartContext";
import { X, Check, GraduationCap, Sparkles } from "lucide-react";

export default function GradeSelectorModal({ isOpen, onClose }) {
  const { selectedGrade, setSelectedGrade } = useCart();

  if (!isOpen) return null;

  const handleSelect = (grade) => {
    setSelectedGrade(grade);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Select Student Grade / Class</h2>
            <p className="text-xs text-slate-500">Filter uniform sizes and book bundles specifically for your child</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex items-center gap-2 text-amber-900 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Selecting a class automatically displays CBSE/State approved books and tailored uniform sizes.</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {SCHOOL_CLASSES.map((cls) => {
            const isSelected = selectedGrade === cls;
            return (
              <button
                key={cls}
                onClick={() => handleSelect(cls)}
                className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-blue-900 text-white border-blue-900 shadow-md scale-102"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-800 hover:bg-blue-50/50"
                }`}
              >
                <span>{cls}</span>
                {isSelected && <Check className="w-4 h-4 text-amber-300" />}
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
}
