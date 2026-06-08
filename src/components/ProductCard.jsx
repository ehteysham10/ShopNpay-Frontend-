import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import Button from "./ui/Button";

const ProductCard = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, isCartOpen, toggleCart } = useContext(CartContext);

  const isFavorited = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
    if (!isCartOpen) {
      toggleCart();
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-purple-950/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative">
      
      {/* WISHLIST FLOATING HEART */}
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all cursor-pointer"
        aria-label="Add to Wishlist"
      >
        <svg
          className={`w-4 h-4 transition-colors ${
            isFavorited ? "fill-red-500 text-red-500" : "text-slate-400 dark:text-slate-500"
          }`}
          fill={isFavorited ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* IMAGE CONTAINER */}
      <div className="relative overflow-hidden h-52 bg-slate-50 dark:bg-slate-900/40">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {/* CATEGORY BADGE */}
        <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-extrabold text-slate-600 dark:text-slate-400 rounded-lg shadow-sm tracking-wider uppercase">
          {product.category}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <Link to={`/product/${product.id}`}>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1 text-left">
              {product.name}
            </h2>
          </Link>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 text-left line-clamp-1">
            {product.description || "Premium quality build"}
          </p>
          {product.rating && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex text-amber-400 text-xs">
                {"★".repeat(Math.floor(product.rating))}{product.rating % 1 >= 0.5 ? "★" : ""}
              </div>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-semibold">{product.rating}</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-baseline">
            <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">Price</span>
            <span className="text-xl font-black text-slate-900 dark:text-slate-100">
              ${product.price}
            </span>
          </div>

          <Button
            onClick={handleAddToCart}
            variant="primary"
            className="mt-4 w-full"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;