import React, { useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../config/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

// 🌿 GREEN + LEMON SHIMMER EFFECT
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

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send `identifier` instead of `email`
      const res = await axios.post(
        API_ENDPOINTS.LOGIN_USER,
        { identifier, password },
        { withCredentials: true }
      );

      const user = res.data.user;
      if (!user) {
        toast.error("User data not found");
        return;
      }

      dispatch(loginSuccess(user));
Cookies.set("token", res.data.token, { expires: 1 });
      toast.success(res.data.message);

      // Navigate based on role
      if (user.role === "admin") navigate("/admin-dashboard");
      else if (user.role === "manager") navigate("/admin-dashboard");
      else if (user.role === "staff") navigate("/admin-dashboard");
      else navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-100 via-green-200 to-yellow-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-xl bg-white/60 shadow-xl border border-white/20 p-8 rounded-3xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Welcome Back
        </h2>

        <form
          onSubmit={handleLogin}
          className="space-y-5 flex flex-col items-center"
        >
          {loading ? (
            <Shimmer />
          ) : (
            <input
              type="text"
              placeholder="Username or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full h-12 border border-green-300 bg-white/70 rounded-xl px-4 focus:ring-2 focus:ring-green-400 outline-none"
            />
          )}
          {loading ? (
            <Shimmer />
          ) : (
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 border border-green-300 bg-white/70 rounded-xl px-4 focus:ring-2 focus:ring-green-400 outline-none"
            />
          )}

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            type="submit"
            disabled={loading}
            className={`w-1/2 h-12 text-white rounded-xl font-semibold shadow-md transition-all bg-linear-to-r from-green-600 to-yellow-500 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
