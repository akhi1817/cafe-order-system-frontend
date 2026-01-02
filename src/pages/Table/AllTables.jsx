import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import API_ENDPOINTS from "../../config/api";
import AddTable from "./AddTable";
import { motion } from "framer-motion";

const AllTables = ({ refresh, onChange }) => {
  const [tables, setTables] = useState([]);
  const [editingTable, setEditingTable] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchTables = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.GET_ALL_TABLES, { withCredentials: true });
      setTables(res.data);
    } catch (err) {
      toast.error("Failed to fetch tables");
    }
  };

  useEffect(() => {
    fetchTables();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this table?")) return;
    try {
      await axios.delete(API_ENDPOINTS.DELETE_TABLE(id), { withCredentials: true });
      toast.success("Table deleted successfully");
      fetchTables();
    } catch (err) {
      toast.error("Failed to delete table");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.patch(API_ENDPOINTS.TOGGLE_TABLE_STATUS(id), {}, { withCredentials: true });
      setTables(prev => prev.map(t => t._id === id ? res.data : t));
      toast.success("Status updated");
    } catch (err) {
      toast.error("Failed to toggle status");
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = tables.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(tables.length / itemsPerPage);

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
          className="p-6 bg-white/70 backdrop-blur-xl border border-[#D2B48C]/50 rounded-2xl shadow-2xl"
        >
          <h3 className="font-bold text-lg text-[#5C4033] mb-3">Edit Table #{editingTable.tableNumber}</h3>
          <AddTable
            editData={editingTable}
            onSuccess={() => {
              setEditingTable(null);
              onChange();
            }}
          />
        </motion.div>
      )}

      {/* Tables Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {currentItems.map(table => (
    <motion.div
      key={table._id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 bg-white/80 backdrop-blur-md border border-[#D2B48C]/30 rounded-2xl shadow-md hover:shadow-lg transition-all flex flex-col gap-2"
    >
      {/* Table Header */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg text-[#3F4F1D]">Table {table.tableNumber}</h4>
        <span className={`px-2 py-1 rounded-full font-medium text-sm ${
          table.status === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {table.status}
        </span>
      </div>

      {/* Table Details */}
      <p className="text-[#5C4033] text-sm">Capacity: <span className="font-medium">{table.capacity}</span></p>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-3 flex-wrap">
        <button
          onClick={() => setEditingTable(table)}
          className="px-3 py-1 rounded-lg text-sm font-semibold text-[#5C4033] bg-yellow-100 hover:bg-yellow-200 transition shadow-sm"
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
        <div className="flex justify-center gap-3 mt-6">
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
    </motion.div>
  );
};

export default AllTables;
