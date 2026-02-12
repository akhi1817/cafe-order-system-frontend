import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import API_ENDPOINTS from "../../config/api";

const LIMIT = 12;

const cardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25 },
  },
};

// Debounce
const debounce = (fn, delay = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Categories (once)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
        setCategories(res.data.data || []);
      } catch {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(
    debounce(async ({ page, search, category }) => {
      const controller = new AbortController();
      setLoading(true);

      try {
        const res = await axios.get(API_ENDPOINTS.GET_ALL_PRODUCTS, {
          params: {
            page,
            limit: LIMIT,
            search: search || undefined,
            category: category || undefined,
            includeInactive: false,
          },
          signal: controller.signal,
        });
        setProducts(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
      } catch (err) {
        if (!axios.isCancel(err)) toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    }, 500),
    []
  );

  useEffect(() => {
    fetchProducts({
      page: currentPage,
      search: searchTerm,
      category: selectedCategory,
    });
  }, [currentPage, searchTerm, selectedCategory]);

  useEffect(() => setCurrentPage(1), [searchTerm, selectedCategory]);

  // Generate category tabs
  const categoryTabs = useMemo(
    () => ["All", ...categories.map((c) => c.name)],
    [categories]
  );

  return (
    <div className="p-4 min-h-screen bg-linear-to-br from-[#FAF9E0] via-[#F5F7D3] to-[#E8F1C0]">
      <h3 className="text-2xl md:text-3xl font-bold text-[#3F4F1D] mb-6">
        🍽 Explore Our Menu
      </h3>

      {/* --- Premium Filters --- */}
      <div className="sticky top-0 z-30 flex flex-col md:flex-row gap-3 mb-6 bg-[#FAF9E0]/90 backdrop-blur-md p-4 rounded-2xl border border-[#D2E089]/50 shadow">
        {/* Search */}
        <motion.input
          type="text"
          placeholder="Search menu item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          whileFocus={{ scale: 1.02 }}
          className="w-full md:w-1/3 px-4 py-2 rounded-2xl bg-white/70 border border-[#D2E089]/50 placeholder:text-[#6B8E23]/70 text-[#3F4F1D] focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
        />

        {/* Original dropdown (optional, for mobile) */}
        <motion.select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  whileFocus={{ scale: 1.02 }}
  className="w-full md:w-1/4 px-4 py-2 rounded-2xl bg-white/70 border border-[#D2E089]/50 text-[#3F4F1D] focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
>
  <option value="">All Categories</option>
  {categories.map((cat) => (
    <option key={cat._id} value={cat._id}>
      {cat.name}
    </option>
  ))}
</motion.select>
      </div>

     {/* --- Category Tabs --- */}
<div className="flex flex-wrap gap-3 mb-6">
  <button
    onClick={() => setSelectedCategory("")}
    className={`px-4 py-2 rounded-xl font-medium transition ${
      selectedCategory === ""
        ? "bg-green-700 text-white shadow-lg"
        : "bg-white text-green-800 border border-green-200 hover:bg-green-100"
    }`}
  >
    All
  </button>

  {categories.map((cat) => (
    <button
      key={cat._id}
      onClick={() => setSelectedCategory(cat._id)}
      className={`px-4 py-2 rounded-xl font-medium transition ${
        selectedCategory === cat._id
          ? "bg-green-700 text-white shadow-lg"
          : "bg-white text-green-800 border border-green-200 hover:bg-green-100"
      }`}
    >
      {cat.name}
    </button>
  ))}
</div>

      {/* --- Product Grid --- */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div
              key={i}
              className="h-52 bg-white/50 rounded-2xl border border-[#D2E089]/40 animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center">No products found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((p) => (
            <motion.div
              key={p._id}
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              className="group rounded-2xl overflow-hidden bg-white/70 backdrop-blur-xl border border-[#D2E089]/50 shadow-md hover:shadow-xl transition-all"
            >
              {/* Image with premium hover effect */}
              <div className="relative h-40 overflow-hidden">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 text-center">
                <h4 className="text-base font-semibold text-[#3F4F1D] truncate">
                  {p.name}
                </h4>
                <p className="mt-1 text-xs font-semibold">
                  {p.isVeg ? (
                    <span className="text-green-700">🟢 Veg</span>
                  ) : (
                    <span className="text-red-600">🔴 Non-Veg</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-[#3F4F1D]/80">
                  Category: {p.category?.name || "Unknown"}
                </p>
                <p className="mt-2 text-lg font-bold text-[#6B8E23]">
                  ₹{p.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* --- Pagination --- */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 rounded-xl bg-[#6B8E23] text-white disabled:opacity-40"
        >
          ◀ Prev
        </button>

        <span className="text-[#3F4F1D] font-semibold">
          Page {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 rounded-xl bg-[#6B8E23] text-white disabled:opacity-40"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default Menu;
