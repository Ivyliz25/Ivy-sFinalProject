import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Market from "./pages/Market.jsx";
import Login from "./pages/Login.jsx";
import TraderDashboard from "./pages/TraderDashboard.jsx";
import TraderProfile from "./pages/TraderProfile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import Cart from "./pages/Cart.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import Inspect from "./pages/Inspect.jsx";
import InspectList from "./pages/InspectList.jsx";
import ProductsAvailable from "./pages/ProductsAvailable.jsx";
import Layout from './components/Layout.jsx';
import Register from "./pages/Register.jsx";


const App = () => {
  // Protected route component - read token dynamically so login updates take effect without reload
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token"); // read fresh from localStorage
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
     <Layout>
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/trader-dashboard"
          element={
            <PrivateRoute>
              <TraderDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer-dashboard"
          element={
            <PrivateRoute>
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/trader-profile"
          element={
            <PrivateRoute>
              <TraderProfile />
            </PrivateRoute>
          }
        />

        {/* Inspect trader page */}
        <Route
          path="/inspect"
          element={
            <PrivateRoute>
              <InspectList />
            </PrivateRoute>
          }
        />
        <Route path="/products-available" element={<ProductsAvailable />} />
        <Route
          path="/inspect/:id"
          element={
            <PrivateRoute>
              <Inspect />
            </PrivateRoute>
          }
        />

        {/* Fallback 404 */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
       </Routes>
     </Layout>
    </Router>
  );
};

export default App;
