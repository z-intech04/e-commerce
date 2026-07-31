"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("All Classes");
  const [studentInfo, setStudentInfo] = useState({
    studentName: "",
    rollNo: "",
    classGrade: "Class 5",
    section: "A",
    parentPhone: "",
    deliveryAddress: "",
    deliveryType: "Home Delivery",
    pincode: "400001",
    city: "Mumbai",
    landmark: ""
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("sos_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedStudent = localStorage.getItem("sos_student");
      if (savedStudent) setStudentInfo(JSON.parse(savedStudent));

      const savedGrade = localStorage.getItem("sos_selected_grade");
      if (savedGrade) setSelectedGrade(savedGrade);
    } catch (e) {
      console.error("Failed to parse stored cart state:", e);
    }
  }, []);

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem("sos_cart", JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("sos_student", JSON.stringify(studentInfo));
    } catch (e) {}
  }, [studentInfo]);

  useEffect(() => {
    try {
      localStorage.setItem("sos_selected_grade", selectedGrade);
    } catch (e) {}
  }, [selectedGrade]);

  const addToCart = (product, size = "Standard", quantity = 1, customName = "") => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, selectedSize: size, quantity, customName }];
      }
    });
  };

  const removeFromCart = (productId, size) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedSize === size)));
  };

  const updateQuantity = (productId, size, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity + (item.customName ? 50 * item.quantity : 0),
    0
  );

  const deliveryFee = studentInfo.deliveryType === "School Pickup" || subtotal > 1999 ? 0 : 99;
  const grandTotal = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        deliveryFee,
        grandTotal,
        studentInfo,
        setStudentInfo,
        selectedGrade,
        setSelectedGrade
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
