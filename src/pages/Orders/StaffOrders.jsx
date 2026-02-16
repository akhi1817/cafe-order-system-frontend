import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import API_ENDPOINTS from "../../config/api";
import EditOrder from "./EditOrder";

const StaffOrders = ({ refresh, onUpdate }) => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingOrder, setEditingOrder] = useState(null);

  const ordersPerPage = 20;

  const formatOrderTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.GET_ALL_ORDERS, { withCredentials: true });
      const allOrders = res.data?.data || [];
      setOrders(allOrders);
    } catch {
      toast.error("Failed to fetch orders");
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [refresh, fetchOrders]);

  /* ===========================
       Delete Single Order
  =========================== */
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this order?")) return;

    try {
      await axios.delete(API_ENDPOINTS.DELETE_ORDER(orderId), { withCredentials: true });
      toast.success("Order deleted successfully");
      fetchOrders();
      onUpdate?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete order");
    }
  };

  /* ===========================
       Pagination
  =========================== */
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const currentOrders = orders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  const goToNext = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
  const goToPrev = () => currentPage > 1 && setCurrentPage(prev => prev - 1);

  /* ===========================
       Time Ago
  =========================== */
  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diff = Math.floor((now - past) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)} hrs ago`;
    return `${Math.floor(diff/86400)} days ago`;
  };

  /* ===========================
       Auto-refresh
  =========================== */
  useEffect(() => {
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

   const updateOrder = async (orderId, updateObj) => {
    try {
      await axios.patch(API_ENDPOINTS.UPDATE_ORDER_STATUS(orderId), updateObj, { withCredentials: true });
      toast.success("Order updated successfully");
      fetchOrders();
      onUpdate?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
    }
  };

  return (
    <div className="p-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-green-800">📋 Staff Orders</h3>
      </div>

      {/* Orders Grid */}
      {currentOrders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {currentOrders.map(order => (
        <motion.div
  key={order._id}
  className={`
    rounded-2xl shadow-xl p-5 border transition 
    bg-linear-to-b from-green-100 via-green-50 to-green-100
    ${order.status === "Pending" ? "animate-pulse" : ""}
  `}
>


              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="font-bold text-green-900 text-lg">
                    {order.orderType}{" "}
                    {order.orderType === "Dine-in" && order.table && (
                      <span className="text-sm text-green-700">(Table #{order.table.tableNumber})</span>
                    )}
                  </h4>

                  <p className="text-xs text-green-800 mt-1">
                    🕒 {timeAgo(order.createdAt)} • {formatOrderTime(order.createdAt)}
                  </p>
                </div>

                <div className="flex flex-col gap-1 items-end">
                  {/* Status Badge */}
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold 
                    ${order.status === "Completed" ? "bg-green-200 text-green-900" :
                      order.status === "Preparing" ? "bg-yellow-200 text-green-900" :
                      order.status === "Cancelled" ? "bg-red-200 text-red-900" :
                      "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <ul className="mb-3 max-h-40 overflow-y-auto space-y-1">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm text-green-800">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>

              {/* Total */}
              <div className="flex justify-between font-semibold mt-2 mb-2 text-green-900">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>

              {/* Actions: ONLY Edit + Delete */}
              <div className="flex gap-2 flex-wrap">

                {/* Edit */}
              {/* Edit button – sirf jab order Completed na ho */}
{(order.status !== "Completed" && order.status !== "Cancelled") && (
  <button
    onClick={() => setEditingOrder(order)}
    className="px-3 py-1 bg-blue-500 rounded-md text-sm font-semibold text-white"
  >
    Edit
  </button>
)}



                       {order.status === "Pending" && (
                  <button
                    onClick={() => updateOrder(order._id, { status: "Cancelled" })}
                    className="px-3 py-1 bg-red-500 rounded-md text-sm font-semibold text-white"
                  >
                    Cancel Order
                  </button>
                )}

               {/* ✅ Delete button (sirf Completed ya Cancelled par dikhe)
                    {(order.status === "Completed" || order.status === "Cancelled") && (
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="px-3 py-1 bg-red-600 rounded-md text-sm font-semibold text-white"
                      >
                        Delete
                      </button>
                    )} */}

              </div>

            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button onClick={goToPrev} disabled={currentPage===1} className="px-3 py-1 rounded bg-green-200 text-green-900 disabled:opacity-50">Prev</button>
          <span className="px-3 py-1 rounded bg-green-100 text-green-900">{currentPage} / {totalPages}</span>
          <button onClick={goToNext} disabled={currentPage===totalPages} className="px-3 py-1 rounded bg-green-200 text-green-900 disabled:opacity-50">Next</button>
        </div>
      )}

      {editingOrder && (
        <EditOrder
          orderId={editingOrder._id}
          onClose={() => setEditingOrder(null)}
          onUpdated={() => {
            fetchOrders();
            onUpdate?.();
          }}
        />
      )}

    </div>
  );
};

export default StaffOrders;
