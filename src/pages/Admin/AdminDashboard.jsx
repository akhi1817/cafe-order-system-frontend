import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../config/api";
import { toast } from "sonner";
import { Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {useSelector} from 'react-redux';

// 🌟 Shimmer Component (Fixed tailwind dynamic class issues)
const Shimmer = ({ width = "w-full", height = "h-6", rounded = "rounded-xl", className = "" }) => (
  <div className={`relative ${width} ${height} ${rounded} bg-green-100 overflow-hidden ${className}`}>
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      className="absolute inset-0 w-1/2 bg-linear-to-r from-transparent via-green-300 to-transparent"
    />
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const userRole = useSelector(state => state.auth.user?.role);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(null);

  // Sidebar Items (memoized for no rerenders)
const allSidebarItems = useMemo(
  () => [
    { title: "Tables", route: "/admin-dashboard/tables", roles: ["admin", "manager"] },
    { title: "Categories", route: "/admin-dashboard/categories", roles: ["admin", "manager"] },
    { title: "Products", route: "/admin-dashboard/products", roles: ["admin", "manager"] },
    { title: "Orders", route: "/admin-dashboard/orders", roles: ["admin", "manager"] },
    { title: "Users", route: "/admin-dashboard/users", roles: ["admin", "manager"] },
    { title: "Create Orders", route: "/admin-dashboard/create-order", roles: ["admin", "manager", "staff"] },
  ],
  []
);
const sidebarItems = useMemo(
  () => allSidebarItems.filter(item => item.roles.includes(userRole)),
  [userRole, allSidebarItems]
);


  // Logout Handler
  const handleLogout = async () => {
    try {
      await axios.get(API_ENDPOINTS.LOGOUT_USER, { withCredentials: true });
      toast.success("Logged out successfully 👋");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  // Fetch Orders (Optimized)
const fetchOrders = useCallback(async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.GET_ALL_ORDERS, { withCredentials: true });
    const allOrders = res.data?.data || [];

    // Include orders that are Pending or Preparing, exclude Completed or Cancelled
    const pending = allOrders.filter(
      o => o.status !== "Completed" && o.status !== "Cancelled"
    );

    setPendingOrdersCount(pending.length);
  } catch (err) {
    console.error("Failed to fetch orders", err);
    setPendingOrdersCount(0);
  }
}, []);



  // Live updates every 5 seconds (fixed infinite re-render issue)
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-linear-to-r from-green-300 to-green-50 text-green-900 flex items-center px-4 py-3 z-50">
        <button onClick={() => setMobileOpen(true)} className="text-2xl">☰</button>
        <span className="ml-4 font-bold text-lg">Admin Panel</span>
      </div>

      <div className="mt-14 md:mt-0 flex">
        {/* Sidebar */}
        <aside
          className={`flex flex-col fixed md:static top-0 left-0 h-full z-50 w-48 md:w-64 transform transition-transform duration-300
            bg-linear-to-b from-green-300 to-green-50 text-green-900
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        >
          <div className="p-6 text-center font-bold text-xl border-b border-green-400">
            {pendingOrdersCount === null ? <Shimmer width="w-1/2" /> : "Admin Panel"}
          </div>

          <ul className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.title}>
                <button
                  onClick={() => { navigate(item.route); setMobileOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-green-100 hover:text-green-900 transition flex justify-between items-center font-semibold"
                >
                  {pendingOrdersCount === null ? (
                    <Shimmer width="w-2/3" height="h-5" />
                  ) : (
                    <span>{item.title}</span>
                  )}

                  {/* Pending Orders Badge */}
                  {item.title === "Orders" && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold 
                        ${pendingOrdersCount === null
                          ? "bg-green-100 text-green-300 animate-pulse"
                          : "bg-red-600 text-white"
                        }`}
                    >
                      {pendingOrdersCount === null ? "" : pendingOrdersCount}
                    </motion.span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="p-4 border-t border-green-400">
            <button
              onClick={handleLogout}
              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white font-medium"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Dark Overlay (Mobile Only) */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-8">
          {pendingOrdersCount === null ? (
            <Shimmer width="w-1/3" height="h-8" className="mb-4" />
          ) : (
            <h1 className="text-3xl font-bold text-green-800 mb-4">Welcome, Admin!</h1>
          )}

          <p className="text-green-700 mb-6">
            Select a module from the sidebar to manage data.
          </p>

          <div className="bg-green-50 shadow rounded-xl p-6 h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
