import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Menu from "../Product/Menu";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FFF5E1] to-[#FDEBD0] py-16 px-4">

      {/* Page Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center text-4xl sm:text-5xl font-extrabold text-[#6F4E37] tracking-wide drop-shadow-lg mb-10"
      >
        Cafe Aurora ☕🍪
      </motion.h1>

      {/* Order Buttons
      <div className="flex flex-wrap justify-center gap-4 mt-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/create-order")}
          className="px-6 py-3 rounded-2xl bg-[#D9A066] text-[#FFF5E1] font-semibold shadow-lg hover:bg-[#C6944B] transition"
        >
          🧾 Give Your Order
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/user-order")}
          className="px-6 py-3 rounded-2xl bg-[#D9A066] text-[#FFF5E1] font-semibold shadow-lg hover:bg-[#C6944B] transition"
        >
          🧾 See Your Order
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="px-6 py-3 rounded-2xl bg-[#6F4E37] text-[#FFF5E1] font-semibold shadow-lg hover:bg-[#5A3E2D] transition"
        >
          Admin Login
        </motion.button>
      </div> */}

      {/* MENU */}
      <div className="mt-12">
        <Menu />
      </div>

    </div>
  );
};

export default Home;
