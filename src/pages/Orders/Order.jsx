import { useState } from "react";
import { motion } from "framer-motion";
import AllOrders from "./AllOrders";
import OrderReports from "./OrderReports";

const tabVariant = {
  active: { scale: 1.05 },
  inactive: { scale: 1 },
};

const Order = () => {
  const [activeTab, setActiveTab] = useState("list"); // report | list
  const [refresh, setRefresh] = useState(false);

  // Refresh AllOrders only
  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div className="p-6 bg-linear-to-br from-[#FFF5E1] via-[#FDEBD0] to-[#FCE8C5] min-h-screen rounded-2xl">
      <h2 className="text-2xl md:text-3xl font-bold text-[#6F4E37] mb-6 text-center md:text-left">
        📝 Orders Management
      </h2>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center sm:justify-start">
        <motion.button
          onClick={() => setActiveTab("add")}
          variants={tabVariant}
          animate={activeTab === "add" ? "active" : "inactive"}
          className={`px-5 py-2 rounded-2xl text-sm md:text-base font-semibold transition-all text-center
            ${
              activeTab === "add"
                ? "bg-[#D9A066] text-[#FFF5E1] shadow-md"
                : "bg-white/60 text-[#6F4E37] backdrop-blur border border-[#D9A066] hover:bg-white/80"
            }`}
        >
          📊 Order Reports
        </motion.button>

        <motion.button
          onClick={() => setActiveTab("list")}
          variants={tabVariant}
          animate={activeTab === "list" ? "active" : "inactive"}
          className={`px-5 py-2 rounded-2xl text-sm md:text-base font-semibold transition-all text-center
            ${
              activeTab === "list"
                ? "bg-[#D9A066] text-[#FFF5E1] shadow-md"
                : "bg-white/60 text-[#6F4E37] backdrop-blur border border-[#D9A066] hover:bg-white/80"
            }`}
        >
          📋 All Orders
        </motion.button>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/70 backdrop-blur-xl border border-[#D9A066]/50 rounded-2xl shadow-2xl p-4 md:p-6 w-full overflow-visible"
      >
        {activeTab === "add" && <OrderReports onSuccess={handleRefresh} />}
        {activeTab === "list" && <AllOrders refresh={refresh} />}
      </motion.div>
    </div>
  );
};

export default Order;
