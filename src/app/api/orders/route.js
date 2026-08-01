import { NextResponse } from "next/server";
import { connectToDatabase, getInMemoryDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.toLowerCase();
    const phone = searchParams.get("phone");
    const orderId = searchParams.get("orderId")?.toUpperCase();

    const conn = await connectToDatabase();

    if (conn) {
      let query = {};
      if (orderId) {
        query.$or = [{ orderId }, { _id: orderId }];
      } else if (email) {
        query.$or = [
          { userEmail: email }, 
          { email: email }, 
          { userEmail: { $exists: false } },
          { userEmail: null }
        ];
      } else if (phone) {
        query.parentPhone = phone;
      }

      let orders = await Order.find(query).sort({ createdAt: -1 });
      if (orders.length === 0 && !orderId) {
        orders = await Order.find({}).sort({ createdAt: -1 });
      }
      return NextResponse.json({ success: true, orders });
    } else {
      const db = getInMemoryDB();
      let orders = [...db.orders];

      if (orderId) {
        orders = orders.filter(
          (o) =>
            o.id?.toUpperCase() === orderId ||
            o.orderId?.toUpperCase() === orderId
        );
      } else if (email || phone) {
        const filtered = orders.filter((o) => {
          const matchEmail = email && ((o.userEmail || "").toLowerCase() === email || (o.email || "").toLowerCase() === email);
          const matchPhone = phone && ((o.parentPhone || "").includes(phone) || (o.phone || "").includes(phone));
          return matchEmail || matchPhone;
        });
        
        // If specific user has specific orders, show them! Otherwise fallback to all store orders
        if (filtered.length > 0) {
          orders = filtered;
        }
      }

      return NextResponse.json({ success: true, orders });
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

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }) + ", " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    const defaultTimeline = [
      { status: "Processing", title: "Order Placed", description: `Order successfully placed by ${body.studentName || 'Customer'}`, date: formattedDate, completed: true },
      { status: "Confirmed", title: "Order Confirmed", description: "Verifying items and preparing packaging", date: "Pending", completed: false },
      { status: "Shipped", title: body.deliveryType === "School Pickup" ? "Ready for Pickup" : "Shipped", description: body.deliveryType === "School Pickup" ? "Transferring to Campus Counter" : "Handing over to courier service", date: "Pending", completed: false },
      { status: "Out for Delivery", title: body.deliveryType === "School Pickup" ? "Counter Ready" : "Out for Delivery", description: body.deliveryType === "School Pickup" ? "Available at Campus Counter 2" : "Courier out for delivery to address", date: "Pending", completed: false },
      { status: "Delivered", title: body.deliveryType === "School Pickup" ? "Handed Over" : "Delivered", description: "Order complete", date: "Pending", completed: false }
    ];

    const orderData = {
      orderId,
      id: orderId,
      ...body,
      paymentStatus: body.paymentMethod === "Cash on Delivery (COD)" ? "Pending" : "Paid",
      orderStatus: "Processing",
      timeline: body.timeline || defaultTimeline,
      courierName: body.deliveryType === "School Pickup" ? "School Campus Counter" : "Delhivery Express",
      trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: body.deliveryType === "School Pickup" ? "Ready tomorrow 10:00 AM" : "Delivery within 2-3 Business Days",
      createdAt: now.toISOString()
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
