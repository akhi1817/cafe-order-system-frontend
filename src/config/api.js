// src/config/apiEndpoints.js
const baseurl = import.meta.env.VITE_API_URL;

const API_ENDPOINTS = {
  // ---------- Auth / User ----------
  LOGIN_USER: `${baseurl}/api/auth/login`,
  LOGOUT_USER: `${baseurl}/api/auth/logout`,
  CHECK_AUTH: `${baseurl}/api/auth/protected`,
  SEND_OTP: `${baseurl}/api/auth/register/send-otp`,
  VERIFY_OTP: `${baseurl}/api/auth/register/verify-otp`,
  SEND_MESSAGE: `${baseurl}/api/auth/send-message`,
  GET_ALL_USERS: `${baseurl}/api/auth/admin/users`,
  UPDATE_USER_ROLE: (userId) => `${baseurl}/api/auth/admin/update-role/${userId}`,
  SEND_ROLE_CHANGE_OTP: `${baseurl}/api/auth/admin/send-role-change-otp`,
  VERIFY_ROLE_CHANGE_OTP: `${baseurl}/api/auth/admin/verify-role-change-otp`,
  DELETE_USER: (userId) => `${baseurl}/api/auth/admin/delete/${userId}`,

  //category
  CREATE_CATEGORY: `${baseurl}/api/category`,
  GET_ALL_CATEGORIES: `${baseurl}/api/category`,
  UPDATE_CATEGORY: (id) => `${baseurl}/api/category/${id}`,
  DELETE_CATEGORY: (id) => `${baseurl}/api/category/${id}`,


  //products
  GET_ALL_PRODUCTS: `${baseurl}/api/product`,           // GET - Public
  CREATE_PRODUCT: `${baseurl}/api/product`,            // POST - Admin
  UPDATE_PRODUCT: (id) => `${baseurl}/api/product/${id}`, // PUT - Admin
  DELETE_PRODUCT: (id) => `${baseurl}/api/product/${id}`, // DELETE - Admin
  UPLOAD_PRODUCT_IMAGE: `${baseurl}/api/product/upload`,


  // ---------- Tables ----------
GET_ALL_TABLES: `${baseurl}/api/table`,               // GET - Public
CREATE_TABLE: `${baseurl}/api/table`,                // POST - Admin
UPDATE_TABLE: (id) => `${baseurl}/api/table/${id}`, // PUT - Admin
DELETE_TABLE: (id) => `${baseurl}/api/table/${id}`, // DELETE - Admin
TOGGLE_TABLE_STATUS: (id) => `${baseurl}/api/table/${id}/toggle-status`, // PATCH - Admin



  // ---------- Orders ----------
 
  GET_ALL_ORDERS: `${baseurl}/api/orders`,  
  GET_ORDER_BY_ID: (id) => `${baseurl}/api/orders/${id}`,
  
  UPDATE_ORDER_STATUS: (id) =>
    `${baseurl}/api/orders/${id}/status`,               // PATCH - Admin


  UPDATE_ORDER: (id) => `${baseurl}/api/orders/${id}`,

  // 🧾 Order (Customer / Admin)
  CREATE_ORDER: `${baseurl}/api/orders`,                 // POST

  // 🍽️ Dine-in Helpers
  GET_AVAILABLE_TABLES: `${baseurl}/api/orders/tables/available`, // GET

  // 🍔 Products for Order
  GET_ACTIVE_PRODUCTS: `${baseurl}/api/orders/products/active`, 
  
  //delete all orders
  DELETE_ALL_ORDERS: `${baseurl}/api/orders/delete-all`,

  //delete one order
  DELETE_ORDER: (id) => `${baseurl}/api/orders/delete-order/${id}`,

  // ✏️ Edit existing order items
EDIT_ORDER_ITEMS: (id) => `${baseurl}/api/orders/${id}/edit-items`, // PATCH


  // 🟣 Reports (History)
  GET_ORDER_REPORTS: `${baseurl}/api/orders/reports`,
};

export default API_ENDPOINTS;
