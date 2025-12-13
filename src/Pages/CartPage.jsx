import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, generateEnquiry, clearCart } from "../Slices/cartSlice";
import Toast from "../Components/Toast.jsx";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error, success, enquiryMessage } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Fetch cart when component mounts
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemoveItem = async (productId) => {
    try {
      const result = await dispatch(removeFromCart({ productId }));
      if (result.payload) {
        // Refetch cart to update the UI
        dispatch(fetchCart());
        setToast({
          message: "✨ Item removed from cart",
          type: "success",
        });
      } else {
        setToast({
          message: "❌ Failed to remove item",
          type: "error",
        });
      }
    } catch (err) {
      setToast({
        message: "❌ Error removing item",
        type: "error",
      });
    }
  };

  const handleClearCart = async () => {
    try {
      const result = await dispatch(clearCart());
      if (result.payload) {
        setToast({
          message: "✨ Cart cleared successfully",
          type: "success",
        });
      } else {
        setToast({
          message: "❌ Failed to clear cart",
          type: "error",
        });
      }
    } catch (err) {
      setToast({
        message: "❌ Error clearing cart",
        type: "error",
      });
    }
  };

  const handleGenerateEnquiry = async () => {
    if (items.length === 0) {
      setToast({
        message: "❌ Cart is empty. Add items before sending enquiry",
        type: "error",
      });
      return;
    }

    try {
      // Dispatch the enquiry action to backend first
      const result = await dispatch(generateEnquiry());
      
      if (result.payload && result.payload.message) {
        // Get the message from backend response
        let enquiryMessage = result.payload.message;
        
        // Get owner's WhatsApp number
        const ownerWhatsAppNumber = "919876543210"; // Replace with actual owner number
        
        // Encode the message properly for WhatsApp
        const encodedMessage = encodeURIComponent(enquiryMessage);
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${ownerWhatsAppNumber}?text=${encodedMessage}`;
        
        console.log("Opening WhatsApp with URL:", whatsappURL);
        
        // Open WhatsApp - works better with encoded message
        window.open(whatsappURL, "_blank");
        
        // Small delay to ensure window opens
        setTimeout(() => {
          setToast({
            message: "✨ WhatsApp opened! Send your enquiry.",
            type: "success",
          });
        }, 500);
      } else {
        setToast({
          message: "❌ Failed to generate enquiry",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error generating enquiry:", err);
      setToast({
        message: "❌ Error sending enquiry",
        type: "error",
      });
    }
  };

  const total = items.reduce((sum, item) => {
    let price = 0;
    if (typeof item.price === "number") {
      price = item.price;
    } else if (item.price && typeof item.price === "string") {
      price = parseInt(item.price.replace(/[₹,]/g, "")) || 0;
    } else if (item.makingChargesPerGram && item.weight) {
      price = item.makingChargesPerGram * item.weight;
    }
    const qty = item.quantity || item.qty || 1;
    return sum + (price * qty);
  }, 0);

  return (
    <div className="pt-28 px-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-[#8a4d55]">Your Cart</h1>
        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            disabled={loading}
            className="px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition disabled:opacity-50"
          >
            Clear All
          </button>
        )}
      </div>

      {loading && (
        <p className="text-center text-[#8a4d55]/70 text-lg">Loading cart...</p>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error loading cart: {error}
        </div>
      )}

      {items.length === 0 && !loading && (
        <p className="text-center text-[#8a4d55]/70 text-lg">
          Your cart is empty.
        </p>
      )}

      {items.length > 0 && (
        <div className="space-y-6 mb-8">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex items-start gap-6 bg-white p-6 rounded-xl shadow-md border border-[#eac1bb]/50 hover:shadow-lg transition"
            >
              {/* Product Image */}
              <img
                src={item.images && item.images[0] ? item.images[0] : item.image}
                alt={item.name}
                className="w-28 h-28 object-cover rounded-lg flex-shrink-0"
              />

              {/* Product Details */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-[#8a4d55] mb-2">
                  {item.name}
                </h2>
                <p className="text-sm text-[#8a4d55]/70 mb-3">
                  <span className="font-medium">Product ID:</span> {item._id}
                </p>
                <p className="text-sm text-[#8a4d55]/70">
                  <span className="font-medium">Quantity:</span> {item.quantity || 1}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveItem(item._id)}
                disabled={loading}
                className="px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition disabled:opacity-50 flex-shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Total and Send Enquiry Section */}
      {items.length > 0 && (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-[#eac1bb]/50">
          <div className="mb-6 flex justify-between items-center">
            <span className="text-xl font-semibold text-[#8a4d55]">Total Items:</span>
            <span className="text-2xl font-bold text-[#8a4d55]">
              {items.length}
            </span>
          </div>

          <button
            onClick={handleGenerateEnquiry}
            disabled={loading}
            className="w-full py-3 bg-[#eac1bb]/80 text-[#8a4d55] 
            rounded-full text-lg font-semibold shadow-md hover:bg-[#eac1bb] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Generating..." : "💬 Send Enquiry via WhatsApp"}
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default CartPage;