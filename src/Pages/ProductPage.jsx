import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Slices/productSlice";
import { fetchCategories } from "../Slices/categorySlice";

const ProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // Fetch products and categories when component mounts
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter products based on selected category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.categoryId === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  const openDetails = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto">
      {/* Header and Filter Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-[#8a4d55]">
          Our Jewellery Collection
        </h1>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-[#8a4d55] font-medium">Filter by Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-[#8a4d55]/30 rounded-lg bg-white text-[#8a4d55] font-medium focus:outline-none focus:border-[#8a4d55] transition"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

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

      {filteredProducts && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {filteredProducts.map((item) => (
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