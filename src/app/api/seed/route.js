import { NextResponse } from "next/server";
import { connectToDatabase, getInMemoryDB } from "@/lib/db";
import Product from "@/models/Product";
import { INITIAL_PRODUCTS } from "@/lib/seedData";

export async function POST() {
  try {
    const conn = await connectToDatabase();

    if (conn) {
      await Product.deleteMany({});
      await Product.insertMany(INITIAL_PRODUCTS);
      return NextResponse.json({ success: true, message: "MongoDB seeded successfully with 12 items!" });
    } else {
      const db = getInMemoryDB();
      db.products = [...INITIAL_PRODUCTS];
      return NextResponse.json({ success: true, message: "In-memory database re-seeded successfully!" });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
