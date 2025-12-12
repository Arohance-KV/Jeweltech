import React from "react";
import { useParams } from "react-router-dom";
import { addToCart } from "../utils/cart";

const products = [
  {
    id: 1,
    name: "Elegant Gold Necklace",
    price: "₹25,999",
    description: "A beautifully crafted 22K gold necklace perfect for weddings.",
    image:
      "https://images.unsplash.com/photo-1600180758895-7c4df553c9b0?q=80&w=800",
  },
  {
    id: 2,
    name: "Diamond Ring",
    price: "₹39,499",
    description:
      "A premium diamond ring designed with brilliance and elegance.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800",
  },
  {
    id: 3,
    name: "Ruby Earrings",
    price: "₹12,999",
    description: "Stunning ruby earrings with handcrafted detailing.",
    image:
      "https://images.unsplash.com/photo-1588449960891-40e4b62c3bb0?q=80&w=800",
  },
  {
    id: 4,
    name: "Luxury Bracelet",
    price: "₹19,999",
    description: "A premium bracelet designed for special occasions.",
    image:
      "https://images.unsplash.com/photo-1584367369853-8af94f1e87c2?q=80&w=800",
  },
];

const ProductDetailsPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product)
    return <h1 className="text-center mt-20 text-xl">Product not found</h1>;

  return (
    <div className="pt-28 px-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-100 object-cover rounded-xl shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-semibold text-[#8a4d55]">
            {product.name}
          </h1>

          <p className="text-xl text-[#8a4d55]/90 mt-2">{product.price}</p>

          <p className="mt-4 text-[#8a4d55]/70">{product.description}</p>

          <button
            onClick={() => addToCart(product)}
            className="mt-8 px-6 py-3 bg-[#eac1bb]/80 text-[#8a4d55] 
            rounded-full text-lg shadow-md hover:bg-[#eac1bb] transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
