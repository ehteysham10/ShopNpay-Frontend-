

// import { useParams, Link } from "react-router-dom";
// import { useState, useContext, useEffect } from "react";
// import Navbar from "../components/Navbar";
// import { CartContext } from "../context/CartContext";
// import Button from "../components/ui/Button";
// import ProductCard from "../components/ProductCard";

// const Product = () => {
//   const { id } = useParams();
//   const { addToCart, wishlist, toggleWishlist, isCartOpen, toggleCart, token, user } = useContext(CartContext);

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [reviews, setReviews] = useState([]);
//   const [reviewsLoading, setReviewsLoading] = useState(true);
//   const [related, setRelated] = useState([]);
//   const [submittingReview, setSubmittingReview] = useState(false);

//   // CAROUSEL & ZOOM MECHANISM STATES
//   const [currentImgIndex, setCurrentImgIndex] = useState(0);
//   const [isZoomOpen, setIsZoomOpen] = useState(false);
//   const [zoomScale, setZoomScale] = useState(1);
//   const [touchStart, setTouchStart] = useState(0);
//   const [touchEnd, setTouchEnd] = useState(0);

//   const [reviewForm, setReviewForm] = useState({ comment: "", rating: 5 });

//   const API_URL = import.meta.env.VITE_API_URL;

//   const normalizeProduct = (p) => {
//     if (!p) return null;
//     return {
//       id: p.productId || p._id,
//       productId: p.productId,
//       _id: p._id,
//       name: p.title || p.name || "",
//       title: p.title || p.name || "",
//       price: p.price || 0,
//       category: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : "General",
//       image: p.images?.[0]?.url || p.image || "",
//       images: p.images || [],
//       description: p.description || "",
//       rating: p.rating || 4.5,
//       reviewsCount: p.reviewsCount || 0
//     };
//   };

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const response = await fetch(`${API_URL}/products/${id}`);
//         const result = await response.json();

//         if (response.ok && result.status === "success") {
//           const rawProduct = result.data.product || result.data;
//           const normProduct = normalizeProduct(rawProduct);

//           if (normProduct) {
//             setProduct(normProduct);
//             setCurrentImgIndex(0);

//             if (normProduct.category) {
//               const relRes = await fetch(`${API_URL}/products?category=${normProduct.category.toLowerCase()}&limit=4`);
//               const relResult = await relRes.json();
//               if (relRes.ok && relResult.status === "success") {
//                 const filteredRelated = (relResult.data.products || [])
//                   .map(normalizeProduct)
//                   .filter(p => p && p.id !== normProduct.id);
//                 setRelated(filteredRelated);
//               }
//             }
//           } else {
//             setError("Failed to parse product data");
//           }
//         } else {
//           setError(result.message || "Product not found");
//         }
//       } catch (err) {
//         console.error("Error loading product:", err);
//         setError("Failed to connect to server");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductDetails();
//   }, [id, API_URL]);

//   useEffect(() => {
//     const fetchReviews = async () => {
//       setReviewsLoading(true);
//       try {
//         const response = await fetch(`${API_URL}/products/${id}/reviews`);
//         const result = await response.json();
//         if (response.ok && result.status === "success") {
//           setReviews(result.data || []);
//         }
//       } catch (err) {
//         console.error("Error loading reviews:", err);
//       } finally {
//         setReviewsLoading(false);
//       }
//     };

//     fetchReviews();
//   }, [id, API_URL]);

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="flex flex-col items-center justify-center py-20 w-full min-h-[calc(100vh-64px)] bg-slate-950">
//           <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-slate-400 mt-4 font-bold text-sm">Loading product details...</p>
//         </div>
//       </>
//     );
//   }

//   if (error || !product) {
//     return (
//       <>
//         <Navbar />
//         <div className="max-w-4xl mx-auto px-6 py-20 text-center min-h-[calc(100vh-64px)] flex flex-col justify-center items-center">
//           <h2 className="text-2xl font-bold text-slate-200">{error || "Product not found"}</h2>
//           <Link to="/" className="mt-4 inline-block text-purple-400 font-semibold hover:underline">
//             Back to Home
//           </Link>
//         </div>
//       </>
//     );
//   }

//   const isFavorited = wishlist.some(item => (item.id === product.id || item === product.id || item._id === product._id));

//   const handleAddToCart = () => {
//     addToCart(product);
//     if (!isCartOpen) {
//       toggleCart();
//     }
//   };

