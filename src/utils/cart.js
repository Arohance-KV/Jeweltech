// NOTE: These functions are kept for backward compatibility
// New implementation should use Redux slices directly

export const getCart = () => {
  const saved = localStorage.getItem("cart");
  return saved ? JSON.parse(saved) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
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

export const cartCount = () => {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
};

// For Redux integration use:
// import { useDispatch } from 'react-redux';
// import { addToCart, removeFromCart, fetchCart } from '../Slices/cartSlice';
