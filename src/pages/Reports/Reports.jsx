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

export default function Reports({ refresh }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const cafeInfo = { name: "Café Aurora", address: "Pimpri", mobile: "9876543210" };

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

  const printBill = (order) => {
    const billWindow = window.open("", "_blank", "width=600,height=800");
    billWindow.document.write(`<html>...</html>`); // Bill template
    billWindow.document.close();
    billWindow.print();
  };

  // Pagination
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const currentOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goNext = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
  const goPrev = () => currentPage > 1 && setCurrentPage(prev => prev - 1);

  // -----------------------
  // Stats & KPIs
  // -----------------------
  const totalRevenue = orders.filter(o => o.paymentStatus === "Paid").reduce((sum, o) => sum + o.totalAmount, 0);
  const stats = {
    TotalOrders: orders.length,
    Completed: orders.filter(o => o.status === "Completed").length,
    Revenue: totalRevenue,
    AvgOrderValue: orders.length ? (totalRevenue / orders.length).toFixed(2) : 0,
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

    // Daily revenue
    if (!dailySales[day]) dailySales[day] = 0;
    dailySales[day] += order.totalAmount;

    // Monthly revenue
    if (!monthlySales[month]) monthlySales[month] = 0;
    monthlySales[month] += order.totalAmount;

    // Product-wise sales
    order.items.forEach(item => {
      const name = item.name.trim();
      if (!productSales[name]) productSales[name] = 0;
      productSales[name] += item.quantity;
    });
  });

  // Sort products descending
  const sortedProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]);
  const productLabels = sortedProducts.map(p => p[0]);
  const productData = sortedProducts.map(p => p[1]);

  const dailyLabels = Object.keys(dailySales);
  const dailyData = Object.values(dailySales);
  const monthLabels = Object.keys(monthlySales);
  const monthData = Object.values(monthlySales);


  
  // -----------------------
  // JSX
  // -----------------------
  return (
  <div className="p-6 md:p-8 bg-green-50/60 backdrop-blur-xl border border-green-200 rounded-3xl shadow-2xl">
  <h1 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-8 text-center tracking-wide">
    ☕ Café Aurora Dashboard
  </h1>

  {/* KPIs */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
    {Object.entries(stats).map(([key, value]) => {
      const icons = {
        TotalOrders: "🛒",
        Completed: "✅",
        Revenue: "💰",
        AvgOrderValue: "📦",
      };
      return (
        <div
          key={key}
          className="bg-linear-to-br from-green-100/70 to-green-200/50 rounded-3xl shadow-lg p-5 text-center hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          <div className="text-green-800 text-sm md:text-base flex justify-center items-center gap-2">
            <span>{icons[key] || "📊"}</span>
            {key.replace(/([A-Z])/g, " $1")}
          </div>
          <div className="text-2xl md:text-3xl font-bold mt-2 text-green-900 animate-pulse">
            {key === "Revenue" || key === "AvgOrderValue" ? `₹${value}` : value}
          </div>
        </div>
      );
    })}
  </div>

  {/* Top 5 Products */}
  <h3 className="text-green-900 font-semibold mb-3 text-lg md:text-xl tracking-wide">
    🔝 Top 5 Products
  </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
    {sortedProducts.slice(0, 5).map(([name, qty], idx) => (
      <div
        key={name}
        className="bg-white/90 p-4 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center"
      >
        <div className="font-semibold text-green-900 mb-1">{name}</div>
        <div className="w-full bg-green-100 rounded-full h-2 mb-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${(qty / sortedProducts[0][1]) * 100}%`,
            }}
          />
        </div>
        <div className="text-green-800 text-sm">Sold: {qty}</div>
      </div>
    ))}
  </div>

  {/* Charts */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    {/* Product-wise Bar Chart */}
    <div className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <h3 className="text-green-900 font-semibold mb-3 text-center text-lg md:text-xl tracking-wide">
        Product-wise Sales
      </h3>
      <Bar
        data={{
          labels: productLabels,
          datasets: [
            {
              label: "Units Sold",
              data: productData,
              backgroundColor: "rgba(67,160,71,0.8)",
              borderRadius: 5,
            },
          ],
        }}
        options={{
          indexAxis: "y",
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const total = productData.reduce((a, b) => a + b, 0);
                  const percent = ((context.parsed.x / total) * 100).toFixed(1);
                  return `${context.parsed.x} units (${percent}%)`;
                },
              },
            },
          },
          scales: { x: { beginAtZero: true } },
        }}
      />
    </div>

    {/* Daily Revenue */}
    <div className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <h3 className="text-green-900 font-semibold mb-3 text-center text-lg md:text-xl tracking-wide">
        Daily Revenue (Last 7 Days)
      </h3>
      {dailyLabels.length > 0 ? (
        <Line
          data={{
            labels: dailyLabels
              .map((date, idx) => ({ date, value: dailyData[idx] }))
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(-7)
              .map((d) => d.date),
            datasets: [
              {
                label: "Revenue",
                data: dailyLabels
                  .map((date, idx) => ({ date, value: dailyData[idx] }))
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(-7)
                  .map((d) => d.value),
                borderColor: "#43A047",
                backgroundColor: "rgba(67,160,71,0.2)",
                fill: true,
                tension: 0.3,
                pointHoverRadius: 6,
                pointRadius: 4,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => `₹${context.parsed.y}`,
                },
              },
            },
            scales: {
              y: { beginAtZero: true },
              x: { ticks: { autoSkip: false } },
            },
          }}
        />
      ) : (
        <p className="text-center text-green-800">No sales data</p>
      )}
    </div>

    {/* Monthly Revenue */}
    <div className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 md:col-span-2">
      <h3 className="text-green-900 font-semibold mb-3 text-center text-lg md:text-xl tracking-wide">
        Monthly Revenue (Last 6 Months)
      </h3>
      {monthLabels.length > 0 ? (
        <Line
          data={{
            labels: monthLabels
              .map((month, idx) => ({ month, value: monthData[idx] }))
              .sort((a, b) => new Date(a.month) - new Date(b.month))
              .slice(-6)
              .map((d) => d.month),
            datasets: [
              {
                label: "Revenue",
                data: monthLabels
                  .map((month, idx) => ({ month, value: monthData[idx] }))
                  .sort((a, b) => new Date(a.month) - new Date(b.month))
                  .slice(-6)
                  .map((d) => d.value),
                borderColor: "#43A047",
                backgroundColor: "rgba(67,160,71,0.2)",
                fill: true,
                tension: 0.3,
                pointHoverRadius: 6,
                pointRadius: 4,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => `₹${context.parsed.y}`,
                },
              },
            },
            scales: {
              y: { beginAtZero: true },
              x: { ticks: { autoSkip: false } },
            },
          }}
        />
      ) : (
        <p className="text-center text-green-800">No sales data</p>
      )}
    </div>
  </div>
</div>

  );
}
