import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import EditCategoryModal from "./EditCategoryModal";
import API_ENDPOINTS from "../../config/api";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 10;

const AllCategories = ({ refresh, onChange }) => {
  const [categories, setCategories] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.GET_ALL_CATEGORIES, {
        withCredentials: true,
      });

      setCategories(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [refresh, fetchCategories]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this category?");
    if (!confirm) return;

    try {
      setDeleteLoadingId(id);

      await axios.delete(API_ENDPOINTS.DELETE_CATEGORY(id), {
        withCredentials: true,
      });

      toast.success("Category deleted");
      onChange();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const totalPages = useMemo(
    () => Math.ceil(categories.length / ITEMS_PER_PAGE),
    [categories]
  );

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return categories.slice(start, start + ITEMS_PER_PAGE);
  }, [categories, currentPage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6"
    >
      <h3 className="text-xl font-bold text-[#6F4E37] mb-4 text-center">
        📦 All Categories
      </h3>

      {loading ? (
        <p className="text-[#6F4E37] text-center py-4">Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-[#FFF5E1]/70 backdrop-blur-xl border border-[#D9A066] rounded-2xl shadow-xl">
          <table className="w-full border-collapse">
            <thead className="bg-[#D9A066]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#FFF5E1]">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#FFF5E1]">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#FFF5E1]">Display Order</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-[#FFF5E1]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-[#6F4E37]">
                    No categories found
                  </td>
                </tr>
              ) : (
                currentItems.map((cat) => (
                  <tr
                    key={cat._id}
                    className="border-t hover:bg-[#FFF3E0] transition"
                  >
                    <td className="px-4 py-3 text-sm text-[#6F4E37]">{cat.name}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cat.isActive
                            ? "bg-[#D9A066]/30 text-[#6F4E37]"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm text-[#6F4E37]">
                      {cat.displayOrder}
                    </td>

                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button
                        onClick={() => setEditData(cat)}
                        className="px-3 py-1 text-sm rounded-xl bg-[#D9A066] text-[#FFF5E1] hover:bg-[#FFA726] transition shadow-sm"
                      >
                        Edit
                      </button>

                      <button
                        disabled={deleteLoadingId === cat._id}
                        onClick={() => handleDelete(cat._id)}
                        className={`px-3 py-1 text-sm rounded-xl transition shadow-sm 
                          ${
                            deleteLoadingId === cat._id
                              ? "bg-red-200 text-red-600 opacity-60 cursor-wait"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }
                        `}
                      >
                        {deleteLoadingId === cat._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 py-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition 
                    ${
                      currentPage === i + 1
                        ? "bg-[#6F4E37] text-[#FFF5E1]"
                        : "bg-[#D9A066] text-[#6F4E37] hover:bg-[#FFA726]"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
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