//   const handleNextImage = () => {
//     if (!productImagesArray || productImagesArray.length <= 1) return;
//     setCurrentImgIndex((prev) => (prev === productImagesArray.length - 1 ? 0 : prev + 1));
//   };

//   const handlePrevImage = () => {
//     if (!productImagesArray || productImagesArray.length <= 1) return;
//     setCurrentImgIndex((prev) => (prev === 0 ? productImagesArray.length - 1 : prev - 1));
//   };

//   const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
//   const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
//   const handleTouchEnd = () => {
//     if (!touchStart || !touchEnd) return;
//     const distance = touchStart - touchEnd;
//     if (distance > 50) handleNextImage();
//     if (distance < -50) handlePrevImage();
//     setTouchStart(0);
//     setTouchEnd(0);
//   };

//   const handleWheelZoom = (e) => {
//     e.preventDefault();
//     if (e.deltaY < 0) {
//       setZoomScale((prev) => Math.min(prev + 0.2, 4));
//     } else {
//       setZoomScale((prev) => Math.max(prev - 0.2, 1));
//     }
//   };

//   const handleAddReview = async (e) => {
//     e.preventDefault();
//     if (!token) {
//       alert("Please log in to submit a review.");
//       return;
//     }
//     if (!reviewForm.comment.trim()) return;

//     setSubmittingReview(true);
//     try {
//       const response = await fetch(`${API_URL}/products/${id}/reviews`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           rating: Number(reviewForm.rating),
//           comment: reviewForm.comment
//         })
//       });
//       const result = await response.json();
//       if (response.ok && result.status === "success") {
//         const newReview = {
//           _id: result.data._id || Date.now().toString(),
//           user: { name: user?.name || "Anonymous" },
//           rating: Number(reviewForm.rating),
//           comment: reviewForm.comment,
//           createdAt: new Date().toISOString()
//         };
//         setReviews([newReview, ...reviews]);
//         setReviewForm({ comment: "", rating: 5 });
//       } else {
//         alert(result.message || "Failed to submit review");
//       }
//     } catch (err) {
//       console.error("Error submitting review:", err);
//     } finally {
//       setSubmittingReview(false);
//     }
//   };

//   const productImagesArray = product.images && product.images.length > 0 ? product.images : [{ url: product.image }];
//   const activeImageSrc = productImagesArray[currentImgIndex]?.url || product.image;

//   return (
//     <>
//       <Navbar />

//       {/* LIGHTBOX FOR ZOOM */}
//       {isZoomOpen && (
//         <div
//           className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 select-none cursor-zoom-out"
//           onClick={() => { setIsZoomOpen(false); setZoomScale(1); }}
//         >
//           <button
//             className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all text-xl font-bold z-[1000]"
//             onClick={() => { setIsZoomOpen(false); setZoomScale(1); }}
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>

//           <div
//             className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//             onWheel={handleWheelZoom}
//           >
//             <img
//               src={activeImageSrc}
//               alt="Zoom mode view"
//               className="max-w-full max-h-full object-contain origin-center transition-transform duration-150 ease-out cursor-grab active:cursor-grabbing"
//               style={{ transform: `scale(${zoomScale})` }}
//             />
//           </div>

//           <div className="absolute bottom-6 flex flex-col items-center gap-2 pointer-events-none">
//             <div className="flex gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-xs font-semibold">
//               <span>Scroll Wheel to Zoom In / Out</span>
//               <span className="text-purple-400">|</span>
//               <span>Scale: {zoomScale.toFixed(1)}x</span>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
//         {/* BREADCRUMB */}
//         <div className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-6 text-left">
//           <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
//           <span className="mx-2">/</span>
//           <span className="text-slate-600 dark:text-slate-400">{product.category}</span>
//         </div>

//         {/* DETAILS GRID */}
//         <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start pb-16 border-b border-slate-100 dark:border-slate-800">

//           {/* IMAGE SECTION LEFT BLOCK */}
//           <div className="flex flex-col gap-4 w-full">
//             <div
//               className="relative group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm flex items-center justify-center p-4 sm:p-6 w-full h-[320px] sm:h-[450px] md:h-[480px]"
//               onTouchStart={handleTouchStart}
//               onTouchMove={handleTouchMove}
//               onTouchEnd={handleTouchEnd}
//             >
//               {activeImageSrc && (
//                 <img
//                   src={activeImageSrc}
//                   alt={product.name}
//                   className="w-full h-full max-h-full object-contain rounded-xl sm:rounded-2xl transition-all duration-300 cursor-zoom-in"
//                   onClick={() => setIsZoomOpen(true)}
//                 />
//               )}

