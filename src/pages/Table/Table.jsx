import { useState } from "react";
import { motion } from "framer-motion";
import AddTable from "./AddTable";
import AllTables from "./AllTables";

const tabVariant = {
  active: { scale: 1.05 },
  inactive: { scale: 1 }
};

const Table = () => {
  const [activeTab, setActiveTab] = useState("add"); // add | list
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(prev => !prev);
    setActiveTab("list"); // After add, show list
  };

  return (
    <div className="p-6 bg-linear-to-br from-[#FAF3E0] via-[#E8DCC4] to-[#F5EFE6] min-h-screen rounded-2xl">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-[#5C4033] mb-6"
      >
        🪑 Manage Tables
      </motion.h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <motion.button
          onClick={() => setActiveTab("add")}
          variants={tabVariant}
          animate={activeTab === "add" ? "active" : "inactive"}
          className={`px-5 py-2 rounded-2xl text-sm md:text-base font-semibold transition-all
            ${
              activeTab === "add"
                ? "bg-[#FFF9E0] text-[#5C4033] shadow-md"
                : "bg-white/60 text-[#5C4033] backdrop-blur border border-[#D2B48C]/40 hover:bg-white/80"
            }`}
        >
          ➕ Add Table
        </motion.button>

        <motion.button
          onClick={() => setActiveTab("list")}
          variants={tabVariant}
          animate={activeTab === "list" ? "active" : "inactive"}
          className={`px-5 py-2 rounded-2xl text-sm md:text-base font-semibold transition-all
            ${
              activeTab === "list"
                ? "bg-[#FFF9E0] text-[#5C4033] shadow-md"
                : "bg-white/60 text-[#5C4033] backdrop-blur border border-[#D2B48C]/40 hover:bg-white/80"
            }`}
        >
          📋 All Tables
        </motion.button>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/70 backdrop-blur-xl border border-[#D2B48C]/50 rounded-2xl shadow-2xl p-6"
      >
        {activeTab === "add" && <AddTable onSuccess={handleRefresh} />}
        {activeTab === "list" && <AllTables refresh={refresh} onChange={handleRefresh} />}
      </motion.div>
    </div>
  );
};

export default Table;
