import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import EditProductModal from "./EditProductModal";
import API_ENDPOINTS from "../../config/api";

const cardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" }
  }
};

const AllProducts = ({ refresh, onChange }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const LIMIT = 5;


 const fetchProducts = async () => {
  try {
    setLoading(true);

    const params = {
      page: currentPage,
      limit: LIMIT
    };

    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;

    const res = await axios.get(API_ENDPOINTS.GET_ALL_PRODUCTS, { params });

    setProducts(res.data.data);
    setTotalPages(res.data.pagination.totalPages);
  } catch {
    toast.error("Failed to load products");
  } finally {
    setLoading(false);
  }
};


  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      setCategories(res.data.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(API_ENDPOINTS.DELETE_PRODUCT(id), {
        withCredentials: true
      });
      toast.success("Product deleted");
      onChange();
    } catch {
      toast.error("Delete failed");
    }
  };

 useEffect(() => {
  fetchProducts();
}, [refresh, currentPage, searchTerm, selectedCategory]);

useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, selectedCategory]);

useEffect(() => {
  fetchCategories();
}, []);

  

  return (
    <div className="bg-linear-to-br from-[#FAF3E0] via-[#E8DCC4] to-[#F5EFE6] p-4 rounded-2xl min-h-screen">
      <h3 className="text-xl md:text-2xl font-semibold text-[#3F4F1D] mb-4">
         🍽  All Menu Items
      </h3>

      {/* Filters */}
<div
  className="
    sticky top-0 z-30
    flex flex-col md:flex-row gap-3 mb-6
    bg-white/70 backdrop-blur-xl
    p-4 rounded-2xl
    border border-white/30
    shadow-md
  "
>
        <motion.input
          type="text"
          placeholder="Search menu item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-full md:w-1/3 px-4 py-2 rounded-2xl
            bg-white/40 backdrop-blur-xl border border-white/30
            placeholder:text-[#6B8E23]/70 text-[#3F4F1D]
            focus:outline-none focus:ring-2 focus:ring-[#bbcf93]"
        />

        <motion.select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-full md:w-1/4 px-4 py-2 rounded-2xl
            bg-white/40 backdrop-blur-xl border border-white/30
            text-[#3F4F1D] placeholder:text-[#6B8E23]/70
            focus:outline-none focus:ring-2 focus:ring-[#bbcf93]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </motion.select>
      </div>

      {loading ? (
        <p className="text-[#6B8E23]">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((p) => (
            <motion.div
              key={p._id}
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              className="group rounded-2xl overflow-hidden
                bg-white/70 backdrop-blur-xl
                border border-white/30
                shadow-md hover:shadow-xl
                transition-all"
            >
              {/* Image */}
              <div className="relative h-36 overflow-hidden">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover
                      transition-transform duration-500
                      group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-[#556B2F]/40 to-transparent" />
              </div>

              {/* Info */}
              <div className="p-3 text-center">
                <h4 className="text-sm font-semibold text-[#3F4F1D] truncate">
                  {p.name}
                </h4>
                <p className="mt-1 text-base font-bold text-[#6B8E23]">
                  ₹{p.price}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 p-2">
                <button
                  onClick={() => setEditData(p)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-white
                    bg-linear-to-r from-[#6B8E23] to-[#8AA35C]
                    shadow hover:scale-105 transition"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-white
                    bg-linear-to-r from-[#B23A48] to-[#8C1D18]
                    shadow hover:scale-105 transition"
                >
                  🗑 Delete
                </button>
              </div>
            </motion.div>
          ))}


        </div>
      )}

      {editData && (
        <EditProductModal
          data={editData}
          onClose={() => setEditData(null)}
          onSuccess={() => {
            setEditData(null);
            onChange();
          }}
        />
      )}
                {/* Pagination */}
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

export default AllProducts;
