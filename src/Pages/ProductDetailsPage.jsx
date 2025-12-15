import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../Slices/productSlice";
import { addToCart } from "../Slices/cartSlice";
import Toast from "../Components/Toast.jsx";
import { FiShoppingCart } from "react-icons/fi";

// Constants
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23eac1bb' width='400' height='400'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='20' fill='%238a4d55' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

// Utility Functions
const getProductImage = (product) => {
  if (product.images?.[0]) return product.images[0];
  return product.image || PLACEHOLDER_IMAGE;
};

const formatPrice = (price) => {
  if (typeof price === "number") return price.toLocaleString();
  if (typeof price === "string") return price.replace(/[₹,]/g, "").trim();
  return "0";
};

// Reusable Components
const ImageGallery = ({ product }) => {
  const [mainImage, setMainImage] = useState(getProductImage(product));

  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
    ? [product.image] 
    : [];

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main Image */}
      <img
        src={mainImage}
        alt={product.name}
        className="w-full h-60 sm:h-80 lg:h-96 object-cover rounded-lg sm:rounded-xl shadow-lg"
      />

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${product.name} ${idx + 1}`}
              onClick={() => setMainImage(img)}
              className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition flex shrink-0"
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductInfo = ({ product }) => (
  <div>
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#8a4d55]">
      {product.name}
    </h1>

    {product.sku && (
      <p className="text-xs sm:text-sm text-[#8a4d55]/60 mt-2">
        SKU: {product.sku}
      </p>
    )}

    {product.price && (
      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#8a4d55] mt-4">
        ₹{formatPrice(product.price)}
      </p>
    )}

    {product.description && (
      <p className="mt-4 sm:mt-6 text-sm sm:text-base text-[#8a4d55]/70 leading-relaxed">
        {product.description}
      </p>
    )}
  </div>
);

const ProductDetailsSection = ({ product }) => {
  const details = [
    { label: "Category", value: product.categoryId },
    { label: "Purity", value: product.purity },
    { label: "Weight", value: product.weight && `${product.weight}g` },
    { label: "Making Charges", value: product.makingChargesPerGram && `₹${product.makingChargesPerGram}/g` },
  ].filter(detail => detail.value);

  if (details.length === 0) return null;

  return (
    <div className="mt-6 sm:mt-8 bg-[#f7e7e2] p-4 sm:p-6 rounded-lg sm:rounded-xl">
      <h3 className="text-base sm:text-lg font-semibold text-[#8a4d55] mb-4">
        Product Details
      </h3>

      <div className="space-y-3">
        {details.map((detail, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-[#8a4d55]/70">
              {detail.label}:
            </span>
            <span className="font-semibold text-sm sm:text-base text-[#8a4d55]">
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AddToCartButton = ({ onAddToCart, isLoading }) => (
  <button
    onClick={onAddToCart}
    disabled={isLoading}
    className="mt-6 sm:mt-8 w-full px-6 py-3 sm:py-4 bg-[#eac1bb]/80 text-[#8a4d55] rounded-full text-base sm:text-lg font-semibold shadow-md hover:bg-[#eac1bb] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  >
    <FiShoppingCart className="text-xl" />
    {isLoading ? "Adding..." : "Add to Cart"}
  </button>
);

const LoadingState = () => (
  <div className="flex justify-center items-center h-64 sm:h-96">
    <p className="text-[#8a4d55] text-base sm:text-lg">Loading product details...</p>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="bg-red-100 text-red-700 px-4 sm:px-4 py-2 sm:py-3 rounded-lg mb-6 text-sm sm:text-base">
    Error loading product: {error}
  </div>
);

// Main Component
const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error } = useSelector((state) => state.product);
  const { status: cartStatus } = useSelector((state) => state.cart);
  const [toast, setToast] = useState(null);

  // Fetch product on mount or id change
  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = useCallback(async () => {
    if (!selectedProduct) return;

    try {
      const result = await dispatch(
        addToCart({
          productId: selectedProduct._id,
          quantity: 1,
        })
      );

      if (result.payload) {
        setToast({
          message: "✨ Added to cart successfully!",
          type: "success",
        });
      } else {
        setToast({
          message: "❌ Failed to add to cart",
          type: "error",
        });
      }
    } catch {
      setToast({
        message: "❌ Error adding to cart",
        type: "error",
      });
    }
  }, [selectedProduct, dispatch]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!selectedProduct) return null;

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 max-w-5xl mx-auto pb-10">
      {/* Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        {/* Image Section */}
        <ImageGallery product={selectedProduct} />

        {/* Details Section */}
        <div>
          {/* Product Info */}
          <ProductInfo product={selectedProduct} />

          {/* Product Details */}
          <ProductDetailsSection product={selectedProduct} />

          {/* Add to Cart Button */}
          <AddToCartButton
            onAddToCart={handleAddToCart}
            isLoading={cartStatus === "loading"}
          />
        </div>
      </div>

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

export default ProductDetailsPage;