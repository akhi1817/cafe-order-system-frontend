import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import API_ENDPOINTS from "../../config/api";

const EditCategoryModal = ({ data, onClose, onSuccess }) => {
  const [name, setName] = useState(data.name);
  const [displayOrder, setDisplayOrder] = useState(data.displayOrder);
  const [isActive, setIsActive] = useState(data.isActive);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        API_ENDPOINTS.UPDATE_CATEGORY(data._id),
        { name, displayOrder, isActive },
        {
          withCredentials: true // 🔐 admin only
        }
      );

      toast.success("Category updated successfully");
      onSuccess();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Edit Category
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="px-6 py-5 space-y-5">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Status Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Status
            </label>

            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              disabled={loading}
              className={`w-full py-2 rounded-lg text-sm font-semibold transition
                ${
                  isActive
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }
              `}
            >
              {isActive ? "Active" : "Inactive"}
            </button>

            <p className="mt-1 text-xs text-gray-500">
              {isActive
                ? "Category is visible on customer screen"
                : "Category is hidden from customer screen"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
