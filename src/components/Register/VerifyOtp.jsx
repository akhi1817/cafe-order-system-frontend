import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Shimmer = () => (
  <div className="relative w-full h-10 rounded-lg bg-green-200 overflow-hidden">
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      className="absolute inset-0 w-1/2 bg-linear-to-r from-transparent via-green-300 to-transparent"
    />
  </div>
);

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state; // from sendOtp step

  if (!userData) {
    return (
      <div className="flex h-screen items-center justify-center bg-green-50">
        <p className="text-red-500 text-lg font-medium">Invalid access. Please register again.</p>
      </div>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://cafe-order-system-backend.vercel.app/api/auth/register/verify-otp",
        { ...userData, otp }
      );
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-green-100 via-green-200 to-yellow-100 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="backdrop-blur-xl bg-white/60 shadow-xl border border-white/20 p-8 rounded-3xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Verify Your OTP</h2>

        <form onSubmit={handleVerify} className="space-y-5 flex flex-col items-center">
          {loading ? <Shimmer /> : <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full border border-green-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-center tracking-widest text-lg bg-white/70" />}

          <motion.button whileHover={{ scale: loading ? 1 : 1.03 }} whileTap={{ scale: loading ? 1 : 0.97 }} type="submit" disabled={loading} className={`w-1/2 h-12 text-white rounded-xl font-semibold shadow-md transition-all bg-linear-to-r from-green-600 to-yellow-500 ${loading && "opacity-50 cursor-not-allowed"}`}>{loading ? "Verifying..." : "Verify & Register"}</motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
