import mongoose from "mongoose";
import { INITIAL_PRODUCTS } from "./seedData";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/school_of_scholars";

// Global in-memory cache for fallback when MongoDB Compass is offline
if (!global._inMemoryDB) {
  global._inMemoryDB = {
    products: [...INITIAL_PRODUCTS],
    orders: [
      {
        id: "ORD-2026-8801",
        studentName: "Aarav Sharma",
        rollNo: "24",
        classGrade: "Class 5",
        section: "A",
        parentPhone: "+91 98765 43210",
        deliveryType: "School Pickup",
        deliveryAddress: "School of Scholars Campus Counter, Sector 4",
        paymentMethod: "UPI (GPay)",
        paymentStatus: "Paid",
        orderStatus: "Processing",
        totalAmount: 3298,
        createdAt: "2026-07-31T10:00:00.000Z",
        items: [
          { id: "prod-1", name: "School of Scholars Official Royal Blue Blazer", price: 1499, quantity: 1, selectedSize: "32" },
          { id: "prod-5", name: "Class 5 CBSE Complete Academic Book Set", price: 2499, quantity: 1, selectedSize: "Standard Set" }
        ]
      }
    ]
  };
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000 // 2 seconds timeout to fallback smoothly
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("Connected to MongoDB successfully!");
      return m;
    }).catch((err) => {
      console.warn("MongoDB connection failed or Compass not running. Falling back to robust in-memory database store.");
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
  }

  return cached.conn;
}

export function getInMemoryDB() {
  return global._inMemoryDB;
}
