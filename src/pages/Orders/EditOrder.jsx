// src/components/order/EditOrder.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import API_ENDPOINTS from "../../config/api";
import MenuSelector from "./MenuSelector";

const EditOrder = ({ orderId, onClose, onUpdated }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const [orderData, setOrderData] = useState({
    table: "",
    orderType: "Dine-in",
    items: [],
    totalAmount: 0,
  });

  // -------------------------------------------------
  // 🔥 Fetch order details
useEffect(() => {
  const fetchOrder = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.GET_ORDER_BY_ID(orderId), {
        withCredentials: true,
      });
      console.log("ORDER ID FROM EDIT SCREEN =", orderId);

      const order = res.data?.data;
      console.log(res.data);
 setOrderData({
  table: order.table?._id || "",
  orderType: order.orderType,
  items: order.items.map((item) => ({
    product: item.product,   // FIX
    name: item.name,         // FIX
    image: item.image,
    price: item.price,
    quantity: item.quantity,
  })),
  totalAmount: order.totalAmount,
});


      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load order");
    }
  };

  fetchOrder();
}, [orderId]);


  // -------------------------------------------------
  // 🔥 Fetch tables
  // -------------------------------------------------
  useEffect(() => {
    const loadTables = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.GET_ALL_TABLES, {
          withCredentials: true,
        });
        setTables(res.data || []);
      } catch (err) {
        toast.error("Failed to load tables");
      }
    };
    loadTables();
  }, []);

  // -------------------------------------------------
  // 🔥 Recalculate total
  // -------------------------------------------------
  useEffect(() => {
    const total = orderData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setOrderData((prev) => ({ ...prev, totalAmount: total }));
  }, [orderData.items]);

  // -------------------------------------------------
  // 🔥 Handle quantity change
  // -------------------------------------------------
  const changeQty = (index, delta) => {
    setOrderData((prev) => {
      const updated = [...prev.items];
      updated[index].quantity += delta;
      if (updated[index].quantity < 1) updated[index].quantity = 1;
      return { ...prev, items: updated };
    });
  };

  // -------------------------------------------------
  // 🔥 Remove item
  // -------------------------------------------------
  const removeItem = (index) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // -------------------------------------------------
  // 🔥 Add product from MenuSelector
  // -------------------------------------------------
  const handleAddProduct = (product) => {
    setOrderData((prev) => {
      const exists = prev.items.findIndex(
        (i) => i.product === product.product
      );

      if (exists !== -1) {
        const updated = [...prev.items];
        updated[exists].quantity += 1;
        return { ...prev, items: updated };
      }

      return {
        ...prev,
        items: [...prev.items, product],
      };
    });

    toast.success("Item added");
  };

  // -------------------------------------------------
  // 🔥 Save update
  // -------------------------------------------------
const updateOrder = async () => {
  try {
    if (orderData.items.length === 0)
      return toast.error("Order must have at least 1 item");

    const payload = {
  table: orderData.orderType === "Dine-in" ? orderData.table : null,
  orderType: orderData.orderType,
  items: orderData.items.map((i) => ({
    product: i.product,
    name: i.name,
    image: i.image,
    quantity: i.quantity,
    price: i.price,
  })),
};

    console.log("order id:",orderId)

    await axios.put(API_ENDPOINTS.UPDATE_ORDER(orderId), payload, {
      withCredentials: true,
    });

    toast.success("Order updated successfully");
    onUpdated();
    onClose();
  } catch (err) {
    console.log(err.response?.data);
    toast.error("Failed to update order");
  }
};


  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
        <div className="text-white text-lg">Loading order...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 overflow-auto flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl max-w-3xl w-full"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-900">
            ✏ Edit Order
          </h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            Close
          </button>
        </div>

        {/* Table + Order Type */}
        <div className="grid grid-cols-2 gap-4 my-4">
          <div>
            <label className="text-sm text-gray-600">Table</label>
            <select
              value={orderData.table}
              onChange={(e) =>
                setOrderData({ ...orderData, table: e.target.value })
              }
              className="w-full mt-1 p-2 border rounded-xl"
            >
              <option value="">Select Table</option>
              {tables.map((t) => (
                <option key={t._id} value={t._id}>
                  Table {t.tableNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Order Type</label>
            <select
              value={orderData.orderType}
              onChange={(e) =>
                setOrderData({ ...orderData, orderType: e.target.value })
              }
              className="w-full mt-1 p-2 border rounded-xl"
            >
              <option value="Dine-in">Dine-In</option>
              <option value="Takeaway">Takeaway</option>

            </select>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white/60 backdrop-blur-md p-4 rounded-xl border border-green-200">
          <h3 className="font-medium text-green-900 mb-3">Items</h3>

          {orderData.items.length === 0 ? (
            <p className="text-gray-500 text-sm">No items</p>
          ) : (
            <div className="space-y-3">
              {orderData.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white/70 p-3 rounded-xl shadow-sm border"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-green-900">{item.name}</p>
                      <p className="text-sm text-green-700">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quantity buttons */}
                    <button
                      onClick={() => changeQty(index, -1)}
                      className="px-2 py-1 bg-gray-200 rounded-lg"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => changeQty(index, +1)}
                      className="px-2 py-1 bg-gray-200 rounded-lg"
                    >
                      +
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(index)}
                      className="ml-3 px-3 py-1 bg-red-500 text-white rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Items */}
          <button
            onClick={() => setMenuOpen(true)}
            className="mt-4 w-full py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            + Add Items
          </button>
        </div>

        {/* Summary */}
        <div className="mt-5 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-green-900">
            Total: ₹{orderData.totalAmount}
          </h3>
          <button
            onClick={updateOrder}
            className="px-5 py-2 bg-green-700 text-white rounded-xl hover:bg-green-800"
          >
            Save Changes
          </button>
        </div>
      </motion.div>

      {menuOpen && (
        <MenuSelector
          onAddProduct={handleAddProduct}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default EditOrder;
