import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import HomePage from "./Pages/HomePage.jsx";
import ProductPage from "./Pages/ProductPage.jsx";
import ProductDetailsPage from "./Pages/ProductDetailsPage.jsx";
import CartPage from "./Pages/CartPage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";

function App() {
  return (
    <Router>
      {/* Navbar always on top */}
      <Navbar />

      {/* Main Page Content */}
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>

      {/* Footer always at bottom */}
      <Footer />
    </Router>
  );
}

export default App;
