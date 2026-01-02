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
  const [displayOrder, setDisplayOrder] = useState(0);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
        setCategories(res.data.data);
      } catch {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await axios.post(API_ENDPOINTS.UPLOAD_PRODUCT_IMAGE, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      setImage(res.data.imageUrl);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !category || !image) {
      return toast.error("Fill all required fields");
    }

    try {
      setLoading(true);
      await axios.post(
        API_ENDPOINTS.CREATE_PRODUCT,
        {
          name,
          price,
          category,
          isVeg,
          displayOrder,
          image,
          isActive: true
        },
        { withCredentials: true }
      );

      toast.success("Product added successfully");

      setName("");
      setPrice("");
      setCategory("");
      setImage("");
      setDisplayOrder(0);
      setIsVeg(true);

      onSuccess();
    } catch {
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-linear-to-br from-[#FAF3E0] via-[#E8DCC4] to-[#F5EFE6] p-6">
      
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg rounded-3xl 
        bg-white/70 backdrop-blur-xl
        border border-[#D2B48C]/50 shadow-2xl 
        p-8 space-y-5"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-[#5C4033]">
            🍽 Add Menu Item
          </h2>
          <p className="text-sm text-[#6B8E23] mt-1">
            Warm & delicious food entry
          </p>
        </motion.div>

        {/* Name */}
        <motion.div>
          <label className="text-sm text-[#5C4033]">Item Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Paneer Butter Masala"
            className="mt-1 w-full rounded-xl px-4 py-2 bg-white
            border border-[#D2B48C]/60 focus:outline-none
            focus:ring-2 focus:ring-[#6B8E23]"
          />
        </motion.div>

        {/* Price */}
        <motion.div>
          <label className="text-sm text-[#5C4033]">Price (₹)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="199"
            className="mt-1 w-full rounded-xl px-4 py-2 bg-white
            border border-[#D2B48C]/60 focus:outline-none
            focus:ring-2 focus:ring-[#8FBC8F]"
          />
        </motion.div>

        {/* Category */}
        <motion.div>
          <label className="text-sm text-[#5C4033]">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-xl px-4 py-2 bg-white
            border border-[#D2B48C]/60 focus:outline-none
            focus:ring-2 focus:ring-[#6B8E23]"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Veg + Display Order */}
   <motion.div className="flex items-center justify-between">
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <div
      onClick={() => setIsVeg(!isVeg)}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
        isVeg ? "bg-green-600 justify-start" : "bg-red-500 justify-end"
      } flex`}
    >
      <motion.div
        layout
        className="w-4 h-4 bg-white rounded-full shadow-md"
      />
    </div>
    <span className="text-sm text-[#5C4033]">
      {isVeg ? "Veg 🌱" : "Non-Veg 🍗"}
    </span>
  </label>

  <input
    type="number"
    value={displayOrder}
    onChange={(e) => setDisplayOrder(e.target.value)}
    placeholder="Order"
    className="w-24 rounded-xl px-3 py-2 bg-white
      border border-[#D2B48C]/60 focus:outline-none
      focus:ring-2 focus:ring-[#6B8E23]"
  />
</motion.div>


        {/* Image Upload */}
        <motion.div layout>
          <label className="text-sm text-[#5C4033]">Item Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            disabled={uploading}
            className="mt-2 block w-full text-sm
            file:mr-4 file:py-2 file:px-4 file:rounded-full
            file:border-0 file:bg-linear-to-r
            file:from-[#6B8E23] file:to-green-600
            file:text-white"
          />

          {image && (
            <motion.img
              src={image}
              alt="Preview"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 w-32 h-32 object-cover
              rounded-2xl shadow-lg border border-[#D2B48C]/50"
            />
          )}
        </motion.div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading || uploading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 rounded-2xl text-white font-semibold
          bg-linear-to-r from-[#6B8E23] via-green-600 to-emerald-600
          shadow-lg"
        >
          {loading ? "Adding..." : "🍽 Add Menu Item"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddProduct;
