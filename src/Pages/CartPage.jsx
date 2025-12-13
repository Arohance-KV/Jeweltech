import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, generateEnquiry, clearCart } from "../Slices/cartSlice";
import Toast from "../Components/Toast.jsx";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const [toast, setToast] = useState(null);
  const [enrichedItems, setEnrichedItems] = useState([]);
  const [enrichLoading, setEnrichLoading] = useState(false);
  const [showEnquiryPreview, setShowEnquiryPreview] = useState(false);
  const [enquiryMessageText, setEnquiryMessageText] = useState("");

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Fetch product details for cart items
  useEffect(() => {
    const enrichItems = async () => {
      if (!items || items.length === 0) {
        setEnrichedItems([]);
        return;
      }

      setEnrichLoading(true);
      try {
        const accessToken = localStorage.getItem('accessToken');
        const enriched = await Promise.all(
          items.map(async (cartItem) => {
            try {
              const response = await fetch(
                `https://jewel-tech.onrender.com/product/${cartItem.productId}`,
                {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                  },
                }
              );

              if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                  return {
                    _id: cartItem.productId,
                    quantity: cartItem.quantity,
                    ...result.data,
                  };
                }
              }
            } catch (err) {
              console.error(`Error fetching product ${cartItem.productId}:`, err);
            }
            return cartItem;
          })
        );
        setEnrichedItems(enriched);
      } catch (err) {
        console.error('Error enriching cart items:', err);
        setEnrichedItems(items);
      } finally {
        setEnrichLoading(false);
      }
    };

    enrichItems();
  }, [items]);

  const handleRemoveItem = async (productId) => {
    try {
      const result = await dispatch(removeFromCart({ productId }));

      if (result.type === removeFromCart.fulfilled.type) {
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
      console.error("Error removing item:", err);
      setToast({
        message: "❌ Error removing item",
        type: "error",
      });
    }
  };

  const handleClearCart = async () => {
    try {
      const result = await dispatch(clearCart());
      if (result.type === clearCart.fulfilled.type) {
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
    if (enrichedItems.length === 0) {
      setToast({
        message: "❌ Cart is empty. Add items before sending enquiry",
        type: "error",
      });
      return;
    }

    try {
      const result = await dispatch(generateEnquiry());

      if (result.type === generateEnquiry.fulfilled.type && result.payload?.message) {
        // Store the message and show preview
        setEnquiryMessageText(result.payload.message);
        setShowEnquiryPreview(true);
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

  const handleSendToWhatsApp = () => {
    try {
      const ownerWhatsAppNumber = "919876543210"; // Replace with actual owner number

      // Properly encode the message for WhatsApp URL
      const encodedMessage = encodeURIComponent(enquiryMessageText);
      const whatsappURL = `https://wa.me/${ownerWhatsAppNumber}?text=${encodedMessage}`;

      console.log("Opening WhatsApp with message:", enquiryMessageText);

      window.open(whatsappURL, "_blank");

      setTimeout(() => {
        setShowEnquiryPreview(false);
        setToast({
          message: "✨ WhatsApp opened! Send your enquiry.",
          type: "success",
        });
      }, 500);
    } catch (err) {
      console.error("Error sending to WhatsApp:", err);
      setToast({
        message: "❌ Error opening WhatsApp",
        type: "error",
      });
    }
  };

  const getPrice = (item) => {
    if (typeof item.price === "number") {
      return item.price;
    } else if (item.price && typeof item.price === "string") {
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
    if (item.images && item.images.length > 0 && item.images[0]) {
      return item.images[0];
    }
    if (item.image) {
      return item.image;
    }
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='112'%3E%3Crect fill='%23eac1bb' width='112' height='112'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='12' fill='%238a4d55' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
  };

  const total = enrichedItems.reduce((sum, item) => {
    const price = getPrice(item);
    const qty = item.quantity || 1;
    return sum + (price * qty);
  }, 0);

  const isLoading = loading || enrichLoading;

  return (
    <div className="pt-28 px-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-[#8a4d55]">Your Cart</h1>
        {enrichedItems.length > 0 && (
          <button
            onClick={handleClearCart}
            disabled={isLoading}
            className="px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition disabled:opacity-50"
          >
            Clear All
          </button>
        )}
      </div>

      {isLoading && (
        <p className="text-center text-[#8a4d55]/70 text-lg">Loading cart...</p>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error loading cart: {error}
        </div>
      )}

      {enrichedItems.length === 0 && !isLoading && (
        <p className="text-center text-[#8a4d55]/70 text-lg">
          Your cart is empty.
        </p>
      )}

      {enrichedItems.length > 0 && (
        <div className="space-y-6 mb-8">
          {enrichedItems.map((item) => (
            <div
              key={item._id}
              className="flex items-start gap-6 bg-white p-6 rounded-xl shadow-md border border-[#eac1bb]/50 hover:shadow-lg transition"
            >
              {/* Product Image */}
              <img
                src={getItemImage(item)}
                alt={item.name || "Product"}
                className="w-28 h-28 object-cover rounded-lg flex shrink-0"
              />

              {/* Product Details */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-[#8a4d55] mb-2">
                  {item.name || "Product Name Not Available"}
                </h2>
                <p className="text-sm text-[#8a4d55]/70 mb-3">
                  <span className="font-medium">Product ID:</span> {item._id}
                </p>
                <p className="text-sm text-[#8a4d55]/70 mb-2">
                  <span className="font-medium">Quantity:</span> {item.quantity || 1}
                </p>
                <p className="text-lg font-semibold text-[#8a4d55]">
                  ₹{getPrice(item)}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveItem(item._id)}
                disabled={isLoading}
                className="px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition disabled:opacity-50 flex shrink-0 h-fit"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Total and Send Enquiry Section */}
      {enrichedItems.length > 0 && (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-[#eac1bb]/50">
          <div className="mb-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-[#8a4d55]">Total Items:</span>
              <span className="text-2xl font-bold text-[#8a4d55]">
                {enrichedItems.length}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-[#eac1bb]/30">
              <span className="text-xl font-semibold text-[#8a4d55]">Total Price:</span>
              <span className="text-2xl font-bold text-[#8a4d55]">
                ₹{total.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleGenerateEnquiry}
            disabled={isLoading}
            className="w-full py-3 bg-[#eac1bb]/80 text-[#8a4d55] 
            rounded-full text-lg font-semibold shadow-md hover:bg-[#eac1bb] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? "Generating..." : "💬 Send Enquiry via WhatsApp"}
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

      {/* Enquiry Preview Modal */}
      {showEnquiryPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 border border-[#eac1bb]/50 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-[#8a4d55] mb-4">
              📋 Enquiry Preview
            </h2>

            <div className="bg-[#f9f5f3] p-6 rounded-xl mb-6 whitespace-pre-wrap text-[#8a4d55] text-sm leading-relaxed border border-[#eac1bb]/30 font-mono">
              {enquiryMessageText}
            </div>

            <p className="text-[#8a4d55]/70 text-sm mb-6">
              This message will be sent to WhatsApp. Please review it before sending.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEnquiryPreview(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendToWhatsApp}
                className="flex-1 py-3 bg-[#eac1bb] text-[#8a4d55] rounded-full font-semibold hover:bg-[#d9a9a0] transition flex items-center justify-center gap-2"
              >
                💬 Send to WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;