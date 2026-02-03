import React from "react";
import { motion } from "framer-motion";
import CreateOrder from "../Orders/CreateOrder";

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-lime-50 to-green-50 flex items-center justify-center py-16 px-4">

      {/* Page Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute top-8 text-4xl sm:text-5xl font-extrabold text-green-900 tracking-wide drop-shadow-lg"
      >
        Cafe Aurora 🍽️☕  
      </motion.h1>

      {/* Animated Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl relative mt-16"
      >
        {/* Shimmer Background */}
        <div className="absolute inset-0 rounded-3xl bg-white/60 backdrop-blur-xl shadow-xl overflow-hidden">
          <div className="animate-pulse w-full h-full bg-linear-to-r from-lime-100/20 via-green-100/20 to-lime-100/20 opacity-60" />
        </div>

        {/* Actual Form */}
        <div className="relative p-6 sm:p-10">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-semibold text-green-800 mb-4 text-center"
          >
             🧾 GIVE YOUR ORDER HERE...
          </motion.h1>

          <CreateOrder />
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
