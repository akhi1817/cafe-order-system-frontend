import React, { useEffect, useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../config/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSentEmail, setOtpSentEmail] = useState("");

  const [superAdminId, setSuperAdminId] = useState(""); // super admin id

  // ---------------- Fetch all users ----------------
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.GET_ALL_USERS, {
        withCredentials: true,
      });
      const data = res.data.data || [];
      setUsers(data);

      // find first admin → super admin
      const firstAdmin = data.filter(u => u.role === "admin").sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0];
      setSuperAdminId(firstAdmin?._id || "");
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ---------------- Handle role change ----------------
  const handleRoleChange = async (user, role) => {
    if (user.role === role) return;

    if (user.role === "admin") {
      setSelectedUser(user);
      setNewRole(role);
      const confirmSendOtp = window.confirm(
        `Target user "${user.username}" is an admin.\nSend OTP to Super Admin for role change?`
      );
      if (!confirmSendOtp) return;

      try {
        const res = await axios.post(
          API_ENDPOINTS.SEND_ROLE_CHANGE_OTP,
          { targetUserId: user._id, newRole: role },
          { withCredentials: true }
        );
        toast.success(res.data.message || "OTP sent to Super Admin");
        setOtpSentEmail(res.data.email);
        setShowOtpModal(true);
      } catch (err) {
        console.error("Send OTP error:", err);
        toast.error(err.response?.data?.message || "Failed to send OTP");
      }
    } else {
      try {
        const res = await axios.put(
          API_ENDPOINTS.UPDATE_USER_ROLE(user._id),
          { role },
          { withCredentials: true }
        );
        toast.success(res.data.message || "Role updated successfully");
        fetchUsers();
      } catch (err) {
        console.error("Update role error:", err);
        toast.error(err.response?.data?.message || "Failed to update role");
      }
    }
  };

  // ---------------- Verify OTP ----------------
  const handleVerifyOtp = async () => {
    if (!otp || !selectedUser || !newRole) return;
    try {
      const res = await axios.post(
        API_ENDPOINTS.VERIFY_ROLE_CHANGE_OTP,
        { targetUserId: selectedUser._id, newRole, otp },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Role updated successfully");
      setShowOtpModal(false);
      setOtp("");
      setSelectedUser(null);
      setNewRole("");
      fetchUsers();
    } catch (err) {
      console.error("Verify OTP error:", err);
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  // ---------------- Delete user (Super Admin only) ----------------
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete "${user.username}"?`)) return;

    if (user._id === superAdminId) {
      toast.error("Super Admin cannot delete themselves");
      return;
    }

    try {
      const res = await axios.delete(
        API_ENDPOINTS.DELETE_USER(user._id),
        { withCredentials: true }
      );
      toast.success(res.data.message || "User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error("Delete user error:", err);
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold text-green-800 mb-4">
        Registered Users
      </h2>

      {loading ? (
        <div className="space-y-2">
          <div className="h-6 w-1/3 bg-green-100 rounded animate-pulse" />
          <div className="h-6 w-full bg-green-100 rounded animate-pulse" />
          <div className="h-6 w-full bg-green-100 rounded animate-pulse" />
        </div>
      ) : (
        <table className="min-w-full bg-green-50 border rounded-xl overflow-hidden">
          <thead className="bg-green-200">
            <tr>
              <th className="px-4 py-2 text-left text-green-900">#</th>
              <th className="px-4 py-2 text-left text-green-900">Username</th>
              <th className="px-4 py-2 text-left text-green-900">Email</th>
              <th className="px-4 py-2 text-left text-green-900">Role</th>
              <th className="px-4 py-2 text-left text-green-900">Created At</th>
              <th className="px-4 py-2 text-left text-green-900">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-2 text-center text-green-700">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr
                  key={user._id}
                  className="border-b border-green-200 hover:bg-green-100 transition"
                >
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                 <td className="px-4 py-2 capitalize">
  {superAdminId === user._id ? (
    <span className="text-gray-400">Super Admin</span> // Super Admin ka role fixed
  ) : (
    <select
      value={user.role}
      onChange={(e) => handleRoleChange(user, e.target.value)}
      className="border rounded px-2 py-1 text-green-900"
    >
      <option value="staff">Staff</option>
      <option value="manager">Manager</option>
      <option value="admin">Admin</option>
      <option value="user">User</option>
    </select>
  )}
</td>
                  <td className="px-4 py-2">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {superAdminId === user._id ? (
                      <span className="text-gray-400">Super Admin</span>
                    ) : (
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* ---------------- OTP Modal ---------------- */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: -50 }}
              className="bg-white rounded-lg p-6 w-96 shadow-lg"
            >
              <h3 className="text-xl font-bold mb-4 text-green-800">
                Enter OTP
              </h3>
              <p className="mb-2 text-green-700">
                OTP sent to: <b>{otpSentEmail}</b>
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border px-3 py-2 rounded w-full mb-4"
                placeholder="Enter 4-digit OTP"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtp("");
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyOtp}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Verify & Update
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
