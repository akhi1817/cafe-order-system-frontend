import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import EditCategoryModal from "./EditCategoryModal";
import API_ENDPOINTS from "../../config/api";
import { motion } from "framer-motion";

const AllCategories = ({ refresh, onChange }) => {
  const [categories, setCategories] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      setCategories(res.data.data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(API_ENDPOINTS.DELETE_CATEGORY(id), {
        withCredentials: true
      });

      toast.success("Category deleted");
      onChange();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refresh]);

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = categories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <h3 className="text-xl font-bold text-[#5C4033] mb-4 text-center">
        📦 All Categories
      </h3>

      {loading ? (
        <p className="text-[#5C4033] text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white/70 backdrop-blur-xl border border-[#D2B48C]/50 rounded-2xl shadow-2xl">
          <table className="w-full border-collapse">
            <thead className="bg-[#FFF9E0]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#5C4033]">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#5C4033]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#5C4033]">
                  Display Order
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-[#5C4033]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-[#5C4033]"
                  >
                    No categories found
                  </td>
                </tr>
              ) : (
                currentItems.map((cat) => (
                  <tr
                    key={cat._id}
                    className="border-t hover:bg-[#FAF3E0] transition"
                  >
                    <td className="px-4 py-3 text-sm text-[#5C4033]">
                      {cat.name}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cat.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-[#5C4033]">
                      {cat.displayOrder}
                    </td>

                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button
                        onClick={() => setEditData(cat)}
                        className="px-3 py-1 text-sm rounded-xl bg-[#FFF9E0] text-[#5C4033] hover:bg-[#FAF3E0] transition shadow-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="px-3 py-1 text-sm rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition shadow-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    currentPage === i + 1
                      ? "bg-[#6B8E23] text-white"
                      : "bg-[#FFF9E0] text-[#5C4033] hover:bg-[#FAF3E0]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {editData && (
        <EditCategoryModal
          data={editData}
          onClose={() => setEditData(null)}
          onSuccess={() => {
            setEditData(null);
            onChange();
          }}
        />
      )}
    </motion.div>
  );
};

export default AllCategories;
