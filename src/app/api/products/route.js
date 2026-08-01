import { NextResponse } from "next/server";
import { connectToDatabase, getInMemoryDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const grade = searchParams.get("grade");
    const search = searchParams.get("search");

    const conn = await connectToDatabase();

    if (conn) {
      const query = {};
      if (category && category !== "All Categories") query.category = category;
      if (grade && grade !== "All Classes" && grade !== "All") {
        query.$or = [{ grade: grade }, { grade: "All" }, { grade: "Class 1 to 12" }];
      }
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      const products = await Product.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, source: "mongodb", products });
    } else {
      // In-Memory Fallback
      const db = getInMemoryDB();
      let products = [...db.products];

      if (category && category !== "All Categories") {
        products = products.filter(p => p.category === category);
      }
      if (grade && grade !== "All Classes" && grade !== "All") {
        products = products.filter(p => p.grade === grade || p.grade === "All" || p.grade === "Class 1 to 12");
      }
      if (search) {
        const queryLower = search.toLowerCase();
        products = products.filter(p => p.name.toLowerCase().includes(queryLower) || p.description.toLowerCase().includes(queryLower));
      }

      return NextResponse.json({ success: true, source: "in-memory", products });
    }
  } catch (error) {
    console.error("Products GET API error:", error);
    const db = getInMemoryDB();
    return NextResponse.json({ success: true, source: "in-memory-fallback", products: db.products });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const conn = await connectToDatabase();

    if (conn) {
      const newProduct = await Product.create(body);
      return NextResponse.json({ success: true, source: "mongodb", product: newProduct });
    } else {
      const db = getInMemoryDB();
      const newProduct = {
        id: `prod-${Date.now()}`,
        ...body,
        inStock: body.stockCount > 0,
        rating: 5.0,
        reviewsCount: 1,
        images: body.images?.length ? body.images : ["https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800"]
      };
      db.products.unshift(newProduct);
      return NextResponse.json({ success: true, source: "in-memory", product: newProduct });
    }
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await Product.deleteMany({});
    }
    const db = getInMemoryDB();
    db.products = [];
    return NextResponse.json({ success: true, message: "All products deleted successfully." });
  } catch (error) {
    console.error("Products DELETE error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