//               <div className="absolute top-4 right-4 pointer-events-none bg-slate-900/60 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
//                 </svg>
//               </div>

//               {/* NAVIGATION ARROWS */}
//               {productImagesArray.length > 1 && (
//                 <>
//                   <button
//                     onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 shadow-md md:opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-600 hover:text-white z-10"
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//                     </svg>
//                   </button>
//                   <button
//                     onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 shadow-md md:opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-600 hover:text-white z-10"
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                     </svg>
//                   </button>

//                   {/* BOTTOM DOTS INDICATOR */}
//                   <div className="absolute bottom-4 flex gap-1.5 justify-center z-10 bg-slate-900/40 px-2.5 py-1.5 rounded-full backdrop-blur-sm">
//                     {productImagesArray.map((_, index) => (
//                       <span
//                         key={index}
//                         className={`block h-1.5 rounded-full transition-all ${currentImgIndex === index ? "w-4 bg-purple-500" : "w-1.5 bg-white/60"}`}
//                       />
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* THUMBNAILS CONTAINER */}
//             {productImagesArray.length > 1 && (
//               <div className="flex items-center gap-3 overflow-x-auto py-1 w-full justify-start">
//                 {productImagesArray.map((img, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setCurrentImgIndex(idx)}
//                     className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border-2 transition-all flex-shrink-0 ${currentImgIndex === idx ? "border-purple-500 ring-2 ring-purple-500/20" : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100"
//                       }`}
//                   >
//                     <img src={img.url || product.image} alt="thumbnail" className="w-full h-full object-contain p-1" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* DETAILS RIGHT SIDEBLOCK */}
//           <div className="flex flex-col items-start w-full justify-start pt-2">
//             <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
//               {product.category}
//             </span>

//             <h1 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight text-left w-full">
//               {product.name}
//             </h1>

//             <div className="flex items-center gap-2 mt-3">
//               <div className="flex text-amber-400">
//                 {"★".repeat(5)}
//               </div>
//               <span className="text-slate-400 dark:text-slate-500 text-xs font-bold">
//                 (4.8 out of 5 based on {reviews.length} reviews)
//               </span>
//             </div>

//             <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 font-medium">
//               Product ID: #{product.id}
//             </p>

//             <div className="mt-6 flex items-baseline gap-2">
//               <span className="text-3xl font-black text-slate-900 dark:text-slate-100">${product.price}</span>
//               <span className="text-slate-400 dark:text-slate-500 text-sm line-through">${(product.price * 1.25).toFixed(0)}</span>
//             </div>

//             <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed text-left text-sm font-medium w-full">
//               {product.description || "This high-quality product is designed with precision and style. Features include durable premium materials, modern design aesthetics, and industry-leading utility."}
//             </p>

//             <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
//               <Button
//                 onClick={handleAddToCart}
//                 variant="primary"
//                 size="lg"
//                 className="w-full sm:w-auto px-10 py-3 text-sm sm:text-base"
//               >
//                 Add To Cart
//               </Button>

//               <Button
//                 onClick={() => toggleWishlist(product.id)}
//                 variant={isFavorited ? "secondary" : "outline"}
//                 size="lg"
//                 className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base flex justify-center items-center"
//               >
//                 <svg
//                   className={`w-5 h-5 mr-2 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "text-slate-500 dark:text-slate-400"
//                     }`}
//                   fill={isFavorited ? "currentColor" : "none"}
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                 </svg>
//                 {isFavorited ? "Wishlisted" : "Add to Wishlist"}
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* REVIEWS SECTION */}
//         <div className="py-12 border-b border-slate-100 dark:border-slate-800 grid md:grid-cols-2 gap-12">
//           <div className="space-y-6 text-left">
//             <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100">
//               Customer Reviews ({reviews.length})
//             </h2>

