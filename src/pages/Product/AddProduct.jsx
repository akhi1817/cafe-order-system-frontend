import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import API_ENDPOINTS from "../../config/api";
import { motion } from "framer-motion";

const AddProduct = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isVeg, setIsVeg] = useState(true);
  const [displayOrder, setDisplayOrder] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.GET_ALL_CATEGORIES, {
          withCredentials: true,
        });
        setCategories(res.data.data);
      } catch {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Upload Product Image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await axios.post(API_ENDPOINTS.UPLOAD_PRODUCT_IMAGE, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImage(res.data.imageUrl);
      toast.success("Image uploaded successfully!");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Create Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !category || !image) {
      return toast.error("Please fill all required fields");
    }

    try {
      setLoading(true);

      const payload = {
        name,
        price: Number(price),
        category,
        image,
        isVeg,
        displayOrder: Number(displayOrder) || 0,
        isActive: true,
      };

      await axios.post(API_ENDPOINTS.CREATE_PRODUCT, payload, {
        withCredentials: true,
      });

      toast.success("Product added successfully!");

      // reset form
      setName("");
      setPrice("");
      setCategory("");
      setImage("");
      setIsVeg(true);
      setDisplayOrder("");

      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-[#FAF9E0] via-[#F5F7D3] to-[#E8F1C0]">

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white/70 backdrop-blur-xl border border-[#D2E089]/50 shadow-2xl p-8 rounded-3xl space-y-5"
      >
        <h2 className="text-2xl font-bold text-[#5C4033] text-center">🍽 Add Menu Item</h2>

        {/* Name */}
        <div>
          <label className="text-sm text-[#5C4033]">Item Name</label>
          <input
            type="text"
            value={name}
            placeholder="Paneer Butter Masala"
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl px-4 py-2 bg-white border border-[#D2E089]/50 focus:ring-2 focus:ring-[#6B8E23]"
          />
        </div>

        {/* Price */}
        <div>
          <label className="text-sm text-[#5C4033]">Price (₹)</label>
          <input
            type="number"
            value={price}
            placeholder="199"
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-xl px-4 py-2 bg-white border border-[#D2E089]/50 focus:ring-2 focus:ring-[#6B8E23]"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm text-[#5C4033]">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-xl px-4 py-2 bg-white border border-[#D2E089]/50 focus:ring-2 focus:ring-[#6B8E23]"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Veg + Display Order */}
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setIsVeg(!isVeg)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                isVeg ? "bg-green-600 justify-start" : "bg-red-500 justify-end"
              }`}
            >
              <motion.div layout className="w-4 h-4 bg-white rounded-full shadow" />
            </div>
            <span className="text-sm text-[#5C4033]">
              {isVeg ? "Veg 🌱" : "Non-Veg 🍗"}
            </span>
          </label>

          <input
            type="number"
            placeholder="Order"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            className="w-24 px-3 py-2 rounded-xl bg-white border border-[#D2E089]/50 focus:ring-2 focus:ring-[#6B8E23]"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="text-sm text-[#5C4033]">Item Image</label>
          <input
            type="file"
            disabled={uploading}
            onChange={handleImageUpload}
            className="mt-2 block w-full text-sm file:bg-[#6B8E23] file:text-white file:px-4 file:py-2 file:rounded-full"
          />

          {image && (
            <motion.img
              src={image}
              alt="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 w-32 h-32 rounded-2xl object-cover border shadow"
            />
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading || uploading}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-2xl text-white font-semibold bg-linear-to-r from-[#6B8E23] via-green-600 to-emerald-600 disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add Menu Item 🍽"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddProduct;
