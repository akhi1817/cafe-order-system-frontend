import { useState } from "react";
import { motion } from "framer-motion";
import AddProduct from "./AddProduct";
import AllProducts from "./AllProducts";

const tabVariant = {
  active: { scale: 1.05 },
  inactive: { scale: 1 }
};

const Product = () => {
  const [activeTab, setActiveTab] = useState("add"); // add | list
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(prev => !prev);
    setActiveTab("list"); // auto-switch to list after add
  };

  return (
    <div className="p-6 bg-linear-to-br from-green-100 via-yellow-50 to-yellow-100 min-h-screen rounded-2xl">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-green-800 mb-6"
      >
        🍽 Menu Management
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
                ? "bg-yellow-200 text-green-800 shadow-md"
                : "bg-white/60 text-green-800 backdrop-blur border border-green-200 hover:bg-white/80"
            }`}
        >
          ➕ Add Menu Item
        </motion.button>

        <motion.button
          onClick={() => setActiveTab("list")}
          variants={tabVariant}
          animate={activeTab === "list" ? "active" : "inactive"}
          className={`px-5 py-2 rounded-2xl text-sm md:text-base font-semibold transition-all
            ${
              activeTab === "list"
                ? "bg-yellow-200 text-green-800 shadow-md"
                : "bg-white/60 text-green-800 backdrop-blur border border-green-200 hover:bg-white/80"
            }`}
        >
          📦 All Menu Items
        </motion.button>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/70 backdrop-blur-xl border border-green-200 rounded-2xl shadow-2xl p-6"
      >
        {activeTab === "add" && <AddProduct onSuccess={handleRefresh} />}
        {activeTab === "list" && (
          <AllProducts refresh={refresh} onChange={handleRefresh} />
        )}
      </motion.div>
    </div>
  );
};

export default Product;
