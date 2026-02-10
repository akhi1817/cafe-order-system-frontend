import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../../config/api";
import { toast } from "sonner";
import { motion } from "framer-motion";

// 🌿 GREEN + LEMON SHIMMER EFFECT
const Shimmer = () => {
  return (
    <div className="relative w-full h-10 rounded-lg bg-green-200 overflow-hidden">
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="absolute inset-0 w-1/2 bg-linear-to-r from-transparent via-green-300 to-transparent"
      />
    </div>
  );
};

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Form submit function
const handleSendOtp = async (e) => {
  e.preventDefault(); // prevent page reload
  setLoading(true);

  try {
    const res = await axios.post(
  "https://cafe-order-system-backend.vercel.app/api/auth/register/send-otp",      formData
    );

    toast.success(res.data.message); // Success
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.message || "Failed to send OTP. Try again!"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-100 via-green-200 to-yellow-100 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="backdrop-blur-xl bg-white/60 shadow-xl border border-white/20 p-8 rounded-3xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Create Your Account</h2>

        <form onSubmit={handleSendOtp} className="space-y-5 flex flex-col items-center">
          {loading ? <Shimmer /> : <input type="text" name="username" placeholder="Enter Username" value={formData.username} onChange={handleChange} required className="w-full h-12 border border-green-300 bg-white/70 rounded-xl px-4 focus:ring-2 focus:ring-green-400 outline-none" />}
          {loading ? <Shimmer /> : <input type="email" name="email" placeholder="Enter Email" value={formData.email} onChange={handleChange} required className="w-full h-12 border border-green-300 bg-white/70 rounded-xl px-4 focus:ring-2 focus:ring-green-400 outline-none" />}
          {loading ? <Shimmer /> : <input type="password" name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} required className="w-full h-12 border border-green-300 bg-white/70 rounded-xl px-4 focus:ring-2 focus:ring-green-400 outline-none" />}

          <motion.button whileHover={{ scale: loading ? 1 : 1.03 }} whileTap={{ scale: loading ? 1 : 0.97 }} type="submit" disabled={loading} className={`w-1/2 h-12 text-white rounded-xl font-semibold shadow-md transition-all bg-linear-to-r from-green-600 to-yellow-500 ${loading && "opacity-50 cursor-not-allowed"}`}>{loading ? "Sending OTP..." : "Send OTP"}</motion.button>
        </form>

        <p className="text-sm text-center text-gray-700 mt-5">Already have an account? <span onClick={() => navigate("/login")} className="text-green-700 font-medium hover:underline cursor-pointer">Login here</span></p>
      </motion.div>
    </div>
  );
};

export default Register;