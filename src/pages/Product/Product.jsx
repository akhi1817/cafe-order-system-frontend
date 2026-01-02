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
    setRefresh((prev) => !prev);
  };

  return (
    <div className="p-4 md:p-6 bg-[#F5F7F0] min-h-screen rounded-2xl">
      <h2 className="text-2xl md:text-3xl font-bold text-[#3F4F1D] mb-6">
        🍽 Manage Menu Items
      </h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <motion.button
          onClick={() => setActiveTab("add")}
          variants={tabVariant}
          animate={activeTab === "add" ? "active" : "inactive"}
          className={`px-5 py-2 rounded-2xl text-sm md:text-base font-semibold
            transition-all
            ${
              activeTab === "add"
                ? "bg-[#FFF9F0] text-[#3F4F1D] shadow-md"
                : "bg-white/60 text-[#3F4F1D] backdrop-blur border border-white/30 hover:bg-white/80"
            }`}
        >
          ➕ Add Menu-Item
        </motion.button>

        <motion.button
          onClick={() => setActiveTab("list")}
          variants={tabVariant}
          animate={activeTab === "list" ? "active" : "inactive"}
          className={`px-5 py-2 rounded-2xl text-sm md:text-base font-semibold
            transition-all
            ${
              activeTab === "list"
                ? "bg-[#FFF9F0] text-[#3F4F1D] shadow-md"
                : "bg-white/60 text-[#3F4F1D] backdrop-blur border border-white/30 hover:bg-white/80"
            }`}
        >
          📦 All Menu-Items
        </motion.button>
      </div>

      {/* Content */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg p-4 md:p-6">
        {activeTab === "add" && <AddProduct onSuccess={handleRefresh} />}
        {activeTab === "list" && (
          <AllProducts refresh={refresh} onChange={handleRefresh} />
        )}
      </div>
    </div>
  );
};

export default Product;
