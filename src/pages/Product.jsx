import { useParams, Link } from "react-router-dom";
import { useState, useContext, useEffect, useMemo, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import { CartContext } from "../context/CartContext";
import Button from "../components/ui/Button";
import ProductCard from "../components/ProductCard";

const Product = () => {
  const { id } = useParams();
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    isCartOpen,
    toggleCart,
    token
  } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  const displayRating = product?.rating || averageRating;

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // ---- Zoom / Lightbox state ----
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [dragStart, setDragStart] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const imgRef = useRef(null);

  const openZoom = () => { setZoomOpen(true); setZoomScale(1); setOffset({ x: 0, y: 0 }); };
  const closeZoom = () => { setZoomOpen(false); setZoomScale(1); setOffset({ x: 0, y: 0 }); };
  const zoomIn = (e) => { e.stopPropagation(); setZoomScale(s => Math.min(s + 0.5, 5)); };
  const zoomOut = (e) => { e.stopPropagation(); setZoomScale(s => { const next = Math.max(s - 0.5, 1); if (next === 1) setOffset({ x: 0, y: 0 }); return next; }); };
  const resetZoom = (e) => { e.stopPropagation(); setZoomScale(1); setOffset({ x: 0, y: 0 }); };

  // Keyboard nav in lightbox
  useEffect(() => {
    if (!zoomOpen) return;
    const handler = (e) => {
      // derive count safely from product state (images defined later in render)
      const imgCount = product?.images?.length > 0 ? product.images.length : 1;
      if (e.key === 'Escape') closeZoom();
      if (e.key === 'ArrowRight') setCurrentImgIndex(i => (i + 1) % imgCount);
      if (e.key === 'ArrowLeft') setCurrentImgIndex(i => (i - 1 + imgCount) % imgCount);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomOpen, product]);

  // Drag-to-pan when zoomed
  const onMouseDown = (e) => { if (zoomScale > 1) { e.preventDefault(); setDragging(true); setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y }); } };
  const onMouseMove = useCallback((e) => { if (dragging && dragStart) setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }, [dragging, dragStart]);
  const onMouseUp = () => { setDragging(false); };

  const [reviewForm, setReviewForm] = useState({
    comment: "",
    rating: 5
  });

  const API_URL = import.meta.env.VITE_API_URL;

  // 100% Secure normalization function to map data safely
  const normalizeProduct = (p) => {
    if (!p) return null;
    const productId = p.productId || p.id || p._id || id;
    return {
      id: productId,
      productId,
      _id: p._id || "",
      name: p.title || p.name || "",
      title: p.title || p.name || "",
      price: p.price || 0,
      category: p.category
        ? p.category.charAt(0).toUpperCase() + p.category.slice(1)
        : "General",
      image: p.images?.[0]?.url || p.image || "",
      images: p.images || [],
      description: p.description || "",
      rating: p.rating || null
    };
  };

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id || id === "undefined") {
        setError("Invalid parameter link: Product ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const result = await res.json();

        console.log("PRODUCT API RESPONSE:", result);

        if (res.ok && (result.success || result.status === "success")) {
          const raw = result.product || result.data;
          const norm = normalizeProduct(raw);

          setProduct(norm);
          setCurrentImgIndex(0);

          // Related Products Fetch
          if (norm?.category) {
            try {
              const relRes = await fetch(
                `${API_URL}/products?category=${norm.category.toLowerCase()}&limit=5`
              );
              const relResult = await relRes.json();

              if (relRes.ok) {
                // Safeguard against any backend key structure variations
                let rawProducts = [];
                if (Array.isArray(relResult)) {
                  rawProducts = relResult;
                } else if (Array.isArray(relResult.products)) {
                  rawProducts = relResult.products;
                } else if (Array.isArray(relResult.data)) {
                  rawProducts = relResult.data;
                } else if (relResult.data && Array.isArray(relResult.data.products)) {
                  rawProducts = relResult.data.products;
                }

                const filtered = rawProducts
                  .map(normalizeProduct)
                  .filter((p) => p && p.productId !== norm.productId);

                setRelated(filtered);
              }
            } catch (relErr) {
              console.error("Related products fetch failed silently:", relErr);
              setRelated([]); // Fallback to empty array so page doesn't crash
            }
          }
        } else {
          setError(result.message || "Product not found");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, API_URL]);

  // ================= FETCH REVIEWS =================
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id || id === "undefined") return;
      setReviewsLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/${id}/reviews`);
        const result = await res.json();

        if (res.ok && (result.success || result.status === "success")) {
          setReviews(result.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id, API_URL]);

  // ================= LOADING =================
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-[70vh] text-slate-800 dark:text-slate-100 font-medium">
          Loading product...
        </div>
      </>
    );
  }

  // ================= ERROR =================
  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 space-y-4">
          <h2 className="text-xl text-red-500 font-semibold">{error || "Product not found"}</h2>
          <Link to="/" className="text-purple-500 hover:underline inline-block font-medium">
            Back Home
          </Link>
        </div>
      </>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ url: product.image }];

  const activeImage = images[currentImgIndex]?.url;

  const isFavorited = wishlist.some(
    (item) =>
      item === product.productId ||
      item === product.id ||
      (item && (item.id === product.productId || item.productId === product.productId)) ||
      (item && item._id === product._id)
  );

  const handleAddToCart = () => {
    if (!token) {
      addToCart(product);
      return;
    }
    addToCart(product);
    if (!isCartOpen) toggleCart();
  };

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!token) return alert("Login required");
    if (!reviewForm.comment.trim()) return;

    setSubmittingReview(true);

    try {
      const res = await fetch(
        `${API_URL}/products/${id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            rating: Number(reviewForm.rating),
            comment: reviewForm.comment
          })
        }
      );

      const result = await res.json();

      if (res.ok && (result.success || result.status === "success")) {
        setReviews([result.data, ...reviews]);
        setReviewForm({ comment: "", rating: 5 });
      } else {
        alert(result.message || "Failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="w-full min-h-screen pb-16 transition-colors duration-300" style={{ background: '#FAFAF8' }}>
      <Navbar />

      <div className="max-w-6xl mx-auto p-4 pt-8" style={{ color: '#2C2416' }}>
        {/* PRODUCT SECTION */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* IMAGES */}
          <div className="flex flex-col items-center">

            {/* Main image with arrow nav */}
            <div className="relative w-full group">
              <img
                src={activeImage}
                alt={product.name}
                onClick={openZoom}
                className="w-full h-[400px] object-contain rounded-xl p-4 cursor-zoom-in transition-transform duration-200"
                style={{ background: '#F5F0E8' }}
              />

              {/* Zoom hint */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(44,36,22,0.7)', color: '#FEF3C7' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                Click to zoom
              </div>

              {/* LEFT Arrow */}
              {images.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(i => (i - 1 + images.length) % images.length); setZoomScale(1); setOffset({x:0,y:0}); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid #EDE5D8', color: '#2C2416' }}
                  aria-label="Previous image"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
              )}

              {/* RIGHT Arrow */}
              {images.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(i => (i + 1) % images.length); setZoomScale(1); setOffset({x:0,y:0}); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid #EDE5D8', color: '#2C2416' }}
                  aria-label="Next image"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              )}

              {/* Dot indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(i); }}
                      className="w-2 h-2 rounded-full transition-all duration-200"
                      style={{ background: i === currentImgIndex ? '#8B6914' : '#C4B79A', transform: i === currentImgIndex ? 'scale(1.3)' : 'scale(1)' }}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto w-full py-1">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt=""
                    onClick={() => setCurrentImgIndex(i)}
                    className={`w-16 h-16 object-cover rounded-lg border cursor-pointer transition-all flex-shrink-0 ${
                      i === currentImgIndex
                        ? "scale-105 shadow-md"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    style={i === currentImgIndex
                      ? { borderColor: '#8B6914', borderWidth: '2px' }
                      : { borderColor: '#EDE5D8' }
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* ===== ZOOM LIGHTBOX MODAL ===== */}
          {zoomOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
              onClick={closeZoom}
            >
              {/* Toolbar */}
              <div
                className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-2xl z-10 shadow-xl"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
                onClick={e => e.stopPropagation()}
              >
                {/* Zoom Out */}
                <button onClick={zoomOut} disabled={zoomScale <= 1} className="w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:scale-110 active:scale-95 disabled:opacity-30" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }} title="Zoom out">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </button>

                {/* Scale indicator */}
                <button onClick={resetZoom} className="text-xs font-bold px-2 rounded-lg py-1 transition hover:bg-white/20" style={{ color: '#fff', minWidth: '44px' }} title="Reset zoom">
                  {Math.round(zoomScale * 100)}%
                </button>

                {/* Zoom In */}
                <button onClick={zoomIn} disabled={zoomScale >= 5} className="w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:scale-110 active:scale-95 disabled:opacity-30" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }} title="Zoom in">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </button>

                <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.25)', margin: '0 4px' }} />

                {/* Image counter */}
                {images.length > 1 && (
                  <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>{currentImgIndex + 1} / {images.length}</span>
                )}

                {/* Close */}
                <button onClick={closeZoom} className="w-9 h-9 flex items-center justify-center rounded-xl ml-1 transition-all hover:scale-110 active:scale-95" style={{ background: 'rgba(255,80,80,0.25)', color: '#fff' }} title="Close (Esc)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {/* Prev arrow in lightbox */}
              {images.length > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); setCurrentImgIndex(i => (i - 1 + images.length) % images.length); setZoomScale(1); setOffset({x:0,y:0}); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 z-10"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', backdropFilter: 'blur(4px)' }}
                  aria-label="Previous image"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
              )}

              {/* Zoomed image */}
              <div
                className="relative flex items-center justify-center"
                style={{ width: '90vw', height: '90vh', overflow: 'hidden' }}
                onClick={e => e.stopPropagation()}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
              >
                <img
                  ref={imgRef}
                  src={activeImage}
                  alt={product.name}
                  onMouseDown={onMouseDown}
                  className="max-w-full max-h-full object-contain rounded-lg select-none transition-transform duration-150"
                  style={{
                    transform: `scale(${zoomScale}) translate(${offset.x / zoomScale}px, ${offset.y / zoomScale}px)`,
                    cursor: zoomScale > 1 ? (dragging ? 'grabbing' : 'grab') : 'default',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
                  }}
                  draggable={false}
                />
              </div>

              {/* Next arrow in lightbox */}
              {images.length > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); setCurrentImgIndex(i => (i + 1) % images.length); setZoomScale(1); setOffset({x:0,y:0}); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 z-10"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', backdropFilter: 'blur(4px)' }}
                  aria-label="Next image"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              )}

              {/* Dot indicators in lightbox */}
              {images.length > 1 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2" onClick={e => e.stopPropagation()}>
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setCurrentImgIndex(i); setZoomScale(1); setOffset({x:0,y:0}); }}
                      className="w-2.5 h-2.5 rounded-full transition-all duration-200"
                      style={{ background: i === currentImgIndex ? '#F5D27A' : 'rgba(255,255,255,0.35)', transform: i === currentImgIndex ? 'scale(1.4)' : 'scale(1)' }}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DETAILS */}
          <div className="flex flex-col justify-between py-2">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-md"
                  style={{ color: '#8B6914', background: '#FEF3C7', border: '1px solid #FDE68A' }}
                >
                  {product.category}
                </span>
                {displayRating && displayRating > 0 && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border" style={{ background: '#FAF7F2', borderColor: '#EDE5D8' }}>
                    <span className="text-amber-500">★</span>
                    <span style={{ color: '#2C2416' }}>{Number(displayRating).toFixed(1)}</span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-black mt-3" style={{ color: '#2C2416' }}>{product.name}</h1>
              <p className="text-2xl font-black mt-2" style={{ color: '#8B6914' }}>${product.price}</p>
              
              <div className="mt-6 border-t border-stone-200/60 pt-5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: '#A08B70' }}>
                  Description
                </h4>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#4A3D2C', whiteSpace: 'pre-wrap' }}>
                  {product.description || "No description available for this premium quality build."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button onClick={handleAddToCart} className="flex-1 py-3 font-bold text-sm">
                Add to Cart
              </Button>

              <Button
                onClick={() => toggleWishlist(product.productId || product.id)}
                variant={isFavorited ? "secondary" : "outline"}
                className="px-6 py-3"
              >
                {isFavorited ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </div>
          </div>
        </div>

        {/* CUSTOMER REVIEWS */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid #EDE5D8' }}>
          <h2 className="text-2xl font-extrabold" style={{ color: '#2C2416' }}>
            Customer Reviews ({reviews.length})
          </h2>

          <div className="space-y-4 mt-4">
            {reviewsLoading ? (
              <p className="text-sm text-slate-400">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No reviews yet for this product.</p>
            ) : (
              reviews.map((r) => (
                <div key={r._id} className="p-4 rounded-xl" style={{ background: '#FAF7F2', border: '1px solid #EDE5D8' }}>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-sm" style={{ color: '#2C2416' }}>
                      {r.user?.name || "Verified Buyer"}
                    </p>
                    <span className="text-amber-400 text-xs">{"★".repeat(r.rating || 5)}</span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: '#4A3D2C' }}>{r.comment}</p>
                </div>
              ))
            )}
          </div>

          {token && (
            <form
              onSubmit={handleAddReview}
              className="mt-6 space-y-3 p-4 rounded-xl"
              style={{ background: '#FAF7F2', border: '1px solid #EDE5D8' }}
            >
              <h3 className="text-sm font-bold">Write a Review</h3>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                  className="p-1.5 rounded-md text-sm"
                  style={{ border: '1px solid #EDE5D8', background: '#FFFFFF', color: '#2C2416' }}
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      comment: e.target.value
                    })
                  }
                  rows="3"
                  placeholder="Share your thoughts about this product..."
                  className="w-full p-2.5 rounded-lg text-sm focus:outline-none"
                  style={{ border: '1px solid #EDE5D8', background: '#FFFFFF', color: '#2C2416' }}
                />
              </div>

              <Button type="submit" className="px-4 py-2 text-xs font-bold">
                {submittingReview ? "Posting..." : "Post Review"}
              </Button>
            </form>
          )}
        </div>

        {/* RELATED PRODUCTS */}
        {related && related.length > 0 && (
          <div className="mt-16 pt-8" style={{ borderTop: '1px solid #EDE5D8' }}>
            <h2 className="text-2xl font-extrabold mb-6" style={{ color: '#2C2416' }}>
              Related Products
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;