import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  selectedSize: { type: String, default: "Standard" }
});

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },
    rollNo: { type: String, required: true },
    classGrade: { type: String, required: true },
    section: { type: String, default: "A" },
    parentPhone: { type: String, required: true },
    deliveryType: { type: String, enum: ["School Pickup", "Home Delivery"], default: "Home Delivery" },
    deliveryAddress: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, enum: ["Paid", "Pending", "Failed"], default: "Paid" },
    orderStatus: { type: String, enum: ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"], default: "Processing" },
    totalAmount: { type: Number, required: true },
    items: [OrderItemSchema]
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
