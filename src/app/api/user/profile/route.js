import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, name, phone, classGrade, address } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "User email is required" }, { status: 400 });
    }

    const users = global._inMemoryUsers || [];
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (classGrade) user.classGrade = classGrade;
      if (address) user.address = address;

      const { password: _, ...sanitizedUser } = user;
      return NextResponse.json({
        success: true,
        message: "Profile updated successfully!",
        user: sanitizedUser
      });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated",
      user: { email, name, phone, classGrade, address }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
