import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, generateEnquiry } from "../Slices/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error, success, enquiryMessage } = useSelector((state) => state.cart);

  const updateQty = (id, type) => {
    // For now, we'll keep local state for quantity updates
    // You can extend the Redux slice to handle quantity updates via API
    console.log("Update quantity feature - to be implemented with backend API");
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart({ productId }));
  };

  const handleGenerateEnquiry = () => {
    dispatch(generateEnquiry());
  };

  useEffect(() => {
    // Fetch cart when component mounts
    dispatch(fetchCart());
  }, [dispatch]);

  const total = items.reduce((sum, item) => {
    // Handle different price field names and formats
    let price = 0;
    if (typeof item.price === "number") {
      price = item.price;
    } else if (item.price && typeof item.price === "string") {
      price = parseInt(item.price.replace(/[₹,]/g, "")) || 0;
    } else if (item.makingChargesPerGram && item.weight) {
      // Calculate price from making charges if price doesn't exist
      price = item.makingChargesPerGram * item.weight;
    }
    const qty = item.quantity || item.qty || 1;
    return sum + (price * qty);
  }, 0);

  return (
    <div className="pt-28 px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-[#8a4d55] mb-6">Your Cart</h1>

      {loading && (
        <p className="text-center text-[#8a4d55]/70 text-lg">Loading cart...</p>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error loading cart: {error}
        </div>
      )}

      {success && enquiryMessage && (
        <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-6">
          {enquiryMessage}
        </div>
      )}

      {items.length === 0 && !loading && (
        <p className="text-center text-[#8a4d55]/70 text-lg">
          Your cart is empty.
        </p>
      )}

      {items.length > 0 && (
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-6 bg-white p-4 rounded-xl shadow-md"
            >
              <img
                src={item.images && item.images[0] ? item.images[0] : item.image}
                alt={item.name}
                className="w-28 h-28 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-[#8a4d55]">
                  {item.name}
                </h2>
              </div>

              <button
                onClick={() => handleRemoveItem(item._id)}
                disabled={loading}
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Send Enquiry Button - Always Visible */}
      <div className="mt-10 p-6 bg-white rounded-xl shadow-lg">
        <button
          onClick={handleGenerateEnquiry}
          disabled={loading}
          className="w-full mt-6 py-3 bg-[#eac1bb]/80 text-[#8a4d55] 
          rounded-full text-lg font-semibold shadow-md hover:bg-[#eac1bb] transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Send Enquiry"}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
