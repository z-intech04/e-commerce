"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Phone, Mail, MapPin, ShieldCheck, Clock, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t-4 border-amber-500 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-white text-base tracking-tight">School of Scholars</h3>
                <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Official Supply Portal</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Providing top-quality official uniforms, CBSE/NCERT textbook sets, specialized stationery, and ergonomic school accessories directly to School of Scholars families.
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Quality Guaranteed & Verified Specs
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Categories
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/products?category=Uniforms" className="hover:text-amber-400 transition-colors">
                  Official Blazer & Uniforms
                </Link>
              </li>
              <li>
                <Link href="/products?category=Books%20%26%20Notebooks" className="hover:text-amber-400 transition-colors">
                  Class 1-12 Textbook Bundles
                </Link>
              </li>
              <li>
                <Link href="/products?category=Stationery" className="hover:text-amber-400 transition-colors">
                  Geometry & Math Sets
                </Link>
              </li>
              <li>
                <Link href="/products?category=Bags%20%26%20Accessories" className="hover:text-amber-400 transition-colors">
                  Orthopedic Bags & Bottles
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-amber-400 transition-colors">
                  View Full Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Store & Pickup Hours */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Campus Distribution
            </h4>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Main Campus Desk: Gate No. 2, Admin Block, School of Scholars Campus</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mon - Sat: 8:30 AM to 4:30 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Campus Store Desk: +91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>store@schoolofscholars.edu</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Payment Methods & Security */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Accepted Payments
            </h4>
            <p className="text-slate-400 text-xs mb-3">
              We support instant digital payments for hassle-free student distribution:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2.5 py-1 bg-slate-800 rounded font-bold text-slate-200 border border-slate-700">UPI / GPay</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded font-bold text-slate-200 border border-slate-700">PhonePe</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded font-bold text-slate-200 border border-slate-700">Debit / Credit Card</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded font-bold text-slate-200 border border-slate-700">NetBanking</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded font-bold text-amber-400 border border-slate-700">Cash on Delivery</span>
            </div>
            <p className="text-[11px] text-slate-500">
              * Official receipts with Student Roll No are generated immediately upon order confirmation.
            </p>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-xs gap-3">
          <div className="flex items-center gap-2">
            <span>© 2026 <strong>Z INTECH</strong>. All Rights Reserved. Built for Excellence.</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
            <a 
              href="https://zintech.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-amber-400 hover:underline"
            >
              <Globe className="w-3.5 h-3.5" /> zintech.in
            </a>
            <span className="text-slate-700">|</span>
            <Link href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-amber-400 transition-colors">Uniform Exchange Rules</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
