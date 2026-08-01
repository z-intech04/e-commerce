import mongoose from "mongoose";
import { INITIAL_PRODUCTS } from "./seedData";

const MONGODB_URI = process.env.MONGODB_URI;

// Global in-memory cache for fallback when MongoDB Compass is offline
if (!global._inMemoryDB) {
  global._inMemoryDB = {
    products: [...INITIAL_PRODUCTS],
    orders: []
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
