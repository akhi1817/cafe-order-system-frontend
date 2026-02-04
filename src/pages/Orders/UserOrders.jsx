import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Load from localStorage
  const loadLocal = () => JSON.parse(localStorage.getItem("userOrders") || "[]");

  // Save to localStorage
  const saveLocal = (newOrders) =>
    localStorage.setItem("userOrders", JSON.stringify(newOrders));

  useEffect(() => {
    setOrders(loadLocal());
  }, []);

  // Auto delete after 2 mins
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const updated = loadLocal().filter(
        (o) => now - new Date(o.createdAt).getTime() < 2 * 60 * 1000
      );

      if (updated.length !== orders.length) {
        setOrders(updated);
        saveLocal(updated);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [orders]);

  // Time Ago
  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diff = Math.floor((now - past) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700"
      >
        ⬅ Back
      </button>

      <h1 className="text-2xl mb-4 font-bold text-green-800">Your Orders</h1>

      {!orders.length && (
        <p className="text-center text-gray-500">No recent orders found</p>
      )}

      <AnimatePresence>
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.3 }}
            className="
              bg-linear-to-b from-green-100 via-green-50 to-green-100
              rounded-2xl shadow-xl p-5 mb-6 border border-green-200 
              hover:shadow-2xl transition
            "
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="font-bold text-green-900 text-lg">
                  {order.orderType}
                </h4>

                {order.table && (
                  <p className="text-sm text-green-700 font-medium">
                    Table #{order.table.tableNumber}
                  </p>
                )}

                <p className="text-xs text-green-800 mt-1">
                  🕒 {timeAgo(order.createdAt)} •{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* STATUS + PAYMENT BADGES */}
              {/* <div className="flex flex-col gap-1 items-end">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-semibold 
                    ${
                      order.status === "Completed"
                        ? "bg-green-200 text-green-900"
                        : order.status === "Preparing"
                        ? "bg-yellow-200 text-green-900"
                        : order.status === "Cancelled"
                        ? "bg-red-200 text-red-900"
                        : "bg-green-100 text-green-800"
                    }`}
                >
                  {order.status}
                </span>

                {order.status !== "Cancelled" && (
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-semibold 
                      ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-200 text-green-900"
                          : "bg-red-200 text-red-900"
                      }`}
                  >
                    {order.paymentStatus}
                  </span>
                )}
              </div> */}
            </div>

            {/* ITEMS */}
            <ul className="mb-3 max-h-40 overflow-y-auto space-y-1">
              {order.items?.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between text-sm text-green-800"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₹{item.price * item.quantity}
                  </span>
                </li>
              ))}
            </ul>

            {/* TOTAL */}
            <div className="flex justify-between font-semibold mt-2 mb-2 text-green-900 text-lg">
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
