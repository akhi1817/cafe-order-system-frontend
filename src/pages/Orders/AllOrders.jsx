import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import API_ENDPOINTS from "../../config/api";

const AllOrders = ({ refresh }) => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 20;

  const cafeInfo = {
    name: "My Cafe",
    mobile: "9876543210",
    address: "123, Coffee Street, Your City",
    pickupLine: "Pickup your order at the counter. ☕"
  };

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

  /* =========================== FETCH ORDERS =========================== */
  const fetchOrders = async (page = 1) => {
    try {
      const res = await axios.get(API_ENDPOINTS.GET_ALL_ORDERS, { withCredentials: true });
      const allOrders = res.data?.data || [];
      setTotalOrders(allOrders.length);

      const start = (page - 1) * ordersPerPage;
      const end = start + ordersPerPage;
      setOrders(allOrders.slice(start, end));
    } catch (err) {
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [refresh, currentPage]);

  /* =========================== UPDATE ORDER =========================== */
  const updateOrder = async (orderId, updateObj) => {
    try {
      await axios.patch(API_ENDPOINTS.UPDATE_ORDER_STATUS(orderId), updateObj, { withCredentials: true });
      toast.success("Order updated successfully");
      fetchOrders(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
    }
  };

  /* =========================== DELETE ALL ORDERS =========================== */
  const deleteAllOrders = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete ALL orders?")) return;
    try {
      await axios.delete(API_ENDPOINTS.DELETE_ALL_ORDERS, { withCredentials:true });
      toast.success("All orders deleted successfully");
      setOrders([]); setTotalOrders(0); setCurrentPage(1);
    } catch {
      toast.error("Failed to delete orders");
    }
  };

  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const goToNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const goToPrev = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  /* =========================== TIME AGO =========================== */
  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diff = Math.floor((now - past) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)} hrs ago`;
    return `${Math.floor(diff/86400)} days ago`;
  };

  useEffect(() => {
    const interval = setInterval(() => { setOrders(prev => [...prev]); }, 60000);
    return () => clearInterval(interval);
  }, []);

  /* =========================== DASHBOARD STATS =========================== */
  const stats = {
    Pending: orders.filter(o => o.status==="Pending").length,
    Preparing: orders.filter(o => o.status==="Preparing").length,
    "In Progress": orders.filter(o => o.status==="In Progress").length,
    Completed: orders.filter(o => o.status==="Completed").length,
    Revenue: orders.filter(o => o.paymentStatus==="Paid").reduce((acc,o)=>acc+o.totalAmount,0),
  };

  return (
    <div className="p-4">
      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-linear-to-r from-white/80 via-white/70 to-white/80 p-4 rounded-2xl shadow-lg hover:shadow-2xl transition text-center">
            <div className="text-gray-500 text-sm">{key}</div>
            <div className="text-2xl font-bold text-[#3F4F1D] mt-1">{key==="Revenue" ? `₹${value}` : value}</div>
          </div>
        ))}
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">📋 All Orders</h3>
        <button onClick={deleteAllOrders} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">🗑 Delete All Orders</button>
      </div>

      {/* ORDERS GRID */}
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map(order => (
            <div key={order._id} className="bg-linear-to-b from-white/80 via-white/70 to-white/80 rounded-2xl shadow-xl p-5 hover:shadow-2xl transition border border-gray-200">

              {/* HEADER */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="font-bold text-[#3F4F1D] text-lg">{order.orderType} {order.orderType==="Dine-in" && order.table && <span className="text-sm text-gray-600">(Table #{order.table.tableNumber})</span>}</h4>
                  <p className="text-xs text-gray-500 mt-1">🕒 {timeAgo(order.createdAt)} • {formatOrderTime(order.createdAt)}</p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${order.status==="Completed"?"bg-green-100 text-green-800":order.status==="Preparing"?"bg-orange-100 text-orange-800":"bg-blue-100 text-blue-800"}`}>{order.status}</span>
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${order.paymentStatus==="Paid"?"bg-green-200 text-green-900":"bg-red-200 text-red-900"}`}>{order.paymentStatus}</span>
                </div>
              </div>

              {/* ITEMS */}
              <ul className="mb-3 max-h-40 overflow-y-auto space-y-1">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-medium">₹{item.price*item.quantity}</span>
                  </li>
                ))}
              </ul>

              {/* TOTAL */}
              <div className="flex justify-between font-semibold mt-2 mb-2">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 flex-wrap">
                {order.status!=="Completed" && <>
                  {order.status==="Pending" && <button onClick={()=>updateOrder(order._id,{status:"Preparing"})} className="px-3 py-1 bg-yellow-400 rounded-md text-sm font-semibold">Start Preparing</button>}
                  {order.status==="Preparing" && <button onClick={()=>updateOrder(order._id,{status:"In Progress"})} className="px-3 py-1 bg-blue-500 rounded-md text-sm font-semibold text-white">In Progress</button>}
                  {order.status==="In Progress" && <button onClick={()=>updateOrder(order._id,{status:"Completed"})} className="px-3 py-1 bg-green-500 rounded-md text-sm font-semibold text-white">Complete</button>}
                </>}
                {order.paymentStatus==="Unpaid" && <button onClick={()=>updateOrder(order._id,{paymentStatus:"Paid"})} className="px-3 py-1 bg-indigo-600 rounded-md text-sm font-semibold text-white">Mark as Paid</button>}
                {order.status==="Completed" && order.paymentStatus==="Paid" && <button onClick={()=>printReceipt(order)} className="px-3 py-1 bg-gray-700 rounded-md text-sm font-semibold text-white">Print Receipt</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button onClick={goToPrev} disabled={currentPage===1} className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50">Prev</button>
          <span className="px-3 py-1 rounded bg-gray-200">{currentPage} / {totalPages}</span>
          <button onClick={goToNext} disabled={currentPage===totalPages} className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
