import { NextResponse } from "next/server";
import { connectToDatabase, getInMemoryDB } from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    const conn = await connectToDatabase();

    if (conn) {
      // Ensure superadmin & sample admin exist
      const existingSuper = await User.findOne({ role: "superadmin" });
      if (!existingSuper) {
        await User.create({
          name: "Z INTECH PRIVATE LIMITED",
          email: "superadmin@zintech.com",
          password: "zintech123",
          role: "superadmin",
          status: "active",
          department: "System Master Authority"
        });
      }

      const admins = await User.find({ role: { $in: ["admin", "superadmin"] } }).select("-password").sort({ createdAt: -1 });
      const orders = await Order.find({});
      const products = await Product.find({});

      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const activeAdmins = admins.filter(a => a.status === "active").length;
      const pausedAdmins = admins.filter(a => a.status === "paused").length;

      return NextResponse.json({
        success: true,
        source: "mongodb",
        admins,
        stats: {
          totalAdmins: admins.filter(a => a.role === "admin").length,
          activeAdmins,
          pausedAdmins,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalRevenue
        }
      });
    } else {
      const users = global._inMemoryUsers || [];
      const admins = users.filter(u => u.role === "admin" || u.role === "superadmin").map(({ password, ...rest }) => rest);
      const db = getInMemoryDB();

      const totalRevenue = db.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const activeAdmins = admins.filter(a => a.status === "active").length;
      const pausedAdmins = admins.filter(a => a.status === "paused").length;

      return NextResponse.json({
        success: true,
        source: "in-memory",
        admins,
        stats: {
          totalAdmins: admins.filter(a => a.role === "admin").length,
          activeAdmins,
          pausedAdmins,
          totalOrders: db.orders.length,
          totalProducts: db.products.length,
          totalRevenue
        }
      });
    }
  } catch (error) {
    console.error("SuperAdmin GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email, password, department } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Name, email, and password are required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const conn = await connectToDatabase();

    if (conn) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return NextResponse.json({ success: false, message: "An account with this email already exists." }, { status: 400 });
      }

      const newAdmin = await User.create({
        name,
        email: cleanEmail,
        password,
        role: "admin",
        status: "active",
        department: department || "Operations"
      });

      const userObj = newAdmin.toObject();
      delete userObj.password;
      return NextResponse.json({ success: true, message: `Admin account for ${name} created successfully!`, admin: userObj });
    } else {
      const users = global._inMemoryUsers || [];
      const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return NextResponse.json({ success: false, message: "An account with this email already exists." }, { status: 400 });
      }

      const newAdmin = {
        id: `usr-admin-${Date.now()}`,
        name,
        email: cleanEmail,
        password,
        role: "admin",
        status: "active",
        department: department || "Operations",
        createdAt: new Date().toISOString()
      };

      users.push(newAdmin);
      const { password: _, ...userWithoutPass } = newAdmin;
      return NextResponse.json({ success: true, message: `Admin account for ${name} created successfully!`, admin: userWithoutPass });
    }
  } catch (error) {
    console.error("SuperAdmin POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { adminId, status, email, password, name, department } = await request.json();

    if (!adminId) {
      return NextResponse.json({ success: false, message: "Admin ID is required." }, { status: 400 });
    }

    const conn = await connectToDatabase();

    if (conn && mongoose.Types.ObjectId.isValid(adminId)) {
      const admin = await User.findById(adminId);
      if (!admin) {
        return NextResponse.json({ success: false, message: "Admin account not found." }, { status: 404 });
      }

      if (status) admin.status = status;
      if (email) admin.email = email.toLowerCase().trim();
      if (password) admin.password = password;
      if (name) admin.name = name;
      if (department) admin.department = department;

      await admin.save();

      const userObj = admin.toObject();
      delete userObj.password;
      return NextResponse.json({ success: true, message: "Admin account updated successfully!", admin: userObj });
    }

    const users = global._inMemoryUsers || [];
    const index = users.findIndex(u => u.id === adminId || u._id === adminId);
    if (index !== -1) {
      if (status) users[index].status = status;
      if (email) users[index].email = email.toLowerCase().trim();
      if (password) users[index].password = password;
      if (name) users[index].name = name;
      if (department) users[index].department = department;

      const { password: _, ...userWithoutPass } = users[index];
      return NextResponse.json({ success: true, message: "Admin account updated successfully!", admin: userWithoutPass });
    }

    return NextResponse.json({ success: false, message: "Admin account not found." }, { status: 404 });
  } catch (error) {
    console.error("SuperAdmin PUT error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("adminId");

    if (!adminId) {
      return NextResponse.json({ success: false, message: "Admin ID is required." }, { status: 400 });
    }

    const conn = await connectToDatabase();

    if (conn && mongoose.Types.ObjectId.isValid(adminId)) {
      await User.findByIdAndDelete(adminId);
      return NextResponse.json({ success: true, message: "Admin account deleted successfully." });
    }

    if (global._inMemoryUsers) {
      global._inMemoryUsers = global._inMemoryUsers.filter(u => u.id !== adminId && u._id !== adminId);
    }

    return NextResponse.json({ success: true, message: "Admin account deleted successfully." });
  } catch (error) {
    console.error("SuperAdmin DELETE error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
