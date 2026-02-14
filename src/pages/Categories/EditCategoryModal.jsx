import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import API_ENDPOINTS from "../../config/api";

const EditCategoryModal = ({ data, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: data.name,
    displayOrder: data.displayOrder,
    isActive: data.isActive,
  });

  const [loading, setLoading] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    setForm({
      name: data.name,
      displayOrder: data.displayOrder,
      isActive: data.isActive,
    });
  }, [data]);

  useEffect(() => {
    const closeOnEsc = (e) => e.key === "Escape" && !loading && onClose();
    window.addEventListener("keydown", closeOnEsc);
    return () => window.removeEventListener("keydown", closeOnEsc);
  }, [loading, onClose]);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target) && !loading) {
      onClose();
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!form.name.trim()) return toast.error("Category name is required");

      try {
        setLoading(true);

        await axios.put(
          API_ENDPOINTS.UPDATE_CATEGORY(data._id),
          form,
          { withCredentials: true }
        );

        toast.success("Category updated successfully");
        onSuccess();
      } catch (err) {
        toast.error(err.response?.data?.message || "Update failed");
      } finally {
        setLoading(false);
      }
    },
    [form, data._id, onSuccess]
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        onMouseDown={handleClickOutside}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Modal */}
        <motion.div
          ref={modalRef}
          onMouseDown={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md bg-[#FFF5E1] rounded-2xl shadow-xl overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#D9A066] bg-[#D9A066]/20">
            <h3 className="text-lg font-semibold text-[#6F4E37]">
              Edit Category
            </h3>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#6F4E37] mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                disabled={loading}
                required
                className="w-full px-4 py-2 border rounded-xl bg-[#FFF5E1] text-sm
                  focus:ring-2 focus:ring-[#FFA726] focus:outline-none disabled:bg-gray-100"
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-[#6F4E37] mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    displayOrder: Number(e.target.value),
                  }))
                }
                disabled={loading}
                className="w-full px-4 py-2 border rounded-xl bg-[#FFF5E1] text-sm
                  focus:ring-2 focus:ring-[#FFA726] focus:outline-none disabled:bg-gray-100"
              />
            </div>

            {/* Status Toggle */}
            <div>
              <label className="block text-sm font-medium text-[#6F4E37] mb-2">
                Status
              </label>

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
                }
                className={`w-full py-2 rounded-xl text-sm font-semibold transition
                  ${
                    form.isActive
                      ? "bg-[#D9A066]/30 text-[#6F4E37] hover:bg-[#D9A066]/50"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
              >
                {form.isActive ? "Active" : "Inactive"}
              </button>

              <p className="mt-1 text-xs text-[#6F4E37]/70">
                {form.isActive
                  ? "Category is visible to customers"
                  : "Category is hidden from customer view"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm rounded-lg border border-[#D9A066] text-[#6F4E37]
                  hover:bg-[#FFF3E0] transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm rounded-lg bg-[#6F4E37] text-[#FFF5E1]
                  hover:bg-[#5A3E2D] transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditCategoryModal;
