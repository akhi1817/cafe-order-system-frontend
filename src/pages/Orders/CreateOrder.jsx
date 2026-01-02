import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import API_ENDPOINTS from "../../config/api";

const CreateOrder = () => {
  const [orderType, setOrderType] = useState("Dine-in");
  const [table, setTable] = useState("");
  const [tables, setTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([{ product: "", quantity: 1, image: "" }]);

  /* ===========================
     FETCH TABLES
  =========================== */
  const fetchTables = async () => {
    if (orderType !== "Dine-in") return setTables([]);
    try {
      const res = await axios.get(API_ENDPOINTS.GET_AVAILABLE_TABLES);
      setTables(res.data?.data || []);
    } catch {
      toast.error("Failed to fetch tables");
    }
  };

  /* ===========================
     FETCH PRODUCTS
  =========================== */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.GET_ACTIVE_PRODUCTS);
      setProducts(res.data?.data || []);
    } catch {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchTables();
    fetchProducts();
    setTable(""); // reset table when orderType changes
  }, [orderType]);

  /* ===========================
     ITEM HANDLERS
  =========================== */
  const addItem = (index = null) => {
    const updated = [...items];
    index !== null
      ? updated.splice(index + 1, 0, { product: "", quantity: 1, image: "" })
      : updated.push({ product: "", quantity: 1, image: "" });
    setItems(updated);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];

    if (field === "product") {
      const selectedProduct = products.find(p => p._id === value);
      updated[index].image = selectedProduct?.image || "";
    }

    updated[index][field] = value;
    setItems(updated);
  };

  /* ===========================
     SUBMIT
  =========================== */
  const [loading, setLoading] = useState(false);
const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;

  if (orderType === "Dine-in" && !table) {
    toast.error("Please select a table");
    return;
  }

  if (items.some(i => !i.product || i.quantity < 1)) {
    toast.error("Invalid product or quantity");
    return;
  }

  setLoading(true);
  try {
    const backendItems = items.map(i => ({ product: i.product, quantity: i.quantity }));

    await axios.post(API_ENDPOINTS.CREATE_ORDER, {
      orderType,
      table: orderType === "Dine-in" ? table : null,
      items: backendItems,
    });

    toast.success("Order created successfully");

    setItems([{ product: "", quantity: 1, image: "" }]);
    setTable("");
    
    // only call if defined
    if (typeof onSuccess === "function") onSuccess();

    fetchTables();
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to create order");
  } finally {
    setLoading(false);
  }
};


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 mt-6 rounded-2xl shadow-lg max-w-2xl border"
    >
      <h3 className="text-xl font-bold mb-6 text-[#3F4F1D]">
        🧾 Create New Order
      </h3>

      {/* Order Type */}
      <select
        value={orderType}
        onChange={(e) => setOrderType(e.target.value)}
        className="border rounded-lg p-3 w-full mb-4"
      >
        <option>Dine-in</option>
        <option>Takeaway</option>
      </select>

      {/* Tables */}
      {orderType === "Dine-in" && (
        <select
          value={table}
          onChange={(e) => setTable(e.target.value)}
          className="border rounded-lg p-3 w-full mb-4"
        >
          <option value="">Select Table</option>
          {tables.map(t => (
            <option key={t._id} value={t._id}>
              Table #{t.tableNumber} ({t.capacity} seats)
            </option>
          ))}
        </select>
      )}

      {/* Items */}
      <div className="space-y-3 mb-6 border rounded-xl p-4">
        <h4 className="font-semibold text-gray-700 mb-2">Order Items</h4>

        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 mb-2">
            {/* Product Dropdown */}
            <select
              value={item.product}
              onChange={(e) => updateItem(index, "product", e.target.value)}
              className="border rounded-lg p-2 flex-1"
            >
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name} – ₹{p.price}
                </option>
              ))}
            </select>

            {/* Image Preview */}
            {item.image && (
              <img
                src={item.image}
                alt="preview"
                className="h-20 w-20 object-cover rounded-md"
              />
            )}

            {/* Quantity */}
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateItem(index, "quantity", Number(e.target.value))
              }
              className="border rounded-lg p-2 w-20 text-center"
            />

            {/* Add/Remove Buttons */}
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => addItem(index)}
                  className="h-10 w-10 rounded-full bg-green-500 text-white text-lg hover:bg-green-600"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="h-10 w-10 rounded-full bg-red-500 text-white text-lg hover:bg-red-600"
                >
                  −
                </button>
              </>
            )}
          </div>
        ))}

        {items.length === 1 && (
          <button
            type="button"
            onClick={() => addItem()}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add another item
          </button>
        )}
      </div>

      {/* Submit Button */}
      <button
  type="submit"
  disabled={loading || (orderType === "Dine-in" && !table)}
  className="w-full bg-[#3F4F1D] text-white py-3 rounded-xl font-semibold hover:bg-[#2e3b15] disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? "Creating..." : "Create Order"}
</button>

    </form>
  );
};

export default CreateOrder;
