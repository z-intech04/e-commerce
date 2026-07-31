import { NextResponse } from "next/server";
import { connectToDatabase, getInMemoryDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();

    if (conn) {
      const product = await Product.findById(id);
      if (product) {
        return NextResponse.json({ success: true, product });
      }
    }

    const db = getInMemoryDB();
    const product = db.products.find(p => p.id === id || p._id === id);
    if (product) {
      return NextResponse.json({ success: true, product });
    }

    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const conn = await connectToDatabase();

    if (conn) {
      const updated = await Product.findByIdAndUpdate(id, body, { new: true });
      if (updated) return NextResponse.json({ success: true, product: updated });
    }

    const db = getInMemoryDB();
    const index = db.products.findIndex(p => p.id === id || p._id === id);
    if (index !== -1) {
      db.products[index] = { ...db.products[index], ...body };
      return NextResponse.json({ success: true, product: db.products[index] });
    }

    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();

    if (conn) {
      await Product.findByIdAndDelete(id);
    }

    const db = getInMemoryDB();
    db.products = db.products.filter(p => p.id !== id && p._id !== id);

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
