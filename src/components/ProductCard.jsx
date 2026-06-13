
// import { useContext } from "react";
// import { CartContext } from "../context/CartContext";
// import { Link } from "react-router-dom";
// import Button from "./ui/Button";

// const ProductCard = ({ product }) => {
//   const { addToCart, wishlist, toggleWishlist, isCartOpen, toggleCart } = useContext(CartContext);

//   const isFavorited = wishlist.includes(product.id);

//   const handleAddToCart = () => {
//     addToCart(product);
//     if (!isCartOpen) {
//       toggleCart();
//     }
//   };

//   return (
//     <div className="group w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-purple-950/10 sm:hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative mx-auto">

//       {/* WISHLIST FLOATING HEART */}
//       <button
//         onClick={() => toggleWishlist(product.id)}
//         className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all cursor-pointer"
//         aria-label="Add to Wishlist"
//       >
//         <svg
//           className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "text-slate-400 dark:text-slate-500"
//             }`}
//           fill={isFavorited ? "currentColor" : "none"}
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//           />
//         </svg>
//       </button>

//       {/* IMAGE CONTAINER - Auto scaling height for 2-column mobile look */}
//       <div className="relative overflow-hidden h-28 xs:h-36 sm:h-44 md:h-52 bg-slate-50 dark:bg-slate-900/40">
//         <Link to={`/product/${product.id}`} className="block w-full h-full">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//           />
//         </Link>
//         {/* CATEGORY BADGE */}
//         <span className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[7px] sm:text-[10px] font-extrabold text-slate-600 dark:text-slate-400 rounded sm:rounded-lg shadow-sm tracking-wider uppercase">
//           {product.category}
//         </span>
//       </div>

//       {/* CONTENT - Scaled text layout for 2-cards setup */}
//       <div className="p-2 sm:p-4 md:p-5 flex-grow flex flex-col justify-between">
//         <div>
//           <Link to={`/product/${product.id}`}>
//             <h2 className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-base md:text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1 text-left">
//               {product.name}
//             </h2>
//           </Link>
//           <p className="text-slate-400 dark:text-slate-500 text-[9px] sm:text-xs mt-0.5 text-left line-clamp-1">
//             {product.description || "Premium quality build"}
//           </p>
//           {product.rating && (
//             <div className="flex items-center gap-0.5 sm:gap-1 mt-1">
//               <div className="flex text-amber-400 text-[8px] sm:text-[10px]">
//                 {"★".repeat(Math.floor(product.rating))}{product.rating % 1 >= 0.5 ? "★" : ""}
//               </div>
//               <span className="text-slate-400 dark:text-slate-500 text-[8px] sm:text-[9px] font-semibold">{product.rating}</span>
//             </div>
//           )}
//         </div>

//         <div className="mt-2 sm:mt-4">
//           <div className="flex justify-between items-baseline">
//             <span className="text-slate-400 dark:text-slate-500 text-[9px] sm:text-xs font-medium">Price</span>
//             <span className="text-xs sm:text-lg md:text-xl font-black text-slate-900 dark:text-slate-100">
//               ${product.price}
//             </span>
//           </div>

//           <Button
//             onClick={handleAddToCart}
//             variant="primary"
//             className="mt-2 sm:mt-4 w-full py-1.5 sm:py-2 text-[10px] sm:text-sm font-bold rounded-lg"
//           >
//             Add to Cart
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard; 















import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import Button from "./ui/Button";

const ProductCard = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, isCartOpen, toggleCart } = useContext(CartContext);

  if (!product) return null;

  const targetId = product.id || product._id;
  const isFavorited = wishlist.some(item => item === targetId || item.id === targetId || item._id === targetId);

  const handleAddToCart = () => {
    addToCart(product);
    if (!isCartOpen) {
      toggleCart();
    }
  };

  const displayImage = product.image || (product.images && product.images[0]?.url) || "";

  return (
    <div className="group w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-purple-950/10 sm:hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative mx-auto">

      {/* WISHLIST FLOATING HEART */}
      <button
        onClick={() => toggleWishlist(targetId)}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all cursor-pointer"
        aria-label="Add to Wishlist"
      >
        <svg
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "text-slate-400 dark:text-slate-500"
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
      <div className="relative overflow-hidden h-32 xs:h-36 sm:h-44 md:h-52 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center p-2">
        <Link to={`/product/${targetId}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={product.name || product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {/* CATEGORY BADGE */}
        <span className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[7px] sm:text-[10px] font-extrabold text-slate-600 dark:text-slate-400 rounded sm:rounded-lg shadow-sm tracking-wider uppercase">
          {product.category || "General"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-2 sm:p-4 flex-grow flex flex-col justify-between">
        <div>
          <Link to={`/product/${targetId}`}>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1 text-left">
              {product.name || product.title}
            </h2>
          </Link>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs mt-0.5 text-left line-clamp-1">
            {product.description || "Premium quality build"}
          </p>
          {product.rating && (
            <div className="flex items-center gap-0.5 sm:gap-1 mt-1">
              <div className="flex text-amber-400 text-[8px] sm:text-[10px]">
                {"★".repeat(Math.floor(product.rating))}{product.rating % 1 >= 0.5 ? "★" : ""}
              </div>
              <span className="text-slate-400 dark:text-slate-500 text-[8px] sm:text-[9px] font-semibold">{product.rating}</span>
            </div>
          )}
        </div>

        <div className="mt-2 sm:mt-4">
          <div className="flex justify-between items-baseline">
            <span className="text-slate-400 dark:text-slate-500 text-[9px] sm:text-xs font-medium">Price</span>
            <span className="text-sm sm:text-lg font-black text-slate-900 dark:text-slate-100">
              ${product.price}
            </span>
          </div>

          <Button
            onClick={handleAddToCart}
            variant="primary"
            className="mt-2 w-full py-1.5 text-[10px] sm:text-xs font-bold rounded-lg"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;