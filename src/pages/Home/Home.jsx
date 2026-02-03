import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Menu from "../Product/Menu";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-lime-50 to-green-50 py-16 px-4">

      {/* Page Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center text-4xl sm:text-5xl font-extrabold text-green-900 tracking-wide drop-shadow-lg mb-10"
      >
        Cafe Aurora 🍽️☕
      </motion.h1>

      {/* Order Button */}
      <div className="flex justify-center mb-8">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/create-order")}
          className="px-6 py-3 rounded-2xl bg-green-700 text-white font-semibold shadow-lg hover:bg-green-800 transition"
        >
          🧾 Give Your Order
        </motion.button>
      </div>

      {/* MENU */}
      <div className="mt-12">
        <Menu />
      </div>

    </div>
  );
};

export default Home;
