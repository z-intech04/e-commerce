"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Navigation, X, Check, Search, Building2, Compass, Loader2 } from "lucide-react";

export function getStoredLocation() {
  if (typeof window === "undefined") return "Location not set";
  try {
    return localStorage.getItem("sos_user_location") || "Location not set";
  } catch (e) {
    return "Location not set";
  }
}

export function autoDetectLocationSilent(onSuccess) {
  if (typeof window === "undefined") return;

  // 1. Try Browser Geolocation API first
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          if (data && data.address) {
            const addr = data.address;
            const area = addr.suburb || addr.neighbourhood || addr.residential || addr.road || addr.subdistrict || "";
            const city = addr.city || addr.town || addr.district || addr.county || addr.state_district || "";
            const country = addr.country || "India";

            let locStr = "";
            if (area && city) {
              locStr = `${area}, ${city}`;
            } else if (city) {
              locStr = `${city}, ${country}`;
            } else {
              locStr = `${country}`;
            }

            if (locStr) {
              localStorage.setItem("sos_user_location", locStr);
              if (onSuccess) onSuccess(locStr);
              return;
            }
          }
        } catch (e) {
          console.error("Reverse geocoding error:", e);
        }
        // Fallback to IP location if reverse geocode fails
        fetchIPLocation(onSuccess);
      },
      (error) => {
        console.warn("Geolocation permission or error, falling back to IP:", error.message);
        fetchIPLocation(onSuccess);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  } else {
    fetchIPLocation(onSuccess);
  }
}

async function fetchIPLocation(onSuccess) {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    if (data && data.city) {
      const locStr = `${data.city}, ${data.country_name || "India"}`;
      localStorage.setItem("sos_user_location", locStr);
      if (onSuccess) onSuccess(locStr);
    }
  } catch (e) {
    console.error("IP Location error:", e);
  }
}

export default function LocationModal({ isOpen, onClose, currentLocation, onLocationSelect }) {
  const [searchInput, setSearchInput] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectStatus, setDetectStatus] = useState("");

  if (!isOpen) return null;

  const handleDetectGPS = () => {
    setIsDetecting(true);
    setDetectStatus("Accessing device location...");

    if (!("geolocation" in navigator)) {
      setDetectStatus("GPS not supported on this device. Detecting IP location...");
      fetchIPLocation((loc) => {
        setIsDetecting(false);
        setDetectStatus("");
        onLocationSelect(loc);
        onClose();
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setDetectStatus("Resolving area and city details...");
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          if (data && data.address) {
            const addr = data.address;
            const area = addr.suburb || addr.neighbourhood || addr.residential || addr.road || addr.subdistrict || "";
            const city = addr.city || addr.town || addr.district || addr.county || addr.state_district || "";
            const country = addr.country || "India";

            let locStr = "";
            if (area && city) {
              locStr = `${area}, ${city}`;
            } else if (city) {
              locStr = `${city}, ${country}`;
            } else {
              locStr = country;
            }

            if (locStr) {
              localStorage.setItem("sos_user_location", locStr);
              onLocationSelect(locStr);
              setIsDetecting(false);
              setDetectStatus("");
              onClose();
              return;
            }
          }
        } catch (e) {
          console.error("Geocoding failed:", e);
        }

        // Fallback to IP location
        fetchIPLocation((loc) => {
          setIsDetecting(false);
          setDetectStatus("");
          onLocationSelect(loc);
          onClose();
        });
      },
      (error) => {
        setDetectStatus("GPS permission denied. Using IP location...");
        fetchIPLocation((loc) => {
          setIsDetecting(false);
          setDetectStatus("");
          onLocationSelect(loc);
          onClose();
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const formatted = searchInput.trim();
      localStorage.setItem("sos_user_location", formatted);
      onLocationSelect(formatted);
      onClose();
    }
  };

  const popularLocations = [
    "Manish Nagar, Nagpur",
    "Wardha Road, Nagpur",
    "Dharampeth, Nagpur",
    "Civil Lines, Nagpur",
    "Besa, Nagpur",
    "Pratap Nagar, Nagpur",
    "Mumbai, India",
    "Pune, India"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Select Delivery Location</h3>
              <p className="text-[11px] text-blue-200 font-medium">
                Enter your area or auto-detect using device GPS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* GPS Auto Detect Button */}
          <button
            onClick={handleDetectGPS}
            disabled={isDetecting}
            className="w-full p-4 bg-gradient-to-r from-blue-900 to-indigo-800 hover:from-blue-800 hover:to-indigo-700 text-white rounded-2xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-between group active:scale-98 disabled:opacity-80"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {isDetecting ? (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                ) : (
                  <Navigation className="w-5 h-5 text-slate-950 fill-slate-950" />
                )}
              </div>
              <div>
                <span className="block text-sm font-black text-white">
                  {isDetecting ? "Detecting Your Location..." : "Use Current Location (GPS)"}
                </span>
                <span className="text-[11px] text-blue-200 font-normal">
                  {detectStatus || "Auto-detect neighbourhood & city (e.g. Manish Nagar, Nagpur)"}
                </span>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-400 text-slate-950 text-[10px] font-black rounded-lg uppercase">
              Auto
            </span>
          </button>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span>OR ENTER LOCATION MANUALLY</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Manual Input Search Form */}
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter area, landmark or city (e.g. Manish Nagar, Nagpur)"
                className="w-full pl-10 pr-24 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button
                type="submit"
                disabled={!searchInput.trim()}
                className="absolute right-2 top-2 bottom-2 px-4 bg-blue-900 text-white font-extrabold text-xs rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </form>

          {/* Quick Select Popular Areas */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Popular School Delivery Hubs:</label>
            <div className="flex flex-wrap gap-2">
              {popularLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    localStorage.setItem("sos_user_location", loc);
                    onLocationSelect(loc);
                    onClose();
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                    currentLocation === loc
                      ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>{loc}</span>
                  {currentLocation === loc && <Check className="w-3.5 h-3.5 text-amber-300" />}
                </button>
              ))}
            </div>
          </div>

          {/* Current Active Location display */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between text-xs text-blue-950 font-bold">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-900" />
              <span>Active Delivery Hub:</span>
            </div>
            <span className="text-amber-800 font-extrabold bg-white px-2.5 py-1 rounded-lg border border-amber-200">
              {currentLocation || "Location not set"}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
