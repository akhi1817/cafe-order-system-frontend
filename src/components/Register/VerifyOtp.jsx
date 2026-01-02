import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API_ENDPOINTS from "../../config/api";
import { toast } from "sonner";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("user"); // default user

  const location = useLocation();
  const navigate = useNavigate();

  const userData = location.state;

  if (!userData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg font-medium">
          Invalid access. Please register again.
        </p>
      </div>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(API_ENDPOINTS.VERIFY_OTP, {
        ...userData,
        otp,
        role
      });
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Verify Your OTP
        </h2>

        <form onSubmit={handleVerify} className="space-y-5">
          <select
  value={role}
  onChange={(e) => setRole(e.target.value)}
  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
>
  <option value="user">User</option>
  <option value="admin">Admin</option>
  <option value="staff">Staff</option>
</select>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center tracking-widest text-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-lg transition-all ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Verifying..." : "Verify & Register"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Didn’t get the OTP?{" "}
          <span className="text-blue-600 font-medium cursor-pointer hover:underline">
            Resend
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
