import React, { useState } from "react";
import { getCart, saveCart } from "../utils/cart";

const CartPage = () => {
  const [cartItems, setCartItems] = useState(getCart());

  const updateQty = (id, type) => {
    const updated = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            qty: type === "inc" ? item.qty + 1 : Math.max(1, item.qty - 1),
          }
        : item
    );

    setCartItems(updated);
    saveCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    saveCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + parseInt(item.price.replace(/[₹,]/g, "")) * item.qty,
    0
  );

  const sendEnquiry = () => {
    const message = cartItems
      .map((item) => `${item.name} (Qty: ${item.qty})`)
      .join("%0A");

    const phone = "919999999999"; // your WhatsApp number

    const url = `https://wa.me/${phone}?text=Hello, I want to enquire about:%0A${message}`;
    window.open(url, "_blank");
  };

  return (
    <div className="pt-28 px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-[#8a4d55] mb-6">Your Cart</h1>

      {cartItems.length === 0 && (
        <p className="text-center text-[#8a4d55]/70 text-lg">
          Your cart is empty.
        </p>
      )}

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-6 bg-white p-4 rounded-xl shadow-md"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-28 h-28 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#8a4d55]">
                {item.name}
              </h2>
              <p className="text-[#8a4d55]/70">{item.price}</p>

              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => updateQty(item.id, "dec")}
                  className="px-3 py-1 bg-[#eac1bb]/60 text-[#8a4d55] rounded-full"
                >
                  -
                </button>

                <span className="text-lg font-medium">{item.qty}</span>

                <button
                  onClick={() => updateQty(item.id, "inc")}
                  className="px-3 py-1 bg-[#eac1bb]/60 text-[#8a4d55] rounded-full"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {cartItems.length > 0 && (
        <div className="mt-10 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-[#8a4d55] mb-4">Summary</h2>

          <div className="flex justify-between text-lg">
            <span>Total:</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          <button
            onClick={sendEnquiry}
            className="w-full mt-6 py-3 bg-[#eac1bb]/80 text-[#8a4d55] 
            rounded-full text-lg shadow-md hover:bg-[#eac1bb] transition"
          >
            Send Enquiry
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
