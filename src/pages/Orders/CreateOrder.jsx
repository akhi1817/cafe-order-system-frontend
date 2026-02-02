// src/components/order/CreateOrder.jsx
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import API_ENDPOINTS from "../../config/api";
import MenuSelector from "./MenuSelector";

const CreateOrder = ({ onSuccess }) => {
  const [orderType, setOrderType] = useState("Dine-in");
  const [table, setTable] = useState("");
  const [tables, setTables] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingUI, setIsLoadingUI] = useState(true);

  const [menuOpen, setMenuOpen] = useState(false);

  // SHIMMER SIMULATION
  useEffect(() => {
    const t = setTimeout(() => setIsLoadingUI(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Fetch tables
  const fetchTables = useCallback(async () => {
    if (orderType !== "Dine-in") return setTables([]);
    try {
      const res = await axios.get(API_ENDPOINTS.GET_AVAILABLE_TABLES, {
        withCredentials: true,
      });
      setTables(res.data?.data || []);
    } catch {
      toast.error("Failed to fetch tables");
    }
  }, [orderType]);

  useEffect(() => {
    fetchTables();
    setTable("");
    setItems([]);
  }, [orderType, fetchTables]);

  // -------------------------
  // Items Management
  // -------------------------

  const addItem = (product) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.product === product.product);
      if (existingIndex !== -1) {
        // Increment quantity if already in order
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, product];
    });
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItemQuantity = (index, qty) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = qty;
      return updated;
    });
  };

  // -------------------------
  // Submit Order
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (orderType === "Dine-in" && !table)
      return toast.error("Please select a table");
    if (items.length === 0)
      return toast.error("Please select at least one product");
    if (items.some((i) => i.quantity < 1))
      return toast.error("Invalid quantity");

    setLoading(true);

    try {
      const backendItems = items.map((i) => ({
        product: i.product,
        quantity: i.quantity,
      }));

      await axios.post(
        API_ENDPOINTS.CREATE_ORDER,
        {
          orderType,
          table: orderType === "Dine-in" ? table : null,
          items: backendItems,
        },
        { withCredentials: true }
      );

      toast.success("Order created successfully");
      setItems([]);
      setTable("");
      onSuccess?.();
      fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // SHIMMER
  // -------------------------
  if (isLoadingUI) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 rounded-2xl bg-white/30 backdrop-blur-xl shadow-xl border animate-pulse">
        <div className="h-6 bg-gray-300/40 rounded w-40 mb-6"></div>
        <div className="h-12 bg-gray-300/40 rounded mb-4"></div>
        <div className="h-12 bg-gray-300/40 rounded mb-4"></div>
        <div className="h-32 bg-gray-300/40 rounded mb-6"></div>
        <div className="h-12 bg-gray-300/40 rounded"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-2xl mx-auto"
    >
      {/* MENU SELECTOR MODAL */}
      {menuOpen && (
        <MenuSelector
          onAddProduct={(prod) => {
            addItem(prod);
          }}
          onClose={() => setMenuOpen(false)}
        />
      )}

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/30 backdrop-blur-xl mt-8 p-6 rounded-2xl shadow-xl border border-green-200"
      >
        <h3 className="text-2xl font-bold text-green-900 mb-6">🧾 Create New Order</h3>

        {/* Order Type */}
        <div className="flex flex-col mb-4">
          <label className="text-green-900 font-medium mb-1">Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="glass-input"
          >
            <option>Dine-in</option>
            <option>Takeaway</option>
          </select>
        </div>

        {/* Table */}
        {orderType === "Dine-in" && (
          <div className="flex flex-col mb-4">
            <label className="text-green-900 font-medium mb-1">Select Table</label>
            <select
              value={table}
              onChange={(e) => setTable(e.target.value)}
              className="glass-input"
            >
              <option value="">Select Table</option>
              {tables.map((t) => (
                <option key={t._id} value={t._id}>
                  Table #{t.tableNumber} ({t.capacity} seats)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* SEE MENU BUTTON */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="w-full py-2 rounded-xl font-semibold text-white bg-green-700 hover:bg-green-800"
          >
            🍔 See Menu
          </button>
        </div>

        {/* Items List */}
        {items.length > 0 && (
          <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 border mb-6">
            <h4 className="font-semibold text-green-900 mb-2">Order Items</h4>

            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 flex-wrap mb-3"
              >
                <div className="flex-1">
                  <p className="font-medium text-green-900">{item.name} – ₹{item.price}</p>
                </div>

                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    className="h-16 w-16 object-cover rounded-xl shadow"
                  />
                )}

                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItemQuantity(index, Number(e.target.value))
                  }
                  className="glass-input w-24 text-center"
                />

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="circle-btn bg-red-500 hover:bg-red-600"
                >
                  −
                </button>
              </div>
            ))}
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading || (orderType === "Dine-in" && !table)}
          className="w-full py-3 rounded-xl font-semibold text-white bg-green-900 hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Order"}
        </motion.button>

        {/* EXTRA CSS */}
        <style>{`
          .glass-input {
            background: rgba(255, 255, 255, 0.65);
            border: 1px solid #d9e7c4;
            padding: 10px 14px;
            border-radius: 12px;
            backdrop-filter: blur(10px);
            outline: none;
            transition: 0.2s;
          }
          .glass-input:focus {
            border-color: #98b46c;
            box-shadow: 0 0 0 3px #ddeecc;
          }
          .circle-btn {
            height: 40px;
            width: 40px;
            border-radius: 50%;
            color: white;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.15s;
          }
        `}</style>
      </motion.form>
    </motion.div>
  );
};

export default CreateOrder;
