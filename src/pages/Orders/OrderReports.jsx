import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import API_ENDPOINTS from "../../config/api";

export default function OrderReports({ onSuccess }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const cafeInfo = {
    name: "Demo Cafe",
    address: "123, Coffee Street, Demo City",
    mobile: "9876543210",
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.GET_ORDER_REPORTS, {
        params: { fromDate, toDate },
        withCredentials: true,
      });
      setOrders(res.data.data || []);
    } catch {
      toast.error("Failed to load order reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const printBill = (order) => {
    const billWindow = window.open("", "_blank", "width=600,height=800");
    billWindow.document.write(`
      <html>
        <head>
          <title>Bill - ${order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #3F4F1D; }
            h2 { text-align: center; margin-bottom: 5px; }
            .info { margin-bottom: 5px; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #D2B48C; padding: 8px; text-align: left; }
            th { background-color: #FAF3E0; }
            .total { text-align: right; font-weight: bold; margin-top: 10px; }
          </style>
        </head>
        <body>
          <h2>${cafeInfo.name}</h2>
          <div class="info">${cafeInfo.address}</div>
          <div class="info">📞 ${cafeInfo.mobile}</div>
          <div class="info">🕒 ${new Date(order.createdAt).toLocaleString()}</div>
          <div class="info">Order Type: ${order.orderType} ${order.table?.tableNumber ? `(Table #${order.table.tableNumber})` : ""}</div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((i, idx) => `
                <tr style="background-color: ${idx % 2 === 0 ? '#F5EFE6' : '#FAF3E0'}">
                  <td>${i.name}</td>
                  <td>${i.quantity}</td>
                  <td>₹${i.price * i.quantity}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="total">Total: ₹${order.totalAmount}</div>
        </body>
      </html>
    `);
    billWindow.document.close();
    billWindow.print();
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(API_ENDPOINTS.DELETE_ORDER(orderId), { withCredentials: true });
      toast.success("Order deleted successfully");
      setOrders(prev => prev.filter(o => o._id !== orderId));
      if (onSuccess) onSuccess();
    } catch {
      toast.error("Failed to delete order");
    }
  };

  const stats = {
    Total: orders.length,
    Pending: orders.filter(o => o.status === "Pending").length,
    Completed: orders.filter(o => o.status === "Completed").length,
    Revenue: orders.filter(o => o.paymentStatus === "Paid").reduce((sum, o) => sum + o.totalAmount, 0),
  };

  return (
    <div className="p-4 md:p-6 bg-white/70 backdrop-blur-xl border border-[#D2B48C]/50 rounded-2xl shadow-2xl">
      <h1 className="text-2xl md:text-3xl font-bold text-[#3F4F1D] mb-6 text-center">Order Reports</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white/80 rounded-2xl shadow-md p-4 text-center hover:shadow-lg transition">
            <div className="text-gray-500 text-sm md:text-base">{key}</div>
            <div className="text-xl md:text-2xl font-bold mt-1 text-[#3F4F1D]">{key === "Revenue" ? `₹${value}` : value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 items-start md:items-center">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-[#D2B48C]/50 px-3 py-2 rounded w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-[#D2B48C]/50 px-3 py-2 rounded w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
        />
        <button
          onClick={fetchReports}
          className="bg-green-400 text-white px-4 py-2 rounded-lg shadow hover:bg-green-500 transition text-sm md:text-base"
        >
          Apply
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-2xl shadow border border-[#D2B48C]/50">
        <table className="min-w-[800px] w-full text-sm divide-y divide-[#D2B48C]/30">
          <thead className="bg-[#FAF3E0]">
            <tr>
              <th className="p-2 text-left font-medium text-[#3F4F1D]">#</th>
              <th className="p-2 text-left font-medium text-[#3F4F1D]">Type</th>
              <th className="p-2 text-left font-medium text-[#3F4F1D]">Table</th>
              <th className="p-2 text-left font-medium text-[#3F4F1D]">Items</th>
              <th className="p-2 text-left font-medium text-[#3F4F1D]">Amount</th>
              <th className="p-2 text-left font-medium text-[#3F4F1D]">Status</th>
              <th className="p-2 text-left font-medium text-[#3F4F1D]">Payment</th>
              <th className="p-2 text-left font-medium text-[#3F4F1D]">Time</th>
              <th className="p-2 text-left font-medium text-[#3F4F1D]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-[#5C4033]">Loading...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-[#5C4033]">No orders found</td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order._id} className="hover:bg-[#FFF9F0]">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{order.orderType}</td>
                  <td className="p-2">{order.table?.tableNumber || "-"}</td>
                  <td className="p-2 max-w-[150px] truncate">{order.items.map(i => `${i.name} x${i.quantity}`).join(", ")}</td>
                  <td className="p-2 font-medium">₹{order.totalAmount}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${order.status==="Completed"?"bg-green-100 text-green-800":order.status==="Preparing"?"bg-orange-100 text-orange-800":"bg-blue-100 text-blue-800"}`}>{order.status}</span>
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${order.paymentStatus==="Paid"?"bg-green-200 text-green-900":"bg-red-200 text-red-900"}`}>{order.paymentStatus}</span>
                  </td>
                  <td className="p-2 text-[10px] md:text-sm">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="p-2 flex gap-1 flex-wrap">
                    <button onClick={() => printBill(order)} className="px-2 py-1 bg-green-400 text-white text-xs rounded hover:bg-green-500 transition">Print</button>
                    <button onClick={() => deleteOrder(order._id)} className="px-2 py-1 bg-red-400 text-white text-xs rounded hover:bg-red-500 transition">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
