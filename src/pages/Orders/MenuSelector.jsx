// src/components/order/MenuSelector.jsx
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import API_ENDPOINTS from "../../config/api";

const cardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
};

const MenuSelector = ({ onAddProduct, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_ENDPOINTS.GET_ALL_CATEGORIES, {
          withCredentials: true,
        });
        setCategories(res.data?.data || []);
        setSelectedCategory(res.data?.data?.[0]?._id || "");
      } catch (err) {
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products by category
  useEffect(() => {
    if (!selectedCategory) return;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_ENDPOINTS.GET_ALL_PRODUCTS, {
          params: {
            category: selectedCategory,
            includeInactive: true,
            limit: 50, // enough for menu display
          },
          withCredentials: true,
        });
        setProducts(res.data?.data || []);
      } catch (err) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.GET_AI_RECOMMENDATIONS, {
        withCredentials: true,
      });
      setRecommended(res.data?.data || []);
    } catch (err) {
      console.log("Failed to load recommendations");
    }
  };

  fetchRecommendations();
}, []);


  // Memoized category buttons
  const categoryButtons = useMemo(
    () =>
      categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => setSelectedCategory(cat._id)}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedCategory === cat._id
              ? "bg-green-600 text-white"
              : "bg-white border border-green-300 text-green-800"
          }`}
        >
          {cat.name}
        </button>
      )),
    [categories, selectedCategory]
  );

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/30 p-4">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-green-900">🍽 Select Menu Items</h3>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            Close
          </button>
        </div>
{recommended.length > 0 && (
  <div className="mb-6">
    <h3 className="text-lg font-bold text-green-900 mb-3">✨ Recommended For You</h3>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {recommended.map((item) => (
        <motion.div
          key={item._id}
          variants={cardVariant}
          initial="hidden"
          animate="visible"
          className="bg-yellow-50 border border-yellow-300 rounded-xl p-3 shadow-sm flex flex-col"
        >
          {/* ⭐ IMAGE */}
          <div className="h-24 w-full overflow-hidden rounded-lg bg-white">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>

          <p className="font-semibold text-green-900 truncate mt-2">
            {item.name}
          </p>

          <p className="text-green-700 font-bold">₹{item.price}</p>

          <button
            className="mt-2 py-1 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
            onClick={() =>
              onAddProduct({
                product: item._id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1,
              })
            }
          >
            Add
          </button>
        </motion.div>
      ))}
    </div>
  </div>
)}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">{categoryButtons}</div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-36 bg-gray-300/50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-center">No products available</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((p) => (
              <motion.div
                key={p._id}
                variants={cardVariant}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
                className="bg-white/70 backdrop-blur-md border border-green-200 rounded-2xl overflow-hidden shadow-md flex flex-col"
              >
                {/* Image */}
                <div className="h-28 overflow-hidden relative">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                  {!p.isActive && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-sm">
                      Inactive
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-2 text-center flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-green-900 truncate">{p.name}</h4>
                    <p className="text-base font-bold text-green-700 mt-1">₹{p.price}</p>
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={() =>
                      onAddProduct({
                        product: p._id,
                        quantity: 1,
                        image: p.image || "",
                        name: p.name,
                        price: p.price,
                      })
                    }
                    disabled={!p.isActive || p.stock === 0}
                    className={`mt-2 w-full py-1 rounded-xl text-white text-sm font-medium ${
                      !p.isActive || p.stock === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {!p.isActive
                      ? "Inactive"
                      : p.stock === 0
                      ? "Out of Stock"
                      : "Add"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuSelector;
