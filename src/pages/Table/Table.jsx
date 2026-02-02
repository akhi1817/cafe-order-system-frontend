import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import AddTable from "./AddTable";
import AllTables from "./AllTables";

const tabVariant = {
  active: { scale: 1.05 },
  inactive: { scale: 1 },
};

const Table = () => {
  const [activeTab, setActiveTab] = useState("add"); // add | list
  const [refresh, setRefresh] = useState(false);

  // Memoized callback to prevent unnecessary re-renders
  const handleRefresh = useCallback(() => {
    setRefresh((prev) => !prev);
    setActiveTab("list"); // After add, show list
  }, []);

  return (
    <div className="p-6 bg-linear-to-br from-green-50 via-green-100 to-yellow-50 min-h-screen rounded-2xl">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-green-800 mb-6"
      >
        🪑 Manage Tables
      </motion.h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["add", "list"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            variants={tabVariant}
            animate={activeTab === tab ? "active" : "inactive"}
            className={`px-5 py-2 rounded-2xl text-sm md:text-base font-semibold transition-all
              ${
                activeTab === tab
                  ? "bg-green-100 text-green-900 shadow-md"
                  : "bg-white/60 text-green-900 backdrop-blur border border-green-200 hover:bg-white/80"
              }`}
          >
            {tab === "add" ? "➕ Add Table" : "📋 All Tables"}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/70 backdrop-blur-xl border border-green-200 rounded-2xl shadow-2xl p-6"
      >
        {activeTab === "add" && <AddTable onSuccess={handleRefresh} />}
        {activeTab === "list" && (
          <AllTables refresh={refresh} onChange={handleRefresh} />
        )}
      </motion.div>
    </div>
  );
};

export default Table;
