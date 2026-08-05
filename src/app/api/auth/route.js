import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

// Global user store in memory for demo fallback
if (!global._inMemoryUsers) {
  global._inMemoryUsers = [
    {
      id: "usr-superadmin-1",
      name: "Z INTECH PRIVATE LIMITED",
      email: "superadmin@zintech.com",
      password: "zintech123",
      role: "superadmin",
      status: "active",
      department: "System Master Authority",
      createdAt: new Date().toISOString()
    },
    {
      id: "usr-admin-1",
      name: "Store Operations Admin",
      email: "admin@schoolofscholars.edu",
      password: "admin123",
      role: "admin",
      status: "active",
      department: "Inventory & Fulfillment",
      createdAt: new Date().toISOString()
    }
  ];
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, name, email, password, phone, userId, newEmail, newPassword } = body;

    const conn = await connectToDatabase();

    // Ensure superadmin & default admin exist in in-memory array
    if (!global._inMemoryUsers.some(u => u.role === "superadmin")) {
      global._inMemoryUsers.unshift({
        id: "usr-superadmin-1",
        name: "Z INTECH PRIVATE LIMITED",
        email: "superadmin@zintech.com",
        password: "zintech123",
        role: "superadmin",
        status: "active",
        department: "System Master Authority",
        createdAt: new Date().toISOString()
      });
    }

    if (action === "register") {
      if (!email || !password || !name) {
        return NextResponse.json({ success: false, message: "Please provide all required fields." }, { status: 400 });
      }

      const cleanEmail = email.toLowerCase().trim();

      if (conn) {
        const existing = await User.findOne({ email: cleanEmail });
        if (existing) {
          return NextResponse.json({ success: false, message: "An account with this email already exists." }, { status: 400 });
        }
        const newUser = await User.create({
          name,
          email: cleanEmail,
          password,
          role: "customer",
          status: "active",
          phone: phone || ""
        });
        const userObj = newUser.toObject();
        delete userObj.password;
        return NextResponse.json({ success: true, message: "Account registered successfully!", user: userObj });
      } else {
        const users = global._inMemoryUsers;
        const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
        if (existing) {
          return NextResponse.json({ success: false, message: "An account with this email already exists." }, { status: 400 });
        }
        const newUser = {
          id: `usr-${Date.now()}`,
          name,
          email: cleanEmail,
          password,
          role: "customer",
          status: "active",
          phone: phone || "",
          createdAt: new Date().toISOString()
        };
        users.push(newUser);
        const { password: _, ...userWithoutPass } = newUser;
        return NextResponse.json({ success: true, message: "Account registered successfully!", user: userWithoutPass });
      }
    }

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
      }

      const cleanEmail = email.toLowerCase().trim();

      if (conn) {
        // Seed default superadmin in MongoDB if missing
        const existingSuper = await User.findOne({ email: "superadmin@zintech.com" });
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

        const user = await User.findOne({ email: cleanEmail, password });
        if (!user) {
          return NextResponse.json({ success: false, message: "Invalid email or password." }, { status: 401 });
        }

        if (user.status === "paused") {
          return NextResponse.json({
            success: false,
            message: "Your admin account has been suspended/paused by Z INTECH PRIVATE LIMITED. Please contact system administrator."
          }, { status: 403 });
        }

        const userObj = user.toObject();
        delete userObj.password;
        return NextResponse.json({
          success: true,
          message: `Welcome back, ${user.name}!`,
          user: userObj
        });
      } else {
        const users = global._inMemoryUsers;
        const user = users.find(
          (u) => u.email.toLowerCase() === cleanEmail && u.password === password
        );

        if (!user) {
          return NextResponse.json({ success: false, message: "Invalid email or password." }, { status: 401 });
        }

        if (user.status === "paused") {
          return NextResponse.json({
            success: false,
            message: "Your admin account has been suspended/paused by Z INTECH PRIVATE LIMITED. Please contact system administrator."
          }, { status: 403 });
        }

        const { password: _, ...userWithoutPass } = user;
        return NextResponse.json({
          success: true,
          message: `Welcome back, ${user.name}!`,
          user: userWithoutPass
        });
      }
    }

    if (action === "update_credentials") {
      const cleanEmail = newEmail ? newEmail.toLowerCase().trim() : null;
      
      if (conn) {
        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });

        if (cleanEmail) user.email = cleanEmail;
        if (newPassword) user.password = newPassword;
        await user.save();

        const userObj = user.toObject();
        delete userObj.password;
        return NextResponse.json({ success: true, message: "Credentials updated successfully!", user: userObj });
      } else {
        const users = global._inMemoryUsers;
        const index = users.findIndex(u => u.id === userId || u._id === userId);
        if (index === -1) return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });

        if (cleanEmail) users[index].email = cleanEmail;
        if (newPassword) users[index].password = newPassword;

        const { password: _, ...userWithoutPass } = users[index];
        return NextResponse.json({ success: true, message: "Credentials updated successfully!", user: userWithoutPass });
      }
    }

    return NextResponse.json({ success: false, message: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
