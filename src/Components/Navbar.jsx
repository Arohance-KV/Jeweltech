import React from "react";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();

  // Get cart items directly from Redux store
  const cartItems = useSelector((state) => state.cart.items || []);

  // Calculate cart count from Redux cart items
  const count = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="w-full flex justify-center pt-6 px-4 fixed top-0 left-0 z-50">
      <div
        className="w-full max-w-6xl h-16 bg-[#eac1bb]/70 
        backdrop-blur-xl rounded-full shadow-lg 
        flex items-center justify-between px-6 relative"
      >
        {/* Logo */}
        <Link
          to="/"
          className="text-[#8a4d55] font-semibold text-xl tracking-wider cursor-pointer"
        >
          RP-JTW
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-6 text-[#8a4d55] text-2xl relative">
          {/* Cart Icon with Badge */}
          <Link to="/cart" className="relative">
            <FiShoppingCart className="cursor-pointer hover:opacity-70 transition" />

            {count > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-red-500 text-white 
                text-xs w-5 h-5 flex items-center justify-center rounded-full shadow"
              >
                {count}
              </span>
            )}
          </Link>

          {/* Profile Icon - Direct Navigation */}
          <FiUser
            className="cursor-pointer hover:opacity-70 transition"
            onClick={handleProfileClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
