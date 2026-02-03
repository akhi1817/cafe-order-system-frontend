import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

import Home from '../Home/Home';
import FallbackRoute from './Fallback';
import Register from '../../components/Register/Register';
import VerifyOtp from '../../components/Register/VerifyOtp';
import Login from '../../components/Login/Login';
import AdminDashboard from '../Admin/AdminDashboard';

import Category from '../Categories/Category';
import Product from '../Product/Product';
import Table from '../Table/Table';
import Order from '../Orders/Order';
import CreateOrder from '../Orders/CreateOrder';

const Layout = () => {
  const location = useLocation();

  // 👇 Admin routes check
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* ❌ Admin page par Navbar hide */}
      {/* {!isAdminRoute && <Navbar />} */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/send-otp" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />
        <Route path='/create-order' element={<CreateOrder/>}/>

        {/* ✅ Admin */}
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
              <Route path='categories' element={<Category/>}/>
              <Route path='products' element={<Product/>}/>
              <Route path='tables' element={<Table/>}/>
              <Route path='orders' element={<Order/>}/>
          </Route>

        <Route path="*" element={<FallbackRoute />} />
      </Routes>
    </>
  );
};

const Routing = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default Routing;
