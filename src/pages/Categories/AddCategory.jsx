import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import API_ENDPOINTS from "../../config/api";
import { motion } from "framer-motion";

const AddCategory = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    displayOrder: 0,
  });

  const [loading, setLoading] = useState(false);

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Category name is required");

    if (form.displayOrder < 0) {
      return toast.error("Display order cannot be negative");
    }

    try {
      setLoading(true);

      await axios.post(
        API_ENDPOINTS.CREATE_CATEGORY,
        {
          name: form.name.trim(),
          displayOrder: Number(form.displayOrder),
        },
        { withCredentials: true }
      );

      toast.success("Category created successfully");

      // Reset fields
      setForm({ name: "", displayOrder: 0 });

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
        className="bg-[#FFF5E1]/70 backdrop-blur-xl border border-[#D9A066] rounded-3xl shadow-2xl p-8 space-y-6"
      >
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-[#6F4E37] text-center"
        >
          🗂 Add Category
        </motion.h3>

        {/* Category Name */}
        <div>
          <label className="block text-sm font-medium text-[#6F4E37] mb-1">
            Category Name
          </label>
          <input
            type="text"
            placeholder="Enter category name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 rounded-xl bg-[#FFF5E1] border border-[#D9A066]
              focus:outline-none focus:ring-2 focus:ring-[#FFA726] disabled:bg-gray-100"
            required
          />
        </div>

        {/* Display Order */}
        <div>
          <label className="block text-sm font-medium text-[#6F4E37] mb-1">
            Display Order
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={form.displayOrder}
            onChange={(e) =>
              updateField("displayOrder", Math.max(0, Number(e.target.value)))
            }
            disabled={loading}
            className="w-full px-4 py-2 rounded-xl bg-[#FFF5E1] border border-[#D9A066]
              focus:outline-none focus:ring-2 focus:ring-[#FFA726] disabled:bg-gray-100"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          className="w-full py-3 rounded-2xl text-white font-semibold
            bg-[#6F4E37] hover:bg-[#5A3E2D]
            shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "🍽 Add Category"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddCategory;
