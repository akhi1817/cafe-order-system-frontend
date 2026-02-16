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
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);
  // 🌟 Voice Ordering States
// 🌟 Voice Ordering States
const [isListening, setIsListening] = useState(false);
const [voiceText, setVoiceText] = useState("");

// 🌟 Number words map
const wordToNumber = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,eleven:11,twelve:12
};

// 🌟 Fuzzy matching function
const findNearestProduct = (query) => {
  query = query.toLowerCase().trim();

  let bestMatch = null;
  let highestScore = 0;

  allProducts.forEach((p) => {
    const name = p.name.toLowerCase();
    const score = stringSimilarity(name, query);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = p;
    }
  });

  return highestScore >= 0.6 ? bestMatch : null;
};


// 🌟 Simple string similarity (Jaro-Winkler / Levenshtein approximation)
const stringSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();

  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / Math.max(str1.length, str2.length);
};

// 🌟 Levenshtein distance
const levenshteinDistance = (a, b) => {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else
        matrix[i][j] =
          1 + Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]);
    }
  }
  return matrix[b.length][a.length];
};


// Start voice recognition
const startListening = async () => {
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    return alert("Your browser does not support voice recognition");
  }

  if (products.length === 0) {
    toast.error("Products are still loading. Try again in a moment.");
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => setIsListening(true);
  recognition.onend = () => setIsListening(false);

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  setVoiceText(transcript);

  // Delay parsing by 2 seconds to avoid premature timeout
  setTimeout(() => {
    parseVoiceOrder(transcript);
  }, 3000); 
};


  recognition.start();
};

// 🌟 Enhanced parser
const parseVoiceOrder = async (text) => {
  if (!text || products.length === 0) return;

  try {
    let lowerText = text.toLowerCase();
    const parts = lowerText.replace(/ and /g, ",").split(",");
    let addedCount = 0;

    for (let part of parts) {
      part = part.trim();
      if (!part) continue;

      // Match quantity + product name
      // Examples: "2 spring roll", "two cappuccino", "paneer butter masala"
      const match = part.match(/(\d+|one|two|three|four|five|six|seven|eight|nine|ten)?\s*(.*)/);
      let qtyRaw = match[1];
      let quantity = qtyRaw
        ? isNaN(qtyRaw)
          ? wordToNumber[qtyRaw] || 1
          : parseInt(qtyRaw, 10)
        : 1;

      let nameQuery = match[2].trim();
      if (!nameQuery) continue;

 // products.find ko replace karo allProducts.find se
let product =
  allProducts.find((p) => p.name.toLowerCase().includes(nameQuery)) ||
  findNearestProduct(nameQuery);


      if (product) {
        onAddProduct({
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        });
        addedCount++;
      } else {
        toast.error(`Product not found: "${nameQuery}"`);
      }
    }

    if (addedCount > 0)
      toast.success(`${addedCount} item(s) added via voice!`);
  } catch (err) {
    console.error("Voice order parsing error:", err);
    toast.error("Failed to parse voice order");
  }
};


// Fetch all products for voice recognition
useEffect(() => {
  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.GET_ALL_PRODUCTS, {
        params: { includeInactive: true, limit: 500 },
        withCredentials: true,
      });
      setAllProducts(res.data?.data || []);
    } catch (err) {
      console.log("Failed to load all products for voice ordering");
    }
  };
  fetchAllProducts();
}, []);



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

          {/* 🌟 Voice Ordering */}
<div className="flex flex-col gap-3 mb-4">

  {/* 🌟 Voice Order Instructions */}
 {/* 🌟 Voice Order Instructions */}
<div className="bg-green-50/60 backdrop-blur-md p-3 rounded-xl border border-green-200 mb-3">
  <p className="text-green-900 font-medium mb-1">💡 How to give voice order:</p>
  <ul className="text-green-800 text-sm list-disc list-inside space-y-1">
    <li>Always mention <strong>quantity first</strong> (optional, default 1 if skipped): <em>"2 spring roll"</em></li>
    <li>Combine multiple items using <strong>"and"</strong> or commas: <em>"1 gulab jamun and 2 cappuccino"</em></li>
    <li>Minor spelling mistakes are okay — system will auto-correct or match closest product: <em>"late"</em> → <strong>Latte</strong></li>
    <li>Voice order works <strong>across all categories</strong> (starters, desserts, drinks, mains)</li>
    <li>If product not found, check spelling or try saying a similar name</li>
    <li>Speak clearly and pause <strong>2 seconds</strong> after finishing your order for processing</li>
  </ul>
  <p className="text-green-700 text-sm mt-2 italic">Example orders you can try:</p>
  <ul className="text-green-800 text-sm list-disc list-inside">
    <li>"2 spring roll and 1 gulab jamun"</li>
    <li>"1 paneer butter masala and 2 garlic naan"</li>
    <li>"1 latte, 2 cappuccino"</li>
    <li>"3 french fries and 1 cold coffee"</li>
  </ul>
</div>


  {/* 🌟 Voice Order Button */}
  <button
    type="button"
    onClick={startListening}
    disabled={isListening}
    className={`flex-1 px-5 py-3 rounded-xl font-semibold text-white ${
      isListening ? "bg-red-500" : "bg-blue-600 hover:bg-blue-700"
    }`}
  >
    {isListening ? "🎙 Listening..." : "🎤 Give Order using Voice"}
  </button>

  {/* 🌟 Show recognized text */}
  {voiceText && (
    <p className="text-green-900 text-sm italic bg-white/30 backdrop-blur-md p-2 rounded">
      You said: "{voiceText}"
    </p>
  )}
</div>
      </div>
    </div>
  );
};

export default MenuSelector;