//             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
//               {reviews.length > 0 ? (
//                 reviews.map((rev) => (
//                   <div
//                     key={rev._id || rev.id}
//                     className="bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 p-5 rounded-2xl shadow-sm"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
//                           {rev.name || rev.user?.name || "Anonymous User"}
//                         </h4>
//                         <div className="flex text-amber-400 text-xs mt-1">
//                           {"★".repeat(rev.rating || 5)}{"☆".repeat(5 - (rev.rating || 5))}
//                         </div>
//                       </div>
//                       <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold">
//                         {new Date(rev.createdAt || Date.now()).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
//                       </span>
//                     </div>
//                     <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
//                       {rev.comment}
//                     </p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No reviews yet. Be the first to review this product!</p>
//               )}
//             </div>
//           </div>

//           <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800/60 p-6 rounded-2xl text-left h-fit">
//             <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
//               Write a Review
//             </h3>

//             {token ? (
//               <form onSubmit={handleAddReview} className="space-y-4">
//                 <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
//                   Submitting review as <span className="font-bold text-slate-700 dark:text-slate-200">{user?.name}</span>
//                 </p>

//                 <div className="flex flex-col items-start w-full">
//                   <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
//                     Rating
//                   </label>
//                   <select
//                     value={reviewForm.rating}
//                     onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
//                     className="w-full border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 rounded-xl px-4 py-3 outline-none transition-all duration-200 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
//                   >
//                     <option value="5">5 Stars (Excellent)</option>
//                     <option value="4">4 Stars (Good)</option>
//                     <option value="3">3 Stars (Average)</option>
//                     <option value="2">2 Stars (Poor)</option>
//                     <option value="1">1 Star (Terrible)</option>
//                   </select>
//                 </div>

//                 <div className="flex flex-col items-start w-full">
//                   <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
//                     Comments
//                   </label>
//                   <textarea
//                     placeholder="What did you think of the product?"
//                     value={reviewForm.comment}
//                     onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
//                     rows="4"
//                     className="w-full border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 rounded-xl px-4 py-3 outline-none transition-all duration-200 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 resize-none"
//                     required
//                   ></textarea>
//                 </div>

//                 <Button
//                   type="submit"
//                   variant="primary"
//                   className="w-full mt-2"
//                   disabled={submittingReview}
//                 >
//                   {submittingReview ? "Submitting..." : "Submit Review"}
//                 </Button>
//               </form>
//             ) : (
//               <div className="text-center py-6">
//                 <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
//                   Please log in to submit a review.
//                 </p>
//                 <Link to="/login" className="mt-4 inline-block">
//                   <Button variant="outline" size="sm">
//                     Go to Login
//                   </Button>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* RELATED PRODUCTS */}
//         {related.length > 0 && (
//           <div className="py-12">
//             <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-8 text-left">
//               Related Products
//             </h2>

//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//               {related.map((item) => (
//                 <ProductCard key={item.id} product={item} />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Product;








import { useParams, Link } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { CartContext } from "../context/CartContext";
import Button from "../components/ui/Button";
import ProductCard from "../components/ProductCard";

