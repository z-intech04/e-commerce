import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  id: { type: String, default: "" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  selectedSize: { type: String, default: "Standard" }
});

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userEmail: { type: String, default: "" },
    studentName: { type: String, required: true },
    rollNo: { type: String, default: "" },
    classGrade: { type: String, required: true },
    section: { type: String, default: "A" },
    parentPhone: { type: String, required: true },
    deliveryType: { type: String, default: "Home Delivery" },
    deliveryAddress: { type: String, default: "" },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: "Paid" },
    orderStatus: { type: String, default: "Processing" },
    totalAmount: { type: Number, required: true },
    items: [OrderItemSchema]
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
