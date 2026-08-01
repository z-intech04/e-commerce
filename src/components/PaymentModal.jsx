"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { useCart } from "@/context/CartContext";
import { 
  X, 
  QrCode, 
  CreditCard, 
  Building2, 
  Banknote, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  Sparkles,
  Lock,
  ArrowRight,
  RefreshCw
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function PaymentModal({ isOpen, onClose }) {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, subtotal, deliveryFee, grandTotal, studentInfo, clearCart } = useCart();
  
  const [selectedMethod, setSelectedMethod] = useState("upi"); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [upiId, setUpiId] = useState("parent@okaxis");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());

  // Card state
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8892");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("782");
  const [cardName, setCardName] = useState(studentInfo.studentName || "Parent Account");

  // Bank state
  const [selectedBank, setSelectedBank] = useState("State Bank of India (SBI)");

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText("schoolofscholars@upi");
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const executePayment = async () => {
    if (selectedMethod === "cod" && captchaInput !== captchaCode) {
      alert("Invalid Captcha Code! Please enter " + captchaCode);
      return;
    }

    setIsProcessing(true);

    // Prepare method string
    let methodTitle = "UPI (GPay / PhonePe)";
    if (selectedMethod === "card") methodTitle = "Credit / Debit Card";
    if (selectedMethod === "netbanking") methodTitle = `Net Banking (${selectedBank})`;
    if (selectedMethod === "cod") methodTitle = "Cash on Delivery (COD)";

    // Prepare order payload
    const orderData = {
      userEmail: user?.email || "parent@schoolofscholars.edu",
      studentName: studentInfo.studentName || "Aarav Sharma",
      rollNo: studentInfo.rollNo || "15",
      classGrade: studentInfo.classGrade || "Class 5",
      section: studentInfo.section || "A",
      parentPhone: studentInfo.parentPhone || "+91 98765 43210",
      deliveryType: studentInfo.deliveryType || "Home Delivery",
      deliveryAddress: studentInfo.deliveryAddress || "Flat 402, Sunshine Apartments, Main Road",
      paymentMethod: methodTitle,
      totalAmount: grandTotal,
      items: cart.map((item) => ({
        id: item.product.id || item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize || "Standard"
      }))
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();

      setIsProcessing(false);

      if (data.success && data.order) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });

        clearCart();
        onClose();
        router.push(`/order-success/${data.order.orderId || data.order._id}`);
      } else {
        alert("Failed to record order. Please try again.");
      }
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
      alert("Error completing demo payment.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Summary */}
        <div className="w-full md:w-5/12 bg-slate-900 text-white p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> Secure School Gateway
            </div>
            <h2 className="text-xl font-black tracking-tight">Order Checkout Summary</h2>
            <p className="text-xs text-slate-400 mt-1">
              For Student: <strong className="text-white">{studentInfo.studentName || "Aarav Sharma"}</strong> ({studentInfo.classGrade})
            </p>

            <div className="mt-6 space-y-3 border-t border-slate-800 pt-4 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Delivery Charge</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between text-base font-extrabold text-white">
                <span>Total Payable</span>
                <span className="text-amber-400">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Demonstration Payment Gateway — No real money will be charged.</span>
          </div>
        </div>

        {/* Right Column: Payment Options */}
        <div className="w-full md:w-7/12 p-6 flex flex-col justify-between bg-white">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base mb-4">Select Payment Method</h3>
            
            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              <button
                type="button"
                onClick={() => setSelectedMethod("upi")}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  selectedMethod === "upi"
                    ? "bg-blue-900 text-white border-blue-900 shadow-md"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <QrCode className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-bold">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("card")}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  selectedMethod === "card"
                    ? "bg-blue-900 text-white border-blue-900 shadow-md"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-bold">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("netbanking")}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  selectedMethod === "netbanking"
                    ? "bg-blue-900 text-white border-blue-900 shadow-md"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Building2 className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-bold">NetBank</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("cod")}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  selectedMethod === "cod"
                    ? "bg-blue-900 text-white border-blue-900 shadow-md"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Banknote className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-bold">COD</span>
              </button>
            </div>

            {/* TAB CONTENT */}

            {/* 1. UPI Payment */}
            {selectedMethod === "upi" && (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                  <p className="text-slate-600 font-medium mb-2">Scan QR code using GPay, PhonePe, Paytm, or BHIM</p>
                  
                  {/* Dynamic Demo QR Code Visual */}
                  <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-2xl border-2 border-dashed border-blue-900 flex flex-col items-center justify-center relative shadow-inner">
                    <QrCode className="w-28 h-28 text-blue-900" />
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-1">
                      Pay ₹{grandTotal}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="text-slate-500 font-mono text-[11px]">VPA: schoolofscholars@upi</span>
                    <button
                      onClick={handleCopyUpi}
                      className="p-1 text-blue-900 hover:bg-blue-100 rounded"
                    >
                      {copiedUpi ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Or Enter Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@bank"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>
            )}

            {/* 2. Card Payment */}
            {selectedMethod === "card" && (
              <div className="space-y-3 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-mono font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-mono text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      maxLength={3}
                      placeholder="•••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-mono text-center font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Net Banking */}
            {selectedMethod === "netbanking" && (
              <div className="space-y-3 text-xs font-medium">
                <label className="block text-slate-700 font-bold mb-1">Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-xs"
                >
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                  <option>Punjab National Bank (PNB)</option>
                </select>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  You will be redirected to bank page to simulate instant approval.
                </div>
              </div>
            )}

            {/* 4. Cash on Delivery (COD) */}
            {selectedMethod === "cod" && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-medium">
                  Pay cash directly at School Campus counter or to the delivery executive upon package arrival.
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Human Verification Captcha: <span className="font-mono text-blue-900 font-extrabold text-sm px-2 py-0.5 bg-slate-200 rounded tracking-widest">{captchaCode}</span>
                  </label>
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Enter the 4-digit code"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-center text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={executePayment}
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-2xl font-black text-sm hover:from-blue-800 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-300" />
                  <span>Processing Demo Payment...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  <span>Simulate Instant Payment (₹{grandTotal})</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
