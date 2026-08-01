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
        orderId: "ORD-2026-8801",
        userEmail: "parent@schoolofscholars.edu",
        studentName: "Aarav Sharma",
        rollNo: "24",
        classGrade: "Class 5",
        section: "A",
        parentPhone: "+91 98765 43210",
        deliveryType: "Home Delivery",
        deliveryAddress: "Flat 402, Royal Palms Apartments, Sector 4, Pune - 411038",
        paymentMethod: "UPI (GPay)",
        paymentStatus: "Paid",
        orderStatus: "Shipped",
        courierName: "Delhivery Express",
        trackingNumber: "DEL-984729104",
        estimatedDelivery: "Tomorrow, 4:00 PM",
        totalAmount: 3998,
        createdAt: "2026-07-30T14:30:00.000Z",
        timeline: [
          { status: "Processing", title: "Order Placed", description: "Order successfully placed by Suresh Sharma", date: "30 Jul 2026, 02:30 PM", completed: true },
          { status: "Confirmed", title: "Order Confirmed", description: "Verified by School Admin Store", date: "30 Jul 2026, 03:15 PM", completed: true },
          { status: "Shipped", title: "Shipped", description: "Package handed over to Delhivery Express (AWB: DEL-984729104)", date: "31 Jul 2026, 11:00 AM", completed: true },
          { status: "Out for Delivery", title: "Out for Delivery", description: "Courier executive assigned for home delivery", date: "Expected 1 Aug 2026", completed: false },
          { status: "Delivered", title: "Delivered", description: "Package delivered to parent/recipient", date: "Expected 1 Aug 2026", completed: false }
        ],
        items: [
          { id: "prod-1", name: "School of Scholars Official Royal Blue Blazer", price: 1499, quantity: 1, selectedSize: "32", image: "/blazer.jpg" },
          { id: "prod-5", name: "Class 5 CBSE Complete Academic Book Set", price: 2499, quantity: 1, selectedSize: "Standard Set", image: "/books.jpg" }
        ]
      },
      {
        id: "ORD-2026-7210",
        orderId: "ORD-2026-7210",
        userEmail: "parent@schoolofscholars.edu",
        studentName: "Aarav Sharma",
        rollNo: "24",
        classGrade: "Class 5",
        section: "A",
        parentPhone: "+91 98765 43210",
        deliveryType: "School Pickup",
        deliveryAddress: "School of Scholars Campus Counter 2, Sector 4",
        paymentMethod: "Credit Card",
        paymentStatus: "Paid",
        orderStatus: "Delivered",
        courierName: "School Campus Desk",
        trackingNumber: "PICKUP-CNT2-550",
        estimatedDelivery: "Delivered on 25 Jul 2026",
        totalAmount: 1850,
        createdAt: "2026-07-24T09:15:00.000Z",
        timeline: [
          { status: "Processing", title: "Order Placed", description: "Order placed for campus pickup", date: "24 Jul 2026, 09:15 AM", completed: true },
          { status: "Confirmed", title: "Order Confirmed", description: "School Store confirmed inventory", date: "24 Jul 2026, 10:00 AM", completed: true },
          { status: "Shipped", title: "Ready for Pickup", description: "Transferred to Campus Counter 2", date: "24 Jul 2026, 02:00 PM", completed: true },
          { status: "Out for Delivery", title: "Counter Dispatch", description: "Ready at Student Store Counter", date: "25 Jul 2026, 09:00 AM", completed: true },
          { status: "Delivered", title: "Delivered / Collected", description: "Handed over to Suresh Sharma (Parent ID verified)", date: "25 Jul 2026, 11:45 AM", completed: true }
        ],
        items: [
          { id: "prod-2", name: "Official Unisex Cotton Polo T-Shirt", price: 650, quantity: 2, selectedSize: "M", image: "/polo.jpg" },
          { id: "prod-3", name: "Ergonomic School Backpack 28L", price: 1200, quantity: 1, selectedSize: "Standard", image: "/bag.jpg" }
        ]
      },
      {
        id: "ORD-2026-9043",
        orderId: "ORD-2026-9043",
        userEmail: "parent@schoolofscholars.edu",
        studentName: "Aarav Sharma",
        rollNo: "24",
        classGrade: "Class 5",
        section: "A",
        parentPhone: "+91 98765 43210",
        deliveryType: "Home Delivery",
        deliveryAddress: "Flat 402, Royal Palms Apartments, Sector 4, Pune - 411038",
        paymentMethod: "Cash on Delivery (COD)",
        paymentStatus: "Pending",
        orderStatus: "Processing",
        courierName: "Express Logistics",
        trackingNumber: "EXP-109283",
        estimatedDelivery: "Delivery in 3 Days",
        totalAmount: 950,
        createdAt: "2026-07-31T18:00:00.000Z",
        timeline: [
          { status: "Processing", title: "Order Placed", description: "Order received in system", date: "31 Jul 2026, 06:00 PM", completed: true },
          { status: "Confirmed", title: "Order Confirmed", description: "Awaiting store packaging", date: "Pending", completed: false },
          { status: "Shipped", title: "Shipped", description: "Awaiting courier pickup", date: "Pending", completed: false },
          { status: "Out for Delivery", title: "Out for Delivery", description: "Local hub arrival pending", date: "Pending", completed: false },
          { status: "Delivered", title: "Delivered", description: "Customer signature pending", date: "Pending", completed: false }
        ],
        items: [
          { id: "prod-4", name: "Scholars Premium Geometry & Art Kit", price: 450, quantity: 1, selectedSize: "Standard", image: "/artkit.jpg" },
          { id: "prod-6", name: "Hardbound School Diary & Notebook Pack", price: 500, quantity: 1, selectedSize: "Pack of 5", image: "/notebook.jpg" }
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
