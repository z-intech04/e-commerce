import { NextResponse } from "next/server";

// Default Hero Banner Settings
let heroSettings = {
  couponTitle: "Exclusive coupon for you!",
  couponDiscount: "Flat 10% Off",
  couponSub: "Up to ₹500 on Grade Kits",
  couponStatus: "Already applied",
  
  card1Title: "Official Blazer & Uniform Sets",
  card1Price: "From ₹1,499*",
  card1Sub: "Pre-order 2026-27 Session",
  
  card2Title: "Complete Grade NCERT Textbook Kits",
  card2Discount: "Up to 25% Off",
  card2Sub: "Includes Textbooks & Workbooks",
  
  card3Title: "Casio Scientific Calculators & Bags",
  card3Price: "Special ₹899",
  card3Sub: "Approved for Class 9 to 12"
};

export async function GET() {
  return NextResponse.json({ success: true, settings: heroSettings });
}

export async function POST(req) {
  try {
    const body = await req.json();
    heroSettings = {
      ...heroSettings,
      ...body
    };
    return NextResponse.json({ success: true, settings: heroSettings, message: "Hero section text updated successfully!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update hero settings." }, { status: 500 });
  }
}
