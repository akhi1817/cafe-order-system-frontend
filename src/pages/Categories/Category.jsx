import { useState } from "react";
import { motion } from "framer-motion";
import AddCategory from "./AddCategory";
import AllCategories from "./AllCategories";

const tabVariant = {
  active: { scale: 1.05 },
  inactive: { scale: 1 }
};

const Category = () => {
  const [activeTab, setActiveTab] = useState("add"); // add | list
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
    setActiveTab("list"); // Add ke baad list dikhao
  };

  return (
    <div className="p-6 bg-linear-to-br from-[#FFF5E1] via-[#D9A066] to-[#FFF5E1] min-h-screen rounded-2xl">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-[#6F4E37] mb-6"
      >
        🗂 Category Management
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
                ? "bg-[#D9A066] text-[#FFF5E1] shadow-md"
                : "bg-[#FFF5E1]/60 text-[#6F4E37] backdrop-blur border border-[#6F4E37] hover:bg-[#FFF3E0]"
            }`}
        >
          ➕ Add Category
        </motion.button>

        <motion.button
          onClick={() => setActiveTab("list")}
          variants={tabVariant}
          animate={activeTab === "list" ? "active" : "inactive"}
          className={`px-5 py-2 rounded-2xl text-sm md:text-base font-semibold transition-all
            ${
              activeTab === "list"
                ? "bg-[#D9A066] text-[#FFF5E1] shadow-md"
                : "bg-[#FFF5E1]/60 text-[#6F4E37] backdrop-blur border border-[#6F4E37] hover:bg-[#FFF3E0]"
            }`}
        >
          📦 All Categories
        </motion.button>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#FFF5E1]/70 backdrop-blur-xl border border-[#D9A066] rounded-2xl shadow-2xl p-6"
      >
        {activeTab === "add" && <AddCategory onSuccess={handleRefresh} />}
        {activeTab === "list" && (
          <AllCategories refresh={refresh} onChange={handleRefresh} />
        )}
      </motion.div>
    </div>
  );
};

export default Category;
