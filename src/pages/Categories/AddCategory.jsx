import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import API_ENDPOINTS from "../../config/api";
import { motion } from "framer-motion";

const AddCategory = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        API_ENDPOINTS.CREATE_CATEGORY,
        { name, displayOrder },
        { withCredentials: true }
      );

      toast.success("Category created successfully");
      setName("");
      setDisplayOrder(0);
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/70 backdrop-blur-xl border border-[#D2B48C]/50 rounded-3xl shadow-2xl p-8 space-y-6"
      >
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-[#5C4033] text-center"
        >
          🗂 Add Category
        </motion.h3>

        {/* Category Name */}
        <div>
          <label className="block text-sm font-medium text-[#5C4033] mb-1">
            Category Name
          </label>
          <input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 rounded-xl bg-white border border-[#D2B48C]/60
              focus:outline-none focus:ring-2 focus:ring-[#6B8E23] disabled:bg-gray-100"
            required
          />
        </div>

        {/* Display Order */}
        <div>
          <label className="block text-sm font-medium text-[#5C4033] mb-1">
            Display Order
          </label>
          <input
            type="number"
            placeholder="0"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 rounded-xl bg-white border border-[#D2B48C]/60
              focus:outline-none focus:ring-2 focus:ring-[#6B8E23] disabled:bg-gray-100"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 rounded-2xl text-white font-semibold
            bg-linear-to-r from-[#6B8E23] via-green-600 to-emerald-600
            shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "🍽 Add Category"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddCategory;
