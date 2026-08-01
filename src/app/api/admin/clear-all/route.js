import { NextResponse } from "next/server";
import { connectToDatabase, getInMemoryDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    const conn = await connectToDatabase();

    if (conn) {
      await Product.deleteMany({});
      await Order.deleteMany({});
    }

    // Reset in-memory database
    const db = getInMemoryDB();
    db.products = [];
    db.orders = [];

    // Reset non-admin users in memory if any
    if (global._inMemoryUsers) {
      global._inMemoryUsers = global._inMemoryUsers.filter(u => u.role === "admin");
    }

    return NextResponse.json({
      success: true,
      message: "All products, student orders, and temporary user data have been completely wiped from scratch."
    });
  } catch (error) {
    console.error("Clear all data error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
