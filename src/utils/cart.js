export const getCart = () => {
  const saved = localStorage.getItem("cart");
  return saved ? JSON.parse(saved) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToCart = (product) => {
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
