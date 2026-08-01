import { NextResponse } from "next/server";
import { connectToDatabase, getInMemoryDB } from "@/lib/db";

// Global user store in memory for demo persistence
if (!global._inMemoryUsers) {
  global._inMemoryUsers = [
    {
      id: "usr-admin-1",
      name: "Principal Admin",
      email: "admin@schoolofscholars.edu",
      password: "admin123",
      role: "admin",
      createdAt: new Date().toISOString()
    }
  ];
}

export async function POST(request) {
  try {
    const { action, name, email, password, phone } = await request.json();

    // Ensure unwanted test user data is permanently excluded
    global._inMemoryUsers = global._inMemoryUsers.filter(
      (u) => u.email !== "parent@schoolofscholars.edu" && u.name !== "Suresh Sharma"
    );

    const users = global._inMemoryUsers;

    if (action === "register") {
      if (!email || !password || !name) {
        return NextResponse.json({ success: false, message: "Please provide all required fields." }, { status: 400 });
      }

      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return NextResponse.json({ success: false, message: "An account with this email already exists." }, { status: 400 });
      }

      // Check if registering with admin key or email domain
      const role = email.toLowerCase().includes("admin@schoolofscholars") ? "admin" : "customer";

      const newUser = {
        id: `usr-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password,
        role,
        phone: phone || "",
        createdAt: new Date().toISOString()
      };

      users.push(newUser);

      // Return sanitized user object without password
      const { password: _, ...userWithoutPass } = newUser;
      return NextResponse.json({
        success: true,
        message: "Account registered successfully!",
        user: userWithoutPass
      });
    }

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
      }

      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        return NextResponse.json({ success: false, message: "Invalid email or password." }, { status: 401 });
      }

      const { password: _, ...userWithoutPass } = user;
      return NextResponse.json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        user: userWithoutPass
      });
    }

    return NextResponse.json({ success: false, message: "Invalid action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
