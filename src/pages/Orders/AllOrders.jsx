import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import API_ENDPOINTS from "../../config/api";
import { useNavigate } from "react-router-dom";
import EditOrder from "./EditOrder";

const AllOrders = ({ refresh, onUpdate }) => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

const [editingOrder, setEditingOrder] = useState(null);


  const ordersPerPage = 20;
  const navigate=useNavigate();
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
      console.log(res.data)
      setOrders(allOrders);
    } catch {
      toast.error("Failed to fetch orders");
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [refresh, fetchOrders]);

  /* ===========================
       Update Order Status / Payment
  =========================== */
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

  /* ===========================
       Delete All Orders
  =========================== */
  const deleteAllOrders = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete ALL orders?")) return;
    try {
      await axios.delete(API_ENDPOINTS.DELETE_ALL_ORDERS, { withCredentials: true });
      toast.success("All orders deleted successfully");
      setOrders([]);
      setCurrentPage(1);
      onUpdate?.();
    } catch {
      toast.error("Failed to delete orders");
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
       Time Ago Formatter
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
       Auto-refresh every 60s
  =========================== */
  useEffect(() => {
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  /* ===========================
       Dashboard Stats
  =========================== */
  const stats = {
  Pending: orders.filter(o => o.status === "Pending").length,
  Preparing: orders.filter(o => o.status === "Preparing").length,
  Completed: orders.filter(o => o.status === "Completed").length,
  Cancelled: orders.filter(o => o.status === "Cancelled").length,
  Revenue: orders.filter(o => o.paymentStatus === "Paid").reduce((acc,o)=>acc+o.totalAmount,0),
};

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



  return (
    <div className="p-4">

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-linear-to-r from-green-100 via-green-50 to-green-100 p-4 rounded-2xl shadow-lg hover:shadow-2xl transition text-center">
            <div className="text-green-800 text-sm">{key}</div>
            <div className="text-2xl font-bold text-green-900 mt-1">{key === "Revenue" ? `₹${value}` : value}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-green-800">📋 All Orders</h3>
        <button onClick={deleteAllOrders} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
          🗑 Delete All Orders
        </button>
      </div>

      {/* Orders Grid */}
      {currentOrders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentOrders.map(order => (
<motion.div
  key={order._id}
  className={`
    rounded-2xl shadow-xl p-5 border transition 
    bg-linear-to-b from-green-100 via-green-50 to-green-100
${order.status !== "Cancelled" && order.paymentStatus !== "Paid"
  ? "animate-pulse bg-orange-600"
  : ""}


  `}
>


              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="font-bold text-green-900 text-lg">
                    {order.orderType} {order.orderType==="Dine-in" && order.table && <span className="text-sm text-green-700">(Table #{order.table.tableNumber})</span>}
                  </h4>
                  <p className="text-xs text-green-800 mt-1">🕒 {timeAgo(order.createdAt)} • {formatOrderTime(order.createdAt)}</p>
                </div>
                <div className="flex flex-col gap-1 items-end">
{/* Status Badge */}
<span className={`px-2 py-1 text-xs rounded-full font-semibold 
  ${order.status === "Completed" ? "bg-green-200 text-green-900" :
    order.status === "Preparing" ? "bg-yellow-200 text-green-900" :
    order.status === "Cancelled" ? "bg-red-200 text-red-900" :
    "bg-green-100 text-green-800"
  }`}>
  {order.status}
</span>

{/* Payment Badge only if NOT Cancelled */}
{order.status !== "Cancelled" && (
  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
    order.paymentStatus === "Paid" ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"
  }`}>
    {order.paymentStatus}
  </span>
)}
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

              {/* Actions */}
     {/* Actions */}
<div className="flex gap-2 flex-wrap">
  {/* Agar order completed aur paid hai, sirf delete dikhe */}
  {!(order.status === "Completed" && order.paymentStatus === "Paid") && (
    <>
      {/* Status / Payment buttons */}
      {order.status !== "Completed" && order.status !== "Cancelled" && (
        <>
          {order.status === "Pending" && (
            <>
              <button
                onClick={() => updateOrder(order._id, { status: "Preparing" })}
                className="px-3 py-1 bg-yellow-400 rounded-md text-sm font-semibold"
              >
                Start Preparing
              </button>
              <button
                onClick={() => updateOrder(order._id, { status: "Cancelled" })}
                className="px-3 py-1 bg-red-500 rounded-md text-sm font-semibold text-white"
              >
                Cancel Order
              </button>
            </>
          )}
          {order.status === "Preparing" && (
            <button
              onClick={() => updateOrder(order._id, { status: "Completed" })}
              className="px-3 py-1 bg-green-600 rounded-md text-sm font-semibold text-white"
            >
              Complete
            </button>
          )}
        </>
      )}

      {/* Payment button */}
      {order.paymentStatus === "Unpaid" && order.status !== "Cancelled" && (
        <button
          onClick={() => updateOrder(order._id, { paymentStatus: "Paid" })}
          className="px-3 py-1 bg-green-500 rounded-md text-sm font-semibold text-white"
        >
          Mark as Paid
        </button>
      )}

      {/* Edit button */}
      <button
        onClick={() => setEditingOrder(order)}
        className="px-3 py-1 bg-blue-500 rounded-md text-sm font-semibold text-white"
      >
        Edit
      </button>
    </>
  )}

  {/* ✅ Delete button (hamesha dikhe) */}
  <button
    onClick={() => handleDeleteOrder(order._id)}
    className="px-3 py-1 bg-red-600 rounded-md text-sm font-semibold text-white"
  >
    Delete
  </button>
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

export default AllOrders;
