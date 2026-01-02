import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../config/api";
import { toast } from "sonner";
import { Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [lastOrderIds, setLastOrderIds] = useState([]);

  // 👇 Logout handler
  const handleLogout = async () => {
    try {
      await axios.get(API_ENDPOINTS.LOGOUT_USER, { withCredentials: true });
      toast.success("Logged out successfully 👋");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  // 👇 Sidebar menu items
  const sidebarItems = [
    { title: "Tables", route: "/admin-dashboard/tables" },
    { title: "Orders", route: "/admin-dashboard/orders" },
    { title: "Categories", route: "/admin-dashboard/categories" },
    { title: "Products", route: "/admin-dashboard/products" },
  ];

  /* ===============================
     LIVE ORDER POLLING & TOAST
  =============================== */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.GET_ALL_ORDERS, { withCredentials: true });
        const allOrders = res.data?.data || [];

        // 👇 Count pending orders (not completed OR not paid)
        const pendingOrders = allOrders.filter(
          o => o.status !== "Completed" || o.paymentStatus !== "Paid"
        );
        setPendingOrdersCount(pendingOrders.length);

        // 👇 Detect new orders
        const currentOrderIds = allOrders.map(o => o._id);
        const newOrders = currentOrderIds.filter(id => !lastOrderIds.includes(id));

        // if (newOrders.length > 0) {
        //   toast.success(`📢 ${newOrders.length} new order(s) received!`);
        // }

        setLastOrderIds(currentOrderIds);
      } catch (err) {
        console.error("Failed to fetch orders for live update", err);
      }
    };

    // Initial fetch
    fetchOrders();

    // Poll every 5 seconds
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, [lastOrderIds]);

  return (
    <>
      {/* 📱 Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-800 text-white flex items-center px-4 py-3 z-50">
        <button onClick={() => setMobileOpen(true)} className="text-2xl">☰</button>
        <span className="ml-4 font-bold">Admin Panel</span>
      </div>

      <div className="mt-14 md:mt-0 flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div
          className={`
            bg-gray-800 text-white flex flex-col
            fixed md:static top-0 left-0 h-full z-50
            w-48 md:w-64
            transform transition-transform duration-300
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          <div className="p-4 md:p-6 text-center font-bold text-lg md:text-xl border-b border-gray-700">
           Admin Panel
          </div>

          <ul className="flex-1 p-3 md:p-4 space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.title}>
                <button
                  onClick={() => {
                    navigate(item.route);
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition text-sm md:text-base flex justify-between items-center"
                >
                  <span>{item.title}</span>
                  {/* Pending Orders Badge */}
                  {item.title === "Orders" && pendingOrdersCount > 0 && (
  <motion.span
    animate={{ scale: [1, 1.2, 1] }}
    transition={{ duration: 1, repeat: Infinity }}
    className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full"
  >
    {pendingOrdersCount}
  </motion.span>
)}

                </button>
              </li>
            ))}
          </ul>

          <div className="p-3 md:p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 py-2 rounded transition font-medium text-sm md:text-base"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome, Admin!</h1>
          <p className="text-gray-600 mb-6">
            Select a module from the sidebar to manage data.
          </p>

          <div className="bg-white shadow rounded-xl p-6 h-full">
            <p className="text-gray-400">
              Here the selected module will render (Tables, Orders, Categories, etc.)
            </p>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
