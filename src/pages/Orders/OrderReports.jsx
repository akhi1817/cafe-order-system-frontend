import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import API_ENDPOINTS from "../../config/api";

// Chart.js imports
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function OrderReports({ refresh }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const cafeInfo = {
    name: "Café Aurora",
    address: "Pimpri",
    mobile: "9876543210",
  };

  // Fetch orders
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.GET_ORDER_REPORTS, {
        params: { fromDate, toDate },
        withCredentials: true,
      });
      setOrders(res.data.data || []);
      setCurrentPage(1);
    } catch {
      toast.error("Failed to load order reports");
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports, refresh]);


  // Generate Bill No from order date
const orderDate = new Date(); // ya new Date() agar current time chahiye
const day = String(orderDate.getDate()).padStart(2, "0");
const month = String(orderDate.getMonth() + 1).padStart(2, "0"); // month 0 se start hota hai
const year = String(orderDate.getFullYear()).slice(-2); // last 2 digits
const billNo = `AC-${day}${month}${year}`; // 130228

const printBill = (order) => {
  const billWindow = window.open("", "_blank", "width=400,height=800");

  const orderDate = new Date(order.createdAt);
  const day = String(orderDate.getDate()).padStart(2, "0");
  const month = String(orderDate.getMonth() + 1).padStart(2, "0");
  const year = String(orderDate.getFullYear()).slice(-2);
  const billNo = `${day}${month}${year}`; // e.g., 130228

  const itemsPerPage = 25; // adjust based on printer size
  const pages = Math.ceil(order.items.length / itemsPerPage);

  let content = "";

  for (let p = 0; p < pages; p++) {
    const start = p * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = order.items.slice(start, end);

    content += `
      <div style="page-break-after: ${p < pages - 1 ? 'always' : 'auto'};">
        <div class="center bold" style="font-size:16px;">${cafeInfo.name}</div>
        <div class="center">${cafeInfo.address}</div>
        <div class="center">Tel: ${cafeInfo.mobile}</div>
        <div class="line"></div>

        <div class="center bold">TAX INVOICE</div>

        <div style="margin-top:5px; font-family: monospace; font-size:14px;">
          <div class="flex">
            <div>Date: ${orderDate.toLocaleDateString()}</div>
            <div>Time: ${orderDate.toLocaleTimeString()}</div>
          </div>
          <div style="margin-top:5px;">Bill No: <strong>${billNo}</strong></div>
        </div>

        <div class="line"></div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th align="center">Qty</th>
              <th align="right">Rate</th>
              <th class="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${pageItems.map(i => `
              <tr>
                <td>${i.name}</td>
                <td align="center">${i.quantity}</td>
                <td align="right">₹${i.price}</td>
                <td align="right">₹${i.price * i.quantity}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        ${p === pages - 1 ? `
          <div class="line"></div>
          <div class="total-section">
            <div>Items: ${order.items.length}</div>
            <div class="right">SUB TOTAL : ₹${order.totalAmount}</div>
            <div class="right bold">TOTAL : ₹${order.totalAmount}</div>
          </div>

          <div class="line"></div>
          <div class="center bold" style="font-size:14px;">
            Cash : ₹${order.totalAmount}
          </div>

          <div class="line"></div>

          <div style="font-size:11px;">
            GST No : ${cafeInfo.gst || ""}
            <br/><br/>
            We declare that this invoice shows the actual price
            of the food items described and that all particulars are
            true and correct.
          </div>

          <div class="line"></div>

          <div class="center" style="font-size:11px;">
            Items once sold will not be taken back.
            <br/>
            Visit Again !!!
          </div>
        ` : ''}
      </div>
    `;
  }

  billWindow.document.write(`
    <html>
      <head>
        <title>Bill - ${billNo}</title>
        <style>
          body { font-family: monospace; width: 280px; margin: auto; font-size: 13px; }
          .center { text-align: center; }
          .line { border-top: 1px dashed #000; margin: 6px 0; }
          table { width: 100%; font-size: 13px; border-collapse: collapse; }
          th, td { padding: 2px 0; }
          th { text-align: left; }
          .right { text-align: right; }
          .bold { font-weight: bold; }
          .total-section { margin-top: 5px; }
          .flex { display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);

  billWindow.document.close();
  billWindow.print();
};




  // Pagination
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const currentOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goNext = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
  const goPrev = () => currentPage > 1 && setCurrentPage(prev => prev - 1);

  // Stats
  const stats = {
    Total: orders.length,
    Pending: orders.filter(o => o.status === "Pending").length,
    Completed: orders.filter(o => o.status === "Completed").length,
    Revenue: orders.filter(o => o.paymentStatus === "Paid").reduce((sum, o) => sum + o.totalAmount, 0),
  };

  // -----------------------
  // Chart Data Computation
  // -----------------------
  const productSales = {};
  const dailySales = {};
  const monthlySales = {};

  orders.forEach(order => {
    const date = new Date(order.createdAt);
    const day = date.toLocaleDateString();
    const month = date.toLocaleString("default", { month: "short", year: "numeric" });

    // Daily
    if (!dailySales[day]) dailySales[day] = 0;
    dailySales[day] += order.totalAmount;

    // Monthly
    if (!monthlySales[month]) monthlySales[month] = 0;
    monthlySales[month] += order.totalAmount;

    // Product-wise
    order.items.forEach(item => {
      if (!productSales[item.name]) productSales[item.name] = 0;
      productSales[item.name] += item.quantity;
    });
  });

  const productLabels = Object.keys(productSales);
  const productData = Object.values(productSales);

  const dailyLabels = Object.keys(dailySales);
  const dailyData = Object.values(dailySales);

  const monthLabels = Object.keys(monthlySales);
  const monthData = Object.values(monthlySales);

  // -----------------------
  // JSX
  // -----------------------
  return (
    <div className="p-4 md:p-6 bg-green-50/70 backdrop-blur-xl border border-green-200 rounded-2xl shadow-2xl">
      <h1 className="text-2xl md:text-3xl font-bold text-green-900 mb-6 text-center">Order Reports</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-green-100/80 rounded-2xl shadow-md p-4 text-center hover:shadow-lg transition">
            <div className="text-green-800 text-sm md:text-base">{key}</div>
            <div className="text-xl md:text-2xl font-bold mt-1 text-green-900">{key === "Revenue" ? `₹${value}` : value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Product-wise */}
        {/* <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-green-900 font-semibold mb-2 text-center">Product-wise Sales</h3>
          <Bar
            data={{ labels: productLabels, datasets: [{ label: "Units Sold", data: productData, backgroundColor: "#E53935" }] }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div> */}

        {/* Daily Sales */}
        {/* <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-green-900 font-semibold mb-2 text-center">Daily Sales</h3>
          <Line
            data={{
              labels: dailyLabels,
              datasets: [{ label: "Revenue", data: dailyData, borderColor: "#E53935", backgroundColor: "rgba(229,57,53,0.2)", fill: true, tension: 0.3 }],
            }}
            options={{ responsive: true }}
          />
        </div> */}
{/* 
        Monthly Sales */}
        {/* <div className="bg-white p-4 rounded-xl shadow md:col-span-2">
          <h3 className="text-green-900 font-semibold mb-2 text-center">Monthly Sales</h3>
          <Line
            data={{
              labels: monthLabels,
              datasets: [{ label: "Revenue", data: monthData, borderColor: "#E53935", backgroundColor: "rgba(229,57,53,0.2)", fill: true, tension: 0.3 }],
            }}
            options={{ responsive: true }}
          />
        </div> */}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-2xl shadow border border-green-200">
        <table className="min-w-[800px] w-full text-sm divide-y divide-green-200/30">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 text-left font-medium text-green-900">#</th>
              <th className="p-2 text-left font-medium text-green-900">Type</th>
              <th className="p-2 text-left font-medium text-green-900">Items</th>
              <th className="p-2 text-left font-medium text-green-900">Amount</th>
              <th className="p-2 text-left font-medium text-green-900">Status</th>
              <th className="p-2 text-left font-medium text-green-900">Payment</th>
              <th className="p-2 text-left font-medium text-green-900">Date & Time</th>
              <th className="p-2 text-left font-medium text-green-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-green-800">Loading...</td>
              </tr>
            ) : currentOrders.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-green-800">No orders found</td>
              </tr>
            ) : (
              currentOrders.map((order, index) => (
                <tr key={order._id} className="hover:bg-green-50">
                  <td className="p-2">{(currentPage-1)*itemsPerPage + index + 1}</td>
                  <td className="p-2">{order.orderType}</td>
                  <td className="p-2 max-w-[150px] truncate">{order.items.map(i => `${i.name} x${i.quantity}`).join(", ")}</td>
                  <td className="p-2 font-medium">₹{order.totalAmount}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${order.status==="Completed"?"bg-green-200 text-green-900":order.status==="Preparing"?"bg-green-200 text-green-900":"bg-green-100 text-green-800"}`}>{order.status}</span>
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${order.paymentStatus==="Paid"?"bg-green-200 text-green-900":"bg-red-200 text-red-900"}`}>{order.paymentStatus}</span>
                  </td>
                  <td className="p-2 text-[10px] md:text-sm">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="p-2 flex gap-1 flex-wrap">
                    <button onClick={() => printBill(order)} className="px-2 py-1 bg-green-400 text-white text-xs rounded hover:bg-green-500 transition">Print</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button onClick={goPrev} disabled={currentPage===1} className="px-3 py-1 rounded bg-green-200 text-green-900 disabled:opacity-50">Prev</button>
          <span className="px-3 py-1 rounded bg-green-100 text-green-900">{currentPage} / {totalPages}</span>
          <button onClick={goNext} disabled={currentPage===totalPages} className="px-3 py-1 rounded bg-green-200 text-green-900 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
