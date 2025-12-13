// Cart utility functions for Redux integration

export const getCart = () => {
  const saved = localStorage.getItem("cart");
  return saved ? JSON.parse(saved) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const cartCount = () => {
  try {
    const saved = localStorage.getItem("cart");
    if (!saved) return 0;
    
    const cartData = JSON.parse(saved);
    
    // Handle API response format: { items: [...] }
    if (cartData.items && Array.isArray(cartData.items)) {
      return cartData.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }
    
    // Handle array format: [{ productId, quantity }, ...]
    if (Array.isArray(cartData)) {
      return cartData.reduce((sum, item) => sum + (item.quantity || item.qty || 1), 0);
    }
    
    return 0;
  } catch (error) {
    console.error("Error calculating cart count:", error);
    return 0;
  }
};

export const saveCartFromAPI = (apiResponse) => {
  // Save the full API response structure to localStorage
  if (apiResponse && apiResponse.data) {
    localStorage.setItem("cart", JSON.stringify(apiResponse.data));
    // Dispatch event to update navbar
    window.dispatchEvent(new Event("cartUpdated"));
  }
};

export const addToCart = (product) => {
  // DEPRECATED: Use Redux cartSlice.addToCart() instead
  const cart = getCart();

  const exists = cart.find((item) => item.id === product.id);

  if (exists) {
    exists.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);

  // Notify navbar badge to update
  window.dispatchEvent(new Event("cartUpdated"));
};