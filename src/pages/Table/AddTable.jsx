import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import API_ENDPOINTS from "../../config/api";
import { motion } from "framer-motion";

const AddTable = ({ onSuccess, editData = null }) => {
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync editData only when it changes
  useEffect(() => {
    if (editData) {
      setTableNumber(editData.tableNumber);
      setCapacity(editData.capacity);
    } else {
      setTableNumber("");
      setCapacity("");
    }
  }, [editData]);

  // Memoized submit handler → prevents unnecessary re-renders
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!tableNumber || !capacity) {
        return toast.error("Please fill all fields");
      }

      try {
        setLoading(true);

        const payload = {
          tableNumber: Number(tableNumber),
          capacity: Number(capacity),
        };

        if (editData) {
          await axios.put(API_ENDPOINTS.UPDATE_TABLE(editData._id), payload, {
            withCredentials: true,
          });
          toast.success("Table updated successfully");
        } else {
          await axios.post(API_ENDPOINTS.CREATE_TABLE, payload, {
            withCredentials: true,
          });
          toast.success("Table added successfully");
        }

        // Reset fields
        setTableNumber("");
        setCapacity("");
        onSuccess(); // Refresh parent list
      } catch (err) {
        if (err.response?.data?.code === 11000) {
          toast.error("Table number already exists!");
        } else {
          toast.error(err.response?.data?.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    },
    [tableNumber, capacity, editData, onSuccess]
  );

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 w-full max-w-md bg-white/70 backdrop-blur-md border border-green-200 rounded-2xl shadow-lg p-6 mx-auto"
    >
      <h3 className="text-lg font-bold text-green-800 text-center mb-3">
        {editData ? "Edit Table" : "Add Table"}
      </h3>

      {/* Table Number */}
      <input
        type="number"
        placeholder="Table Number"
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
        className="w-full px-4 py-2 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 bg-white/80"
        min={1}
        disabled={loading}
      />

      {/* Capacity */}
      <input
        type="number"
        placeholder="Capacity"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        className="w-full px-4 py-2 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 bg-white/80"
        min={1}
        disabled={loading}
      />

      {/* Submit Button */}
      <div className="flex justify-center mt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-lg font-semibold text-white bg-green-400 hover:bg-green-500 transition shadow-sm text-sm"
        >
          {loading
            ? editData
              ? "Updating..."
              : "Adding..."
            : editData
            ? "Update Table"
            : "Add Table"}
        </button>
      </div>
    </motion.form>
  );
};

export default AddTable;
