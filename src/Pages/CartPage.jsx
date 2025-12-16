import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, generateEnquiry, clearCart } from "../Slices/cartSlice";
import Toast from "../Components/Toast.jsx";
import { useNavigate } from "react-router-dom";
import {
  sendWhatsAppEnquiry,
  formatEnquiryMessage,
} from "../utils/sendWhatsAppEnquiry";
import { FiTrash2, FiMessageCircle, FiLock } from "react-icons/fi";

// Constants
const API_BASE_URL = "https://jewel-tech.onrender.com";
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='112'%3E%3Crect fill='%23eac1bb' width='112' height='112'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='12' fill='%238a4d55' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
const WHATSAPP_PHONE = "919503878192";

// Utility Functions
const getPrice = (item) => {
  if (typeof item.price === "number") return item.price;
  if (item.price && typeof item.price === "string") {
    return parseInt(item.price.replace(/[₹,]/g, "")) || 0;
  }
  if (item.makingChargesPerGram && item.weight) {
    const chargesPerGram = typeof item.makingChargesPerGram === "string"
      ? parseInt(item.makingChargesPerGram)
      : item.makingChargesPerGram;
    const weight = typeof item.weight === "string"
      ? parseFloat(item.weight)
      : item.weight;
    return chargesPerGram * weight;
  }
  return 0;
};

const getItemImage = (item) => {
  if (item.images?.[0]) return item.images[0];
  if (item.image) return item.image;
  return PLACEHOLDER_IMAGE;
};

const fetchProductDetails = async (productId, accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${productId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.ok ? await response.json() : null;
  } catch (err) {
    console.error(`Error fetching product ${productId}:`, err);
    return null;
  }
};

// Reusable Components
const LoginPrompt = ({ onNavigate }) => (
  <div className="pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 max-w-5xl mx-auto pb-10 min-h-screen flex items-center justify-center">
    <div className="bg-white p-6 sm:p-12 rounded-2xl shadow-lg border border-[#eac1bb]/50 text-center max-w-md w-full">
      <div className="mb-6">
        <div className="text-5xl sm:text-6xl mb-4">🔒</div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#8a4d55] mb-3">
          Login Required
        </h1>
      </div>
      <p className="text-[#8a4d55]/70 text-base sm:text-lg mb-8">
        Please login to view your cart and manage your items.
      </p>
      <button
        onClick={onNavigate}
        className="w-full py-3 px-6 bg-gray-200 text-gray-700 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-300 transition"
      >
        Continue Shopping
      </button>
    </div>
  </div>
);

