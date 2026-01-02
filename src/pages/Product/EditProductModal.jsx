import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import API_ENDPOINTS from "../../config/api";

const EditProductModal = ({ data, onClose, onSuccess }) => {
  const [name, setName] = useState(data.name);
  const [price, setPrice] = useState(data.price);
  const [category, setCategory] = useState(data.category?._id || "");
  const [categories, setCategories] = useState([]);
  const [isVeg, setIsVeg] = useState(data.isVeg);
  const [displayOrder, setDisplayOrder] = useState(data.displayOrder);
  const [isActive, setIsActive] = useState(data.isActive);
  const [image, setImage] = useState(data.image || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
        setCategories(res.data.data);
      } catch {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await axios.post(API_ENDPOINTS.UPLOAD_PRODUCT_IMAGE, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      setImage(res.data.imageUrl);
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name || !price || !category) return toast.error("Fill all required fields");

    try {
      setLoading(true);
      await axios.put(API_ENDPOINTS.UPDATE_PRODUCT(data._id), {
        name,
        price,
        category,
        isVeg,
        displayOrder,
        image,
        isActive
      }, { withCredentials: true });

      toast.success("Product updated successfully");
      onSuccess();
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Edit Product
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
              required
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={isVeg} onChange={() => setIsVeg(!isVeg)} />
              <span>Veg</span>
            </label>

            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              placeholder="Display Order"
              className="w-24 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`px-3 py-1 rounded text-white text-sm ${isActive ? "bg-green-500" : "bg-red-500"}`}
            >
              {isActive ? "Active" : "Inactive"}
            </button>
          </div>

          <div>
            <input type="file" onChange={handleImageUpload} className="mb-2" />
            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
            {image && <img src={image} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded-md" />}
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || uploading}
              className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || uploading}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
