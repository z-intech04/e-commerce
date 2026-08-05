import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin", "superadmin"], default: "customer" },
    status: { type: String, enum: ["active", "paused"], default: "active" },
    phone: { type: String, default: "" },
    department: { type: String, default: "General" }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
