import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    grade: { type: String, default: "All" },
    gender: { type: String, default: "Unisex" },
    sizes: [{ type: String }],
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 50 },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 12 },
    isBestseller: { type: Boolean, default: false },
    images: [{ type: String }],
    features: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