const CartItem = ({ item, onRemove, isLoading }) => (
  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-xl shadow-md border border-[#eac1bb]/50 hover:shadow-lg transition">
    {/* Product Image */}
    <img
      src={getItemImage(item)}
      alt={item.name || "Product"}
      className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-cover rounded-lg flex shrink-0"
    />

    {/* Product Details */}
    <div className="flex-1 min-w-0">
      <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-[#8a4d55] mb-2 line-clamp-2">
        {item.name || "Product Name Not Available"}
      </h2>
      <p className="text-xs sm:text-sm text-[#8a4d55]/70 mb-3 break-all">
        <span className="font-medium">ID:</span> {item._id}
      </p>
      <p className="text-xs sm:text-sm text-[#8a4d55]/70 mb-2">
        <span className="font-medium">Qty:</span> {item.quantity || 1}
      </p>
      <p className="text-lg sm:text-xl font-semibold text-[#8a4d55]">
        ₹{getPrice(item).toLocaleString()}
      </p>
    </div>

    {/* Remove Button */}
    <button
      onClick={() => onRemove(item._id)}
      disabled={isLoading}
      className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
    >
      <FiTrash2 className="text-lg" />
      Remove
    </button>
  </div>
);

const CartSummary = ({ itemCount, total, onGenerateEnquiry, isLoading }) => (
  <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-[#eac1bb]/50">
    <div className="mb-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-base sm:text-lg lg:text-xl font-semibold text-[#8a4d55]">
          Total Items:
        </span>
        <span className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#8a4d55]">
          {itemCount}
        </span>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-[#eac1bb]/30">
        <span className="text-base sm:text-lg lg:text-xl font-semibold text-[#8a4d55]">
          Total Price:
        </span>
        <span className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#8a4d55]">
          ₹{total.toLocaleString()}
        </span>
      </div>
    </div>

    <button
      onClick={onGenerateEnquiry}
      disabled={isLoading}
      className="w-full py-3 bg-[#eac1bb]/80 text-[#8a4d55] rounded-full text-base sm:text-lg font-semibold shadow-md hover:bg-[#eac1bb] transition disabled:opacity-50 flex items-center justify-center gap-2"
    >
      <FiMessageCircle className="text-lg" />
      {isLoading ? "Generating..." : "Send Enquiry via WhatsApp"}
    </button>
  </div>
);

const EnquiryModal = ({ message, onClose, onSend }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-4 sm:py-0">
    <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border border-[#eac1bb]/50 max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-[#8a4d55] mb-4">
        📋 Enquiry Preview
      </h2>

      <div className="bg-[#f9f5f3] p-4 sm:p-6 rounded-xl mb-6 whitespace-pre-wrap text-[#8a4d55] text-xs sm:text-sm leading-relaxed border border-[#eac1bb]/30 font-mono overflow-x-auto">
        {message}
      </div>

      <p className="text-[#8a4d55]/70 text-xs sm:text-sm mb-6">
        This message will be sent to WhatsApp. Please review it before sending.
      </p>

      <div className="flex gap-3 flex-col sm:flex-row">
        <button
          onClick={onClose}
          className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition text-sm sm:text-base"
        >
          Cancel
        </button>
        <button
          onClick={onSend}
          className="flex-1 py-3 bg-[#eac1bb] text-[#8a4d55] rounded-full font-semibold hover:bg-[#d9a9a0] transition flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <FiMessageCircle className="text-lg" />
          Send to WhatsApp
        </button>
      </div>
    </div>
  </div>
);

// Main Component
const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.cart);

  const [toast, setToast] = useState(null);
  const [enrichedItems, setEnrichedItems] = useState([]);
  const [enrichLoading, setEnrichLoading] = useState(false);
  const [showEnquiryPreview, setShowEnquiryPreview] = useState(false);
  const [enquiryMessageText, setEnquiryMessageText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check Login Status
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true);
      dispatch(fetchCart());
    } else {
      setIsLoggedIn(false);
    }
  }, [dispatch]);

  // Enrich Cart Items
  useEffect(() => {
    const enrichItems = async () => {
      if (!items?.length) {
        setEnrichedItems([]);
        return;
      }

      setEnrichLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const enriched = await Promise.all(
          items.map(async (cartItem) => {
            const result = await fetchProductDetails(cartItem.productId, accessToken);
            return result?.success && result?.data
              ? { _id: cartItem.productId, quantity: cartItem.quantity, ...result.data }
              : cartItem;
          })
        );
        setEnrichedItems(enriched);
      } catch (err) {
        console.error("Error enriching items:", err);
        setEnrichedItems(items);
      } finally {
        setEnrichLoading(false);
      }
    };

    enrichItems();
  }, [items]);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
  }, []);

  const handleRemoveItem = useCallback(
    async (productId) => {
      try {
        const result = await dispatch(removeFromCart({ productId }));
        if (result.type === removeFromCart.fulfilled.type) {
          showToast("✨ Item removed from cart", "success");
        } else {
          showToast("❌ Failed to remove item", "error");
        }
      } catch {
        showToast("❌ Error removing item", "error");
      }
    },
    [dispatch, showToast]
  );

  const handleClearCart = useCallback(async () => {
    try {
      const result = await dispatch(clearCart());
      if (result.type === clearCart.fulfilled.type) {
        showToast("✨ Cart cleared successfully", "success");
      } else {
        showToast("❌ Failed to clear cart", "error");
      }
    } catch {
      showToast("❌ Error clearing cart", "error");
    }
  }, [dispatch, showToast]);

  const handleGenerateEnquiry = useCallback(async () => {
    if (!enrichedItems.length) {
      showToast("❌ Cart is empty", "error");
      return;
    }

    try {
      const result = await dispatch(generateEnquiry());
      if (result.type === generateEnquiry.fulfilled.type) {
        const total = enrichedItems.reduce(
          (sum, item) => sum + getPrice(item) * (item.quantity || 1),
          0
        );
        const formattedMessage = formatEnquiryMessage({ items: enrichedItems, total });
        setEnquiryMessageText(formattedMessage);
        setShowEnquiryPreview(true);
      } else {
        showToast("❌ Failed to generate enquiry", "error");
      }
    } catch {
      showToast("❌ Error generating enquiry", "error");
    }
  }, [enrichedItems, dispatch, showToast]);

  const handleSendToWhatsApp = useCallback(async () => {
    try {
      await sendWhatsAppEnquiry({
        phoneNumber: WHATSAPP_PHONE,
        message: enquiryMessageText,
        onDesktopFallback: () => {
          showToast("WhatsApp Desktop detected. Message copied – paste & send 📋", "info");
        },
      });
      setShowEnquiryPreview(false);
      showToast("WhatsApp opened. Just click Send ✅", "success");
    } catch {
      showToast("❌ Could not open WhatsApp", "error");
    }
  }, [enquiryMessageText, showToast]);

  const total = enrichedItems.reduce(
    (sum, item) => sum + getPrice(item) * (item.quantity || 1),
    0
  );

  const isLoading = loading || enrichLoading;

  if (!isLoggedIn) {
    return <LoginPrompt onNavigate={() => navigate("/")} />;
  }

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#8a4d55]">
          Your Cart
        </h1>
        {enrichedItems.length > 0 && (
          <button
            onClick={handleClearCart}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition disabled:opacity-50 text-sm sm:text-base"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <p className="text-center text-[#8a4d55]/70 text-base sm:text-lg">
          Loading cart...
        </p>
      )}


      {/* Empty State */}
      {enrichedItems.length === 0 && !isLoading && (
        <p className="text-center text-[#8a4d55]/70 text-base sm:text-lg">
          Your cart is empty.
        </p>
      )}

      {/* Cart Items */}
      {enrichedItems.length > 0 && (
        <div className="space-y-4 sm:space-y-6 mb-8">
          {enrichedItems.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onRemove={handleRemoveItem}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* Summary Section */}
      {enrichedItems.length > 0 && (
        <CartSummary
          itemCount={enrichedItems.length}
          total={total}
          onGenerateEnquiry={handleGenerateEnquiry}
          isLoading={isLoading}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Enquiry Modal */}
      {showEnquiryPreview && (
        <EnquiryModal
          message={enquiryMessageText}
          onClose={() => setShowEnquiryPreview(false)}
          onSend={handleSendToWhatsApp}
        />
      )}
    </div>
  );
};

export default CartPage;