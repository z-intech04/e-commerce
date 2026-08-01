import { NextResponse } from "next/server";
import { connectToDatabase, getInMemoryDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();

    if (conn) {
      const order = await Order.findOne({ $or: [{ _id: id }, { orderId: id }] });
      if (order) return NextResponse.json({ success: true, order });
    }

    const db = getInMemoryDB();
    const order = db.orders.find(o => o.id === id || o.orderId === id);
    if (order) {
      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { orderStatus, paymentStatus, cancelReason } = await request.json();
    const conn = await connectToDatabase();

    if (conn) {
      const updated = await Order.findOneAndUpdate(
        { $or: [{ _id: id }, { orderId: id }] },
        { orderStatus, ...(paymentStatus && { paymentStatus }) },
        { new: true }
      );
      if (updated) return NextResponse.json({ success: true, order: updated });
    }

    const db = getInMemoryDB();
    const order = db.orders.find(o => o.id === id || o.orderId === id);
    if (order) {
      if (orderStatus) order.orderStatus = orderStatus;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      
      if (orderStatus === "Cancelled") {
        const nowStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        order.timeline = [
          ...(order.timeline || []),
          {
            status: "Cancelled",
            title: "Order Cancelled",
            description: cancelReason ? `Cancelled by user: ${cancelReason}` : "Order cancelled by customer",
            date: nowStr,
            completed: true,
            isCancelledStep: true
          }
        ];
      }
      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
