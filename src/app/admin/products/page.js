"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminGuard from "@/components/AdminGuard";
import { CATEGORIES, SCHOOL_CLASSES } from "@/lib/seedData";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Search, 
  Sparkles, 
  Package, 
  SlidersHorizontal,
  GraduationCap,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Grade/Class Category Section Filter
  const [selectedGradeCategory, setSelectedGradeCategory] = useState("All");
  const [selectedItemCategory, setSelectedItemCategory] = useState("All Categories");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Compression State
  const [imageCompressing, setImageCompressing] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "Uniforms",
    grade: "Class 5",
    gender: "Unisex",
    sizes: "28, 30, 32, 34",
    stockCount: 50,
    imageUrl: ""
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Image Compression Utility (< 2MB)
  const compressImage = (file, maxSizeMB = 2) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.85;
          let dataUrl = canvas.toDataURL("image/jpeg", quality);

          // Iterate quality reduction if file size exceeds target limit
          while (dataUrl.length > maxSizeMB * 1024 * 1024 * 1.33 && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }

          const sizeInMB = (dataUrl.length * 0.75 / (1024 * 1024)).toFixed(2);
          const origSizeMB = (file.size / (1024 * 1024)).toFixed(2);

          setCompressionStatus(`Compressed from ${origSizeMB} MB to ${sizeInMB} MB (Target: ≤ 2.0 MB)`);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageCompressing(true);
    setCompressionStatus("Compressing uploaded image to ≤ 2MB...");

    try {
      const compressedDataUrl = await compressImage(file, 2);
      setFormData((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
    } catch (err) {
      alert("Failed to process image.");
      setCompressionStatus("Image processing failed.");
    } finally {
      setImageCompressing(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setCompressionStatus("");
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "Uniforms",
      grade: selectedGradeCategory !== "All" && selectedGradeCategory !== "General Items" ? selectedGradeCategory : "Class 5",
      gender: "Unisex",
      sizes: "28, 30, 32, 34",
      stockCount: 50,
      imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800"
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setCompressionStatus("");
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      originalPrice: product.originalPrice || "",
      category: product.category,
      grade: product.grade || "All",
      gender: product.gender || "Unisex",
      sizes: product.sizes ? product.sizes.join(", ") : "Standard",
      stockCount: product.stockCount || 50,
      imageUrl: product.images?.[0] || ""
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product from store catalog?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      await fetchProducts();
    } catch (e) {
      alert("Failed to delete product.");
    }
  };

  const handleClearProducts = async () => {
    if (!confirm("Are you sure you want to delete ALL products from store catalog? You can then add new products from scratch.")) return;
    try {
      await fetch("/api/products", { method: "DELETE" });
      await fetchProducts();
    } catch (e) {
      alert("Failed to clear products.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price) * 1.2,
      category: formData.category,
      grade: formData.grade,
      gender: formData.gender,
      sizes: formData.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      stockCount: Number(formData.stockCount),
      inStock: Number(formData.stockCount) > 0,
      images: formData.imageUrl ? [formData.imageUrl] : ["https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800"]
    };

    try {
      if (editingProduct) {
        await fetch(`/api/products/${editingProduct.id || editingProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      setIsModalOpen(false);
      await fetchProducts();
    } catch (e) {
      alert("Error saving product.");
    }
  };

  const gradeCategories = [
    { id: "All", label: "All Items" },
    { id: "General Items", label: "General / All Classes" },
    { id: "Nursery", label: "Nursery" },
    { id: "LKG", label: "LKG" },
    { id: "UKG", label: "UKG" },
    { id: "Class 1", label: "Class 1" },
    { id: "Class 2", label: "Class 2" },
    { id: "Class 3", label: "Class 3" },
    { id: "Class 4", label: "Class 4" },
    { id: "Class 5", label: "Class 5" },
    { id: "Class 6", label: "Class 6" },
    { id: "Class 7", label: "Class 7" },
    { id: "Class 8", label: "Class 8" },
    { id: "Class 9", label: "Class 9" },
    { id: "Class 10", label: "Class 10" },
    { id: "Class 11", label: "Class 11" },
    { id: "Class 12", label: "Class 12" }
  ];

  const filtered = products.filter((p) => {
    if (selectedGradeCategory !== "All") {
      if (selectedGradeCategory === "General Items") {
        if (p.grade !== "All" && p.grade !== "Class 1 to 12" && p.grade !== "All Classes") return false;
      } else {
        if (p.grade !== selectedGradeCategory && p.grade !== "All" && p.grade !== "Class 1 to 12") return false;
      }
    }

    if (selectedItemCategory !== "All Categories" && p.category !== selectedItemCategory) {
      return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.grade && p.grade.toLowerCase().includes(q))
      );
    }

    return true;
  });

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          
          <AdminSidebar />

          <main className="flex-1 min-w-0 space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Product Catalog Manager
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Organize and manage inventory by Grade/Class categories & product types
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={handleClearProducts}
                  className="px-4 py-2.5 sm:py-3 bg-red-50 text-red-700 hover:bg-red-100 font-extrabold rounded-2xl text-xs transition-all border border-red-200 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4 text-red-600" /> Clear Catalog
                </button>

                <button
                  onClick={handleOpenAddModal}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-amber-300" /> Add New Product
                </button>
              </div>
            </div>

            {/* CLASS / GRADE CATEGORY TAB SELECTOR */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-700" /> Class / Grade Category Manager
                </h2>
                <span className="text-[11px] text-slate-500 font-bold hidden sm:inline">
                  Active Category: <strong className="text-purple-900">{selectedGradeCategory}</strong>
                </span>
              </div>

              {/* Scrollable Pills for Class Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 touch-pan-x scrollbar-thin">
                {gradeCategories.map((cat) => {
                  const isActive = selectedGradeCategory === cat.id;
                  const count = cat.id === "All"
                    ? products.length
                    : cat.id === "General Items"
                    ? products.filter(p => p.grade === "All" || p.grade === "Class 1 to 12" || p.grade === "All Classes").length
                    : products.filter(p => p.grade === cat.id || p.grade === "All" || p.grade === "Class 1 to 12").length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedGradeCategory(cat.id)}
                      className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 border ${
                        isActive
                          ? "bg-purple-900 text-white border-purple-900 shadow-md scale-102"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:border-purple-700 hover:bg-purple-50/50"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                        isActive ? "bg-amber-400 text-slate-950" : "bg-slate-200 text-slate-700"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECONDARY FILTER BAR & SEARCH */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search catalog by product name, category, or class..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-semibold text-slate-900"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              <div className="sm:col-span-5">
                <select
                  value={selectedItemCategory}
                  onChange={(e) => setSelectedItemCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-bold text-slate-800"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* PRODUCTS TABLE */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>
                  Showing <strong className="text-slate-900">{filtered.length}</strong> items in{" "}
                  <strong className="text-purple-900">{selectedGradeCategory}</strong> category
                </span>
                {(selectedGradeCategory !== "All" || selectedItemCategory !== "All Categories" || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedGradeCategory("All");
                      setSelectedItemCategory("All Categories");
                      setSearchQuery("");
                    }}
                    className="text-[11px] font-extrabold text-purple-700 hover:underline"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-xs text-left min-w-[650px]">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Item Details</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Class/Grade</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock Count</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-semibold">
                          No products found matching &quot;{selectedGradeCategory}&quot; filter. Click &quot;Add New Product&quot; to create one.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((prod) => (
                        <tr key={prod.id || prod._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 flex items-center gap-3">
                            <img
                              src={prod.images?.[0] || "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800"}
                              alt={prod.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="font-extrabold text-slate-900 text-xs line-clamp-1">{prod.name}</h4>
                              <p className="text-[10px] text-slate-400">Sizes: {prod.sizes?.join(", ") || "Standard"}</p>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 bg-blue-900 text-white rounded font-bold text-[10px] whitespace-nowrap">
                              {prod.category}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <span className="px-2.5 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg font-black text-[11px] whitespace-nowrap">
                              {prod.grade || "General"}
                            </span>
                          </td>

                          <td className="px-4 py-3 font-black text-slate-900 whitespace-nowrap">₹{prod.price}</td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                              prod.stockCount > 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                            }`}>
                              {prod.stockCount} units
                            </span>
                          </td>

                          <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenEditModal(prod)}
                              className="p-1.5 bg-blue-50 text-blue-900 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Edit Item"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id || prod._id)}
                              className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </main>
        </div>

        {/* ADD / EDIT PRODUCT MODAL WITH IMAGE COMPRESSION */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-4">
                {editingProduct ? "Edit Inventory Product" : "Add New Product to Catalog"}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Class 1 CBSE Textbook Kit"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Sale Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Original MRP Price (₹)</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Category Type</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                    >
                      {CATEGORIES.slice(1).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Target Class / Grade *</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full px-3 py-2 bg-purple-50 border border-purple-300 rounded-xl font-extrabold text-purple-950"
                    >
                      <option value="All">General / All Classes</option>
                      {SCHOOL_CLASSES.slice(1).map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Sizes (Comma Separated)</label>
                    <input
                      type="text"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      placeholder="28, 30, 32 or Standard"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={formData.stockCount}
                      onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                </div>

                {/* IMAGE UPLOAD WITH AUTO-COMPRESSION UNDER 2MB */}
                <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-900 font-extrabold flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-purple-700" /> Upload Product Image (Auto Compress ≤ 2MB)
                    </label>
                    <span className="text-[10px] font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                      Limit: 2.0 MB
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-purple-700 file:text-white hover:file:bg-purple-800 transition-all"
                  />

                  {imageCompressing && (
                    <p className="text-xs font-bold text-amber-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-600" /> Compressing image file under 2MB...
                    </p>
                  )}

                  {compressionStatus && !imageCompressing && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{compressionStatus}</span>
                    </div>
                  )}

                  <div className="pt-1">
                    <label className="block text-slate-700 font-bold mb-1">Or Enter Image Web URL</label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  {formData.imageUrl && (
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-[11px] font-bold text-slate-500">Preview:</span>
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-xl border border-slate-300 shadow-xs"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={imageCompressing}
                  className="w-full py-3.5 bg-purple-700 text-white font-extrabold rounded-xl shadow-md hover:bg-purple-800 transition-colors text-xs mt-2 disabled:opacity-50"
                >
                  {editingProduct ? "Save Product Changes" : "Create & Publish Product"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