const Product = () => {
  const { id } = useParams();
  const { addToCart, wishlist, toggleWishlist, isCartOpen, toggleCart, token, user } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  // CAROUSEL & ZOOM MECHANISM STATES
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const [reviewForm, setReviewForm] = useState({ comment: "", rating: 5 });

  const API_URL = import.meta.env.VITE_API_URL;

  // Ref tracker to absolutely prevent double fetch triggers
  const hasFetched = useRef(false);

  const normalizeProduct = (p) => {
    if (!p) return null;
    return {
      id: p.productId || p._id,
      productId: p.productId,
      _id: p._id,
      name: p.title || p.name || "",
      title: p.title || p.name || "",
      price: p.price || 0,
      category: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : "General",
      image: p.images?.[0]?.url || p.image || "",
      images: p.images || [],
      description: p.description || "",
      rating: p.rating || 4.5,
      reviewsCount: p.reviewsCount || 0
    };
  };

  // 🔥 SINGLE MASTER LIFECYCLE HOOK FOR DATA FETCHING
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError("");
      try {
        // 1. Fetch Product Main Details
        const response = await fetch(`${API_URL}/products/${id}`);
        const result = await response.json();

        if (response.ok && result.status === "success") {
          const rawProduct = result.data.product || result.data;
          const normProduct = normalizeProduct(rawProduct);

          if (normProduct) {
            setProduct(normProduct);
            setCurrentImgIndex(0);

            // Concurrently Fetch Reviews and Related Products without making separate standalone effects
            const [reviewsRes, relatedRes] = await Promise.all([
              fetch(`${API_URL}/products/${id}/reviews`).then(res => res.json()).catch(() => null),
              normProduct.category ? fetch(`${API_URL}/products?category=${normProduct.category.toLowerCase()}&limit=4`).then(res => res.json()).catch(() => null) : null
            ]);

            if (reviewsRes && reviewsRes.status === "success") {
              setReviews(reviewsRes.data || []);
            }

            if (relatedRes && relatedRes.status === "success") {
              const filteredRelated = (relatedRes.data.products || [])
                .map(normalizeProduct)
                .filter(p => p && p.id !== normProduct.id);
              setRelated(filteredRelated);
            }
          } else {
            setError("Failed to parse product data");
          }
        } else {
          setError(result.message || "Product not found");
        }
      } catch (err) {
        console.error("Error loading product complete dashboard:", err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id, API_URL]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 w-full min-h-[calc(100vh-64px)] bg-slate-950">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 mt-4 font-bold text-sm">Loading product details...</p>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center min-h-[calc(100vh-64px)] flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold text-slate-200">{error || "Product not found"}</h2>
          <Link to="/" className="mt-4 inline-block text-purple-400 font-semibold hover:underline">
            Back to Home
          </Link>
        </div>
      </>
    );
  }

  const isFavorited = wishlist.some(item => (item.id === product.id || item === product.id || item._id === product._id));

  const handleAddToCart = () => {
    addToCart(product);
    if (!isCartOpen) {
      toggleCart();
    }
  };

  const handleNextImage = () => {
    if (!productImagesArray || productImagesArray.length <= 1) return;
    setCurrentImgIndex((prev) => (prev === productImagesArray.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    if (!productImagesArray || productImagesArray.length <= 1) return;
    setCurrentImgIndex((prev) => (prev === 0 ? productImagesArray.length - 1 : prev - 1));
  };

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) handleNextImage();
    if (distance < -50) handlePrevImage();
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleWheelZoom = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoomScale((prev) => Math.min(prev + 0.2, 4));
    } else {
      setZoomScale((prev) => Math.max(prev - 0.2, 1));
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in to submit a review.");
      return;
    }
    if (!reviewForm.comment.trim()) return;

    setSubmittingReview(true);
    try {
      const response = await fetch(`${API_URL}/products/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment
        })
      });
      const result = await response.json();
      if (response.ok && result.status === "success") {
        const newReview = {
          _id: result.data._id || Date.now().toString(),
          user: { name: user?.name || "Anonymous" },
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
          createdAt: new Date().toISOString()
        };
        setReviews([newReview, ...reviews]);
        setReviewForm({ comment: "", rating: 5 });
      } else {
        alert(result.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const productImagesArray = product.images && product.images.length > 0 ? product.images : [{ url: product.image }];
  const activeImageSrc = productImagesArray[currentImgIndex]?.url || product.image;

  return (
    <>
      <Navbar />

      {/* LIGHTBOX FOR ZOOM */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 select-none cursor-zoom-out"
          onClick={() => { setIsZoomOpen(false); setZoomScale(1); }}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all text-xl font-bold z-[1000]"
            onClick={() => { setIsZoomOpen(false); setZoomScale(1); }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheelZoom}
          >
            <img
              src={activeImageSrc}
              alt="Zoom mode view"
              className="max-w-full max-h-full object-contain origin-center transition-transform duration-150 ease-out cursor-grab active:cursor-grabbing"
              style={{ transform: `scale(${zoomScale})` }}
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-6 text-left">
          <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-600 dark:text-slate-400">{product.category}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start pb-16 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col gap-4 w-full">
            <div
              className="relative group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm flex items-center justify-center p-4 sm:p-6 w-full h-[320px] sm:h-[450px] md:h-[480px]"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {activeImageSrc && (
                <img
                  src={activeImageSrc}
                  alt={product.name}
                  className="w-full h-full max-h-full object-contain rounded-xl sm:rounded-2xl transition-all duration-300 cursor-zoom-in"
                  onClick={() => setIsZoomOpen(true)}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col items-start w-full justify-start pt-2">
            <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight text-left w-full">
              {product.name}
            </h1>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-slate-100">${product.price}</span>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed text-left text-sm font-medium w-full">
              {product.description}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
              <Button onClick={handleAddToCart} variant="primary" size="lg" className="w-full sm:w-auto px-10 py-3 text-sm">
                Add To Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;