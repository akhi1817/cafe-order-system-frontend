import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import API_ENDPOINTS from "../../config/api";

const CreateOrder = ({ onSuccess }) => {
  const [orderType, setOrderType] = useState("Dine-in");
  const [table, setTable] = useState("");
  const [tables, setTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([{ product: "", quantity: 1, image: "" }]);
  const [loading, setLoading] = useState(false);
  const [isLoadingUI, setIsLoadingUI] = useState(true);

  /* SHIMMER SIMULATION */
  useEffect(() => {
    const t = setTimeout(() => setIsLoadingUI(false), 800);
    return () => clearTimeout(t);
  }, []);

  /* FETCH TABLES */
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

  /* FETCH PRODUCTS */
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.GET_ACTIVE_PRODUCTS, {
        withCredentials: true,
      });
      setProducts(res.data?.data || []);
    } catch {
      toast.error("Failed to fetch products");
    }
  }, []);

  useEffect(() => {
    fetchTables();
    fetchProducts();
    setTable("");
    setItems([{ product: "", quantity: 1, image: "" }]);
  }, [orderType, fetchTables, fetchProducts]);

  /* ADD ITEM */
  const addItem = (index = null) => {
    setItems((prev) => {
      const updated = [...prev];
      index !== null
        ? updated.splice(index + 1, 0, { product: "", quantity: 1, image: "" })
        : updated.push({ product: "", quantity: 1, image: "" });
      return updated;
    });
  };

  /* REMOVE ITEM */
  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  /* UPDATE ITEM */
  const updateItem = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      if (field === "product") {
        const found = products.find((p) => p._id === value);
        updated[index].image = found?.image || "";
      }
      updated[index][field] = value;
      return updated;
    });
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (orderType === "Dine-in" && !table)
      return toast.error("Please select a table");
    if (items.some((i) => !i.product || i.quantity < 1))
      return toast.error("Invalid product or quantity");

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
      setItems([{ product: "", quantity: 1, image: "" }]);
      setTable("");
      onSuccess?.();
      fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  /* SHIMMER */
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
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white/30 backdrop-blur-xl mt-8 p-6 rounded-2xl shadow-xl border border-green-200 max-w-2xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-[#3F4F1D] mb-6">
        🧾 Create New Order
      </h3>

      {/* Order Type */}
      <div className="flex flex-col mb-4">
        <label className="text-[#3F4F1D] font-medium mb-1">Order Type</label>
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
          <label className="text-[#3F4F1D] font-medium mb-1">Select Table</label>
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

      {/* Items */}
      <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 border mb-6">
        <h4 className="font-semibold text-[#3F4F1D] mb-2">Order Items</h4>

        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 flex-wrap mb-3"
          >
            <select
              value={item.product}
              onChange={(e) => updateItem(index, "product", e.target.value)}
              className="glass-input flex-1"
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} – ₹{p.price}
                </option>
              ))}
            </select>

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
                updateItem(index, "quantity", Number(e.target.value))
              }
              className="glass-input w-24 text-center"
            />

            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => addItem(index)}
                className="circle-btn bg-green-500 hover:bg-green-600"
              >
                +
              </button>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="circle-btn bg-red-500 hover:bg-red-600"
                >
                  −
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {items.length === 1 && (
          <button
            type="button"
            onClick={() => addItem()}
            className="text-sm text-green-700 font-medium hover:underline"
          >
            + Add another item
          </button>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={loading || (orderType === "Dine-in" && !table)}
        className="w-full py-3 rounded-xl font-semibold text-white bg-[#3F4F1D] hover:bg-[#2e3b15] disabled:opacity-50"
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
  );
};

export default CreateOrder;
