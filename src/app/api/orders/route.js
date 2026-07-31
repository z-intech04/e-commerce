import { NextResponse } from "next/server";
import { connectToDatabase, getInMemoryDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  try {
    const conn = await connectToDatabase();

    if (conn) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, orders });
    } else {
      const db = getInMemoryDB();
      return NextResponse.json({ success: true, orders: db.orders });
    }
  } catch (error) {
    const db = getInMemoryDB();
    return NextResponse.json({ success: true, orders: db.orders });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderData = {
      orderId,
      ...body,
      paymentStatus: body.paymentMethod === "Cash on Delivery (COD)" ? "Pending" : "Paid",
      orderStatus: "Processing",
      createdAt: new Date().toISOString()
    };

    const conn = await connectToDatabase();

    if (conn) {
      const newOrder = await Order.create(orderData);
      return NextResponse.json({ success: true, order: newOrder });
    } else {
      const db = getInMemoryDB();
      db.orders.unshift(orderData);
      return NextResponse.json({ success: true, order: orderData });
    }
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
