import { NextResponse } from "next/server";
import { connectToDatabase, getInMemoryDB } from "@/lib/db";
import Order from "@/models/Order";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { orderStatus, paymentStatus } = await request.json();
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
      order.orderStatus = orderStatus || order.orderStatus;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
