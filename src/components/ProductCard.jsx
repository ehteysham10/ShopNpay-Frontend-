import { useContext, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import Button from "./ui/Button";

const C = {
  card:       'rgba(255,255,255,0.95)',
  border:     '#EDE5D8',
  borderHover:'#D4C4B0',
  bg:         '#FAF7F2',
  bgImg:      '#F5F0E8',
  text:       '#2C2416',
  textMuted:  '#7A6A55',
  textSubtle: '#A08B70',
  accent:     '#8B6914',
  catBg:      'rgba(255,255,255,0.88)',
};

const renderStars = (rating) => {
  const score = Math.round(Number(rating || 0));
  const filled = "★".repeat(Math.max(0, Math.min(5, score)));
  const empty = "☆".repeat(Math.max(0, Math.min(5, 5 - score)));
  return filled + empty;
};

const ProductCard = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, isCartOpen, toggleCart, token } = useContext(CartContext);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const targetId = product?.productId || product?.id || product?._id;

  useEffect(() => {
    let active = true;
    const fetchReviews = async () => {
      if (!targetId) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${targetId}/reviews`);
        const result = await res.json();
        if (active && res.ok && (result.success || result.status === "success")) {
          setReviews(result.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch reviews for card:", err);
      } finally {
        if (active) setLoadingReviews(false);
      }
    };
    fetchReviews();
    return () => { active = false; };
  }, [targetId]);

  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  const displayRating = product.rating || averageRating;

  if (!product) return null;

  const isFavorited = wishlist.some(
    (item) =>
      item === targetId ||
      (item && (item.id === targetId || item.productId === targetId)) ||
      (item && item._id === targetId)
  );

  const handleAddToCart = () => {
    if (!token) {
      addToCart(product);
      return;
    }
    const safeProduct = { ...product, id: targetId, productId: targetId };
    addToCart(safeProduct);
    if (!isCartOpen) toggleCart();
  };

  const displayImage = product.image || (product.images && product.images[0]?.url) || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group w-full h-full rounded-2xl overflow-hidden flex flex-col relative transition-all duration-300 hover:-translate-y-1.5"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        boxShadow: '0 2px 12px rgba(139,107,68,0.06)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(139,107,68,0.14)';
        e.currentTarget.style.borderColor = C.borderHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(139,107,68,0.06)';
        e.currentTarget.style.borderColor = C.border;
      }}
    >
      {/* Wishlist button */}
      <button
        onClick={() => toggleWishlist(targetId)}
        className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 p-2 rounded-xl backdrop-blur-md shadow-sm text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.9)', border: `1px solid ${C.border}` }}
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

      {/* Image area */}
      <div
        className="relative overflow-hidden h-44 sm:h-52 md:h-56 w-full flex items-center justify-center group/image"
        style={{ background: C.bgImg }}
      >
        {!imgLoaded && <div className="absolute inset-0 shimmer" />}
        <Link to={`/product/${targetId}`} className="block w-full h-full relative z-[1]">
          <img
            src={displayImage}
            alt={product.name || product.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ transform: imgLoaded ? undefined : 'scale(1)' }}
          />
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />
        </Link>
        
        {/* Category badge */}
        <span
          className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-extrabold rounded-lg shadow-sm tracking-wider uppercase transition-opacity duration-300 group-hover:opacity-0"
          style={{ background: C.catBg, color: C.textSubtle, border: `1px solid ${C.border}` }}
        >
          {product.category || "General"}
        </span>

        {/* Hover-reveal Add to Cart Button */}
        <div className="absolute bottom-3 left-3 right-3 z-20 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <Button
            onClick={handleAddToCart}
            variant="primary"
            className="w-full py-2.5 text-xs font-black rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform backdrop-blur-md"
            style={{ background: 'rgba(139,105,20,0.95)' }}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Info area */}
      <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
        <div>
          <Link to={`/product/${targetId}`}>
            <h2
              className="font-bold text-sm sm:text-base line-clamp-1 transition-colors"
              style={{ color: C.text }}
              onMouseEnter={(e) => e.target.style.color = C.accent}
              onMouseLeave={(e) => e.target.style.color = C.text}
            >
              {product.name || product.title}
            </h2>
          </Link>
          <p className="text-[11px] sm:text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: C.textSubtle }}>
            {product.description || "Premium quality build"}
          </p>
          {displayRating && displayRating > 0 ? (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-amber-500 text-[11px] sm:text-xs tracking-wider">
                {renderStars(displayRating)}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold" style={{ color: C.text }}>
                {Number(displayRating).toFixed(1)}
              </span>
            </div>
          ) : (
            <p className="text-[10px] font-semibold italic mt-1.5" style={{ color: C.textSubtle }}>
              No reviews yet
            </p>
          )}
        </div>

        <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest" style={{ color: C.textSubtle }}>
              Price
            </span>
            <span className="text-base sm:text-lg font-black" style={{ color: C.text }}>
              ${product.price}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
