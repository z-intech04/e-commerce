import { NextResponse } from "next/server";
import { connectToDatabase, getInMemoryDB } from "@/lib/db";
import Order from "@/models/Order";
import mongoose from "mongoose";

const getOrderQuery = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { orderId: id }] };
  }
  return { orderId: id };
};

const updateTimelineForStatus = (timeline = [], newStatus) => {
  const statusOrder = ["Processing", "Confirmed", "Shipped", "Delivered"];
  const newIndex = statusOrder.indexOf(newStatus);
  const nowStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  return timeline.map((step) => {
    const stepIndex = statusOrder.indexOf(step.status);
    if (stepIndex !== -1 && stepIndex <= newIndex) {
      return {
        ...step,
        completed: true,
        date: step.date === "Pending" ? nowStr : step.date
      };
    }
    return step;
  });
};

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();

    if (conn) {
      const order = await Order.findOne(getOrderQuery(id));
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
      const existingOrder = await Order.findOne(getOrderQuery(id));
      if (existingOrder) {
        if (orderStatus) {
          existingOrder.orderStatus = orderStatus;
          existingOrder.timeline = updateTimelineForStatus(existingOrder.timeline, orderStatus);
        }
        if (paymentStatus) {
          existingOrder.paymentStatus = paymentStatus;
        }
        await existingOrder.save();
        return NextResponse.json({ success: true, order: existingOrder });
      }
    }

    const db = getInMemoryDB();
    const order = db.orders.find(o => o.id === id || o.orderId === id);
    if (order) {
      if (orderStatus) {
        order.orderStatus = orderStatus;
        order.timeline = updateTimelineForStatus(order.timeline, orderStatus);
      }
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
    console.error("PUT order error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
