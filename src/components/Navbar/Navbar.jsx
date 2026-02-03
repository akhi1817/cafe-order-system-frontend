import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Features", path: "/features" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-4 left-0 w-full z-50">
      {/* Full-width glass background */}
  <div
  className={`transition-all duration-300 ease-in-out
    rounded-3xl shadow-lg
    ${scrolled 
      ? "w-[320px] md:w-[550px] bg-[rgba(15,60,45,0.35)] backdrop-blur-xl backdrop-saturate-150" 
      : "w-[880px] md:w-[890px] bg-[rgba(15,60,45,0.35)] backdrop-blur-xl backdrop-saturate-150"
    } mx-auto`}
>


        {/* Inner content - shrinks on scroll */}
        <div
          className={`mx-auto flex items-center justify-between
            transition-all duration-300 ease-in-out
            ${scrolled ? "h-14 w-[320px] md:w-[400px] px-4" : "h-20 w-[880px] md:w-[880px] px-6"}`}
        >
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center gap-2"
          >
            <h1
              className={`font-bold transition-all duration-300 ${
                scrolled ? "text-lg" : "text-2xl"
              } text-black-200`}
            >
                 Café Aurora
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-white/90">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `relative font-medium transition ${
                    isActive ? "text-[#4F46E5]" : "hover:text-[#4F46E5]"
                  }`
                }
              >
                <span className="relative group">
                  {item.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#4F46E5] transition-all group-hover:w-full"></span>
                </span>
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            {menuOpen ? (
              <X
                className="w-7 h-7 text-[#4F46E5]"
                onClick={() => setMenuOpen(false)}
              />
            ) : (
              <Menu
                className="w-7 h-7 text-[#4F46E5]"
                onClick={() => setMenuOpen(true)}
              />
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-[#4F46E5] backdrop-blur-xl border-t border-white/10 px-6 py-6 space-y-4 rounded-b-2xl"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="block text-white/90 text-lg font-medium hover:text-[#4F46E5] transition"
                >
                  {item.name}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   




















