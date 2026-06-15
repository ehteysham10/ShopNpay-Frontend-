import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import Button from "./ui/Button";

const ProductCard = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, isCartOpen, toggleCart } = useContext(CartContext);
  const [imgLoaded, setImgLoaded] = useState(false);

  if (!product) return null;

  const targetId = product.productId || product.id || product._id;

  const isFavorited = wishlist.some(
    (item) =>
      item === targetId ||
      (item && (item.id === targetId || item.productId === targetId)) ||
      (item && item._id === targetId)
  );

  const handleAddToCart = () => {
    const safeProduct = {
      ...product,
      id: targetId,
      productId: targetId,
    };
    addToCart(safeProduct);
    if (!isCartOpen) toggleCart();
  };

  const displayImage = product.image || (product.images && product.images[0]?.url) || "";

  return (
    <div className="group w-full h-full bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800/60 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-purple-500/5 dark:hover:shadow-purple-950/20 hover:-translate-y-1 transition-all duration-300 flex flex-col relative">

      <button
        onClick={() => toggleWishlist(targetId)}
        className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all cursor-pointer"
        aria-label="Add to Wishlist"
      >
        <svg
          className={`w-4 h-4 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : ""}`}
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

      <div className="relative overflow-hidden h-36 sm:h-44 md:h-48 bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900/40 dark:to-slate-800/40 flex items-center justify-center p-3">
        {!imgLoaded && (
          <div className="absolute inset-0 shimmer" />
        )}
        <Link to={`/product/${targetId}`} className="block w-full h-full relative z-[1]">
          <img
            src={displayImage}
            alt={product.name || product.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </Link>
        <span className="absolute top-2.5 left-2.5 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-extrabold text-slate-500 dark:text-slate-400 rounded-lg shadow-sm tracking-wider uppercase">
          {product.category || "General"}
        </span>
      </div>

      <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
        <div>
          <Link to={`/product/${targetId}`}>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
              {product.name || product.title}
            </h2>
          </Link>
          <p className="text-slate-400 dark:text-slate-500 text-[11px] sm:text-xs mt-1 line-clamp-2 leading-relaxed">
            {product.description || "Premium quality build"}
          </p>
          {product.rating && (
            <div className="flex items-center gap-1 mt-1.5">
              <div className="flex text-amber-400 text-[10px]">
                {"★".repeat(Math.floor(product.rating))}
                {product.rating % 1 >= 0.5 ? "★" : ""}
              </div>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-semibold">
                {product.rating}
              </span>
            </div>
          )}
        </div>

        <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-50 dark:border-slate-700/50">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs font-medium uppercase tracking-wide">
              Price
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-50">
              ${product.price}
            </span>
          </div>

          <Button
            onClick={handleAddToCart}
            variant="primary"
            className="w-full py-2 text-xs font-bold rounded-xl"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
