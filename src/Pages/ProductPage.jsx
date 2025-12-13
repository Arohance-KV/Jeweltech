import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Slices/productSlice";

const ProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    // Fetch products when component mounts
    dispatch(fetchProducts());
  }, [dispatch]);

  const openDetails = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="pt-28 px-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-[#8a4d55] mb-6">
        Our Jewellery Collection
      </h1>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-[#8a4d55] text-lg">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error loading products: {error}
        </div>
      )}

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:scale-[1.03] transition"
              onClick={() => openDetails(item._id)}
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-52 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold text-[#8a4d55]">
                  {item.name}
                </h2>
                <p className="text-[#8a4d55]/80 mt-1">₹{item.price}</p>

                <button
                  className="mt-3 w-full py-2 bg-[#eac1bb]/70 text-[#8a4d55] rounded-full shadow hover:bg-[#eac1bb] transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <p className="text-center text-[#8a4d55]/70 text-lg">
            No products available.
          </p>
        )
      )}
    </div>
  );
};

export default ProductPage;
