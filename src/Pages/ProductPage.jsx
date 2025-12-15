import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Slices/productSlice";
import { fetchCategories } from "../Slices/categorySlice";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Constants
const ITEMS_PER_PAGE = {
  mobile: 8,    // 2x4
  tablet: 15,   // 3x5
  desktop: 16,  // 4x4
};

// Hooks
const useResponsiveItemsPerPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE.desktop);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(ITEMS_PER_PAGE.mobile);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(ITEMS_PER_PAGE.tablet);
      } else {
        setItemsPerPage(ITEMS_PER_PAGE.desktop);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return itemsPerPage;
};

// Utility Functions
const getProductImage = (item) => {
  if (item.images && item.images.length > 0) return item.images[0];
  return item.image || "item-image";
};

const formatPrice = (price) => {
  if (typeof price === "number") return price.toLocaleString();
  if (typeof price === "string") return price.replace(/[₹,]/g, "").trim();
  return "0";
};

// Reusable Components
const FilterSection = ({ categories, selectedCategory, onCategoryChange }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#8a4d55]">
      Our Jewellery Collection
    </h1>

    <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
      <label className="text-[#8a4d55] font-medium text-sm sm:text-base whitespace-nowrap">
        Filter by Category:
      </label>
      <select
        value={selectedCategory}
        onChange={onCategoryChange}
        className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-[#8a4d55]/30 rounded-lg bg-white text-[#8a4d55] font-medium text-sm sm:text-base focus:outline-none focus:border-[#8a4d55] transition"
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
);

const ProductCard = ({ item, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300"
  >
    <img
      src={getProductImage(item)}
      alt={item.name}
      className="h-40 sm:h-48 lg:h-52 w-full object-cover"
    />

    <div className="p-3 sm:p-4">
      <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-[#8a4d55] line-clamp-2">
        {item.name}
      </h2>
      <p className="text-[#8a4d55]/80 mt-1 sm:mt-2 text-sm sm:text-base font-semibold">
        ₹{formatPrice(item.price)}
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="mt-3 sm:mt-4 w-full py-2 bg-[#eac1bb]/70 text-[#8a4d55] rounded-full shadow hover:bg-[#eac1bb] transition text-xs sm:text-sm font-semibold"
      >
        View Details
      </button>
    </div>
  </div>
);

const PaginationControls = ({ currentPage, totalPages, onPrevious, onNext }) => (
  <div className="flex items-center justify-center gap-4 mt-8 sm:mt-10 mb-8">
    <button
      onClick={onPrevious}
      disabled={currentPage === 1}
      className="p-2 sm:p-3 rounded-full border border-[#8a4d55]/30 text-[#8a4d55] hover:bg-[#eac1bb]/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FiChevronLeft className="text-xl sm:text-2xl" />
    </button>

    <div className="flex items-center gap-2 sm:gap-3">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg font-semibold text-xs sm:text-sm transition ${
            currentPage === page
              ? "bg-[#8a4d55] text-white"
              : "bg-[#eac1bb]/30 text-[#8a4d55] hover:bg-[#eac1bb]/50"
          }`}
        >
          {page}
        </button>
      ))}
    </div>

    <button
      onClick={onNext}
      disabled={currentPage === totalPages}
      className="p-2 sm:p-3 rounded-full border border-[#8a4d55]/30 text-[#8a4d55] hover:bg-[#eac1bb]/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FiChevronRight className="text-xl sm:text-2xl" />
    </button>
  </div>
);

const LoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <p className="text-[#8a4d55] text-base sm:text-lg">Loading products...</p>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="bg-red-100 text-red-700 px-4 sm:px-4 py-2 sm:py-3 rounded-lg mb-6 text-sm sm:text-base">
    Error loading products: {error}
  </div>
);

const EmptyState = () => (
  <p className="text-center text-[#8a4d55]/70 text-base sm:text-lg">
    No products available.
  </p>
);

// Main Component
const ProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = useResponsiveItemsPerPage();

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }
    return products.filter((product) => product.categoryId === selectedCategory);
  }, [selectedCategory, products]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handlers
  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, totalPages]);

  const handleOpenDetails = useCallback(
    (id) => {
      navigate(`/product/${id}`);
    },
    [navigate]
  );

  // Responsive grid classes
  const gridClass = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8";

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 max-w-7xl mx-auto pb-10">
      {/* Filter Section */}
      <FilterSection
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Error State */}
      {error && <ErrorState error={error} />}

      {/* Products Grid */}
      {!loading && paginatedProducts.length > 0 && (
        <div className={gridClass}>
          {paginatedProducts.map((item) => (
            <ProductCard
              key={item._id}
              item={item}
              onClick={() => handleOpenDetails(item._id)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && <EmptyState />}

      {/* Pagination Controls */}
      {!loading && paginatedProducts.length > 0 && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
        />
      )}
    </div>
  );
};

export default ProductPage;