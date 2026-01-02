import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../../redux/authSlice";
import Cookies from "js-cookie";
import axios from "axios";
import API_ENDPOINTS from "../../config/api";
import { toast } from "sonner";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Features", path: "/features" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = async () => {
    try {
      await axios.get(API_ENDPOINTS.LOGOUT_USER, { withCredentials: true });
      Cookies.remove("token");
      dispatch(logoutSuccess());
      toast.success("Logged out successfully 👋");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">
        <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer">
          <h1 className="text-3xl font-bold text-emerald-600">
            Vyapaar<span className="text-slate-700">Setu</span>
          </h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1"
                  : "text-slate-700 hover:text-emerald-600 transition"
              }
            >
              {item.name}
            </NavLink>
          ))}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Icon */}
        <div className="md:hidden flex items-center">
          {menuOpen ? (
            <X className="w-7 h-7 text-emerald-600 cursor-pointer" onClick={() => setMenuOpen(false)} />
          ) : (
            <Menu className="w-7 h-7 text-emerald-600 cursor-pointer" onClick={() => setMenuOpen(true)} />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "block text-emerald-600 font-semibold"
                  : "block text-slate-700 hover:text-emerald-600"
              }
            >
              {item.name}
            </NavLink>
          ))}

          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
