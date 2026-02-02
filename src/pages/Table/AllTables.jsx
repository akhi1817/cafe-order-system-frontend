import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import axios from "axios";
import API_ENDPOINTS from "../../config/api";
import AddTable from "./AddTable";
import { motion } from "framer-motion";

// 🌿 Shimmer Card for Loading
const ShimmerCard = () => (
  <div className="relative w-full h-32 rounded-2xl bg-green-100 overflow-hidden">
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      className="absolute inset-0 w-1/2 bg-linear-to-r from-transparent via-yellow-300 to-transparent"
    />
  </div>
);

const AllTables = ({ refresh, onChange }) => {
  const [tables, setTables] = useState([]);
  const [editingTable, setEditingTable] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;

  // Fetch tables (memoized to prevent unnecessary recreation)
  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.GET_ALL_TABLES, { withCredentials: true });
      setTables(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch tables");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tables on mount or refresh
  useEffect(() => {
    fetchTables();
  }, [refresh, fetchTables]);

  // Delete table
  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure to delete this table?")) return;
      try {
        await axios.delete(API_ENDPOINTS.DELETE_TABLE(id), { withCredentials: true });
        toast.success("Table deleted successfully");
        fetchTables();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete table");
      }
    },
    [fetchTables]
  );

  // Toggle table status
  const handleToggleStatus = useCallback(
    async (id) => {
      try {
        const res = await axios.patch(API_ENDPOINTS.TOGGLE_TABLE_STATUS(id), {}, { withCredentials: true });
        setTables((prev) => prev.map((t) => (t._id === id ? res.data : t)));
        toast.success("Status updated");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to toggle status");
      }
    },
    []
  );

  // Memoized pagination
  const totalPages = useMemo(() => Math.ceil(tables.length / itemsPerPage), [tables.length]);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return tables.slice(start, start + itemsPerPage);
  }, [tables, currentPage, itemsPerPage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      {/* Edit Table Form */}
      {editingTable && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="p-6 bg-white/70 backdrop-blur-xl border border-yellow-300 rounded-2xl shadow-xl"
        >
          <h3 className="font-bold text-lg text-green-800 mb-3">
            Edit Table #{editingTable.tableNumber}
          </h3>
          <AddTable
            editData={editingTable}
            onSuccess={() => {
              setEditingTable(null);
              onChange(); // refresh parent
            }}
          />
        </motion.div>
      )}

      {/* Loading Shimmer */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Tables Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((table) => (
              <motion.div
                key={table._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-4 bg-white/80 backdrop-blur-md border border-green-200 rounded-2xl shadow-md hover:shadow-lg transition-all flex flex-col gap-2"
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-lg text-green-800">
                    Table {table.tableNumber}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded-full font-medium text-sm ${
                      table.status === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {table.status}
                  </span>
                </div>

                {/* Details */}
                <p className="text-green-700 text-sm">
                  Capacity: <span className="font-medium">{table.capacity}</span>
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  <button
                    onClick={() => setEditingTable(table)}
                    className="px-3 py-1 rounded-lg text-sm font-semibold text-green-800 bg-yellow-200 hover:bg-yellow-300 transition shadow-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(table._id)}
                    className="px-3 py-1 rounded-lg text-sm font-semibold text-white bg-red-400 hover:bg-red-500 transition shadow-sm"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => handleToggleStatus(table._id)}
                    className="px-3 py-1 rounded-lg text-sm font-semibold text-white bg-green-400 hover:bg-green-500 transition shadow-sm"
                  >
                    Toggle
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-6 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    currentPage === i + 1
                      ? "bg-green-600 text-white"
                      : "bg-yellow-200 text-green-800 hover:bg-yellow-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default AllTables;
