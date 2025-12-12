import React, { useEffect, useState, useRef } from "react";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { cartCount } from "../utils/cart";

const Navbar = () => {
  const [count, setCount] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Load cart count initially + when cartUpdated event fires
  useEffect(() => {
    setCount(cartCount());

    const updateCount = () => setCount(cartCount());
    window.addEventListener("cartUpdated", updateCount);

    return () => window.removeEventListener("cartUpdated", updateCount);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => navigate("/");

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

        {/* Divider */}
        <div className="flex-1 flex justify-center">
          <span className="h-7 w-px bg-[#c7928e]/50"></span>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 text-[#8a4d55] text-2xl relative">

          {/* Cart Icon with Badge */}
          <Link to="/cart" className="relative">
            <FiShoppingCart className="cursor-pointer hover:opacity-70 transition" />

            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white 
                text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
                {count}
              </span>
            )}
          </Link>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <FiUser
              className="cursor-pointer hover:opacity-70 transition"
              onClick={() => setOpenDropdown(!openDropdown)}
            />

            {openDropdown && (
              <div
                className="absolute right-0 mt-3 w-40 bg-white rounded-xl shadow-lg 
                py-3 border border-[#e7b4ad]"
              >
                <Link
                  to="/profile"
                  onClick={() => setOpenDropdown(false)}
                  className="block px-4 py-2 text-[#8a4d55] hover:bg-[#f5d3cd]/40 transition rounded-lg"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-[#8a4d55] hover:bg-[#f5d3cd]/40 transition rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
