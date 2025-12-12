import React from "react";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Elegant Gold Necklace",
    price: "₹25,999",
    image:
      "https://images.unsplash.com/photo-1600180758895-7c4df553c9b0?q=80&w=800",
  },
  {
    id: 2,
    name: "Diamond Ring",
    price: "₹39,499",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800",
  },
  {
    id: 3,
    name: "Ruby Earrings",
    price: "₹12,999",
    image:
      "https://images.unsplash.com/photo-1588449960891-40e4b62c3bb0?q=80&w=800",
  },
  {
    id: 4,
    name: "Luxury Bracelet",
    price: "₹19,999",
    image:
      "https://images.unsplash.com/photo-1584367369853-8af94f1e87c2?q=80&w=800",
  },
];

const ProductPage = () => {
  const navigate = useNavigate();

  const openDetails = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="pt-28 px-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-[#8a4d55] mb-6">
        Our Jewellery Collection
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:scale-[1.03] transition"
            onClick={() => openDetails(item.id)}
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
              <p className="text-[#8a4d55]/80 mt-1">{item.price}</p>

              <button
                className="mt-3 w-full py-2 bg-[#eac1bb]/70 text-[#8a4d55] rounded-full shadow hover:bg-[#eac1bb] transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
