import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../Slices/productSlice";
import { addToCart } from "../Slices/cartSlice";
import Toast from "../Components/Toast.jsx";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error } = useSelector((state) => state.product);
  const { status: cartStatus, error: cartError } = useSelector((state) => state.cart);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Fetch product details when component mounts or id changes
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    if (selectedProduct) {
      const result = await dispatch(addToCart({
        productId: selectedProduct._id,
        quantity: 1,
      }));
      
      if (result.payload) {
        setToast({
          message: "✨ Added to cart successfully!",
          type: "success",
        });
      } else if (result.payload === undefined) {
        setToast({
          message: "❌ Failed to add to cart",
          type: "error",
        });
      }
    }
  };

  return (
    <div className="pt-28 px-6 max-w-5xl mx-auto">
      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-[#8a4d55] text-lg">Loading product details...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error loading product: {error}
        </div>
      )}

      {selectedProduct && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <img
              src={selectedProduct.images && selectedProduct.images[0] ? selectedProduct.images[0] : selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-100 object-cover rounded-xl shadow-lg"
            />
            {selectedProduct.images && selectedProduct.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {selectedProduct.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${selectedProduct.name} ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-[#8a4d55]">
              {selectedProduct.name}
            </h1>

            {selectedProduct.sku && (
              <p className="text-sm text-[#8a4d55]/60 mt-1">SKU: {selectedProduct.sku}</p>
            )}

            {selectedProduct.price && (
              <p className="text-2xl font-bold text-[#8a4d55] mt-4">₹{selectedProduct.price}</p>
            )}

            {selectedProduct.description && (
              <p className="mt-6 text-[#8a4d55]/70 leading-relaxed">{selectedProduct.description}</p>
            )}

            {/* Product Details */}
            <div className="mt-8 bg-[#f7e7e2] p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-[#8a4d55] mb-4">Product Details</h3>
              
              <div className="space-y-3">
                {selectedProduct.categoryId && (
                  <div className="flex justify-between">
                    <span className="text-[#8a4d55]/70">Category:</span>
                    <span className="font-semibold text-[#8a4d55]">{selectedProduct.categoryId}</span>
                  </div>
                )}

                {selectedProduct.purity && (
                  <div className="flex justify-between">
                    <span className="text-[#8a4d55]/70">Purity:</span>
                    <span className="font-semibold text-[#8a4d55]">{selectedProduct.purity}</span>
                  </div>
                )}

                {selectedProduct.weight && (
                  <div className="flex justify-between">
                    <span className="text-[#8a4d55]/70">Weight:</span>
                    <span className="font-semibold text-[#8a4d55]">{selectedProduct.weight}g</span>
                  </div>
                )}

                {selectedProduct.makingChargesPerGram && (
                  <div className="flex justify-between">
                    <span className="text-[#8a4d55]/70">Making Charges:</span>
                    <span className="font-semibold text-[#8a4d55]">₹{selectedProduct.makingChargesPerGram}/g</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={cartStatus === "loading"}
              className="mt-8 w-full px-6 py-3 bg-[#eac1bb]/80 text-[#8a4d55] 
              rounded-full text-lg font-semibold shadow-md hover:bg-[#eac1bb] transition disabled:opacity-50"
            >
              {cartStatus === "loading" ? "Adding..." : "Add to Cart"}
            </button>
          </div>
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

export default ProductDetailsPage;
