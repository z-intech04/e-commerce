"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, requireAuth } = useAuth();
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

  const getCartKey = (u) => (u?.email ? `sos_cart_${u.email.toLowerCase()}` : null);
  const getStudentKey = (u) => (u?.email ? `sos_student_${u.email.toLowerCase()}` : null);

  // Sync cart state whenever user changes (login / logout)
  useEffect(() => {
    try {
      // Purge any legacy un-scoped sos_cart key
      localStorage.removeItem("sos_cart");
      localStorage.removeItem("sos_student");

      if (user?.email) {
        const userCartKey = getCartKey(user);
        const savedCart = localStorage.getItem(userCartKey);
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        } else {
          setCart([]);
        }

        const userStudentKey = getStudentKey(user);
        const savedStudent = localStorage.getItem(userStudentKey);
        if (savedStudent) {
          setStudentInfo(JSON.parse(savedStudent));
        } else {
          setStudentInfo({
            studentName: user?.name || "",
            rollNo: "",
            classGrade: "Class 5",
            section: "A",
            parentPhone: user?.phone || "",
            deliveryAddress: "",
            deliveryType: "Home Delivery",
            pincode: "400001",
            city: "Mumbai",
            landmark: ""
          });
        }
      } else {
        // User logged out / not logged in: force cart to empty []
        setCart([]);
        setStudentInfo({
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
      }

      const savedGrade = localStorage.getItem("sos_selected_grade");
      if (savedGrade) setSelectedGrade(savedGrade);
    } catch (e) {
      console.error("Failed to parse stored cart state:", e);
      setCart([]);
    }
  }, [user]);

  // Save cart changes per user
  useEffect(() => {
    try {
      if (user?.email) {
        const userCartKey = getCartKey(user);
        localStorage.setItem(userCartKey, JSON.stringify(cart));
      } else {
        localStorage.removeItem("sos_cart");
        localStorage.removeItem("sos_cart_guest");
      }
    } catch (e) {}
  }, [cart, user]);

  useEffect(() => {
    try {
      if (user?.email) {
        const userStudentKey = getStudentKey(user);
        localStorage.setItem(userStudentKey, JSON.stringify(studentInfo));
      } else {
        localStorage.removeItem("sos_student");
      }
    } catch (e) {}
  }, [studentInfo, user]);

  useEffect(() => {
    try {
      localStorage.setItem("sos_selected_grade", selectedGrade);
    } catch (e) {}
  }, [selectedGrade]);

  const getProductId = (p) => String(p?.id || p?._id || p?.name || "");

  const addToCart = (product, size = "Standard", quantity = 1, customName = "") => {
    if (!user?.email) {
      if (requireAuth) {
        requireAuth("register", "Please register or sign in to add items to your cart.");
      }
      return;
    }

    const targetId = getProductId(product);
    if (!targetId) return;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => {
        const itemId = getProductId(item.product);
        return itemId === targetId && item.selectedSize === size;
      });

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          customName: customName || updated[existingIndex].customName
        };
        return updated;
      } else {
        return [...prev, { product, selectedSize: size, quantity, customName }];
      }
    });
  };

  const removeFromCart = (productId, size) => {
    const targetId = String(productId || "");
    setCart((prev) =>
      prev.filter((item) => {
        const itemId = getProductId(item.product);
        return !(itemId === targetId && item.selectedSize === size);
      })
    );
  };

  const updateQuantity = (productId, size, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    const targetId = String(productId || "");
    setCart((prev) =>
      prev.map((item) => {
        const itemId = getProductId(item.product);
        return itemId === targetId && item.selectedSize === size
          ? { ...item, quantity: newQty }
          : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      if (user?.email) {
        localStorage.removeItem(getCartKey(user));
      }
      localStorage.removeItem("sos_cart");
      localStorage.removeItem("sos_cart_guest");
    } catch (e) {}
  };

  // Only expose cart items if user is authenticated via email
  const activeCart = user?.email ? cart : [];

  const totalItemsCount = activeCart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = activeCart.reduce(
    (acc, item) => acc + item.product.price * item.quantity + (item.customName ? 50 * item.quantity : 0),
    0
  );

  const deliveryFee = activeCart.length === 0 || studentInfo.deliveryType === "School Pickup" || subtotal > 1999 ? 0 : 99;
  const grandTotal = activeCart.length === 0 ? 0 : subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart: activeCart,
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
