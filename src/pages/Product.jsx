import { useParams, Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
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

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

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
      rating: p.rating || 4.5
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
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-4 dark:text-slate-100">
        {/* PRODUCT SECTION */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* IMAGES */}
          <div className="flex flex-col items-center">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-[400px] object-contain rounded-xl bg-slate-50 dark:bg-slate-900/40 p-4"
            />

            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto w-full py-1">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt=""
                    onClick={() => setCurrentImgIndex(i)}
                    className={`w-16 h-16 object-cover rounded-lg border cursor-pointer transition-all ${i === currentImgIndex
                        ? "border-purple-500 scale-105 shadow-md"
                        : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100"
                      }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-between py-2">
            <div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 tracking-wider uppercase bg-purple-50 dark:bg-purple-950/30 px-2.5 py-1 rounded-md">
                {product.category}
              </span>
              <h1 className="text-3xl font-black mt-3 text-slate-800 dark:text-slate-100">{product.name}</h1>
              <p className="text-2xl font-black mt-2 text-slate-900 dark:text-slate-50">${product.price}</p>
              <p className="mt-5 text-slate-600 dark:text-slate-300 leading-relaxed">{product.description}</p>
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
        <div className="mt-12 border-t border-slate-100 dark:border-slate-800 pt-8">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            Customer Reviews ({reviews.length})
          </h2>

          <div className="space-y-4 mt-4">
            {reviewsLoading ? (
              <p className="text-sm text-slate-400">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No reviews yet for this product.</p>
            ) : (
              reviews.map((r) => (
                <div key={r._id} className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-sm text-slate-700 dark:text-slate-200">
                      {r.user?.name || "Verified Buyer"}
                    </p>
                    <span className="text-amber-400 text-xs">{"★".repeat(r.rating || 5)}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{r.comment}</p>
                </div>
              ))
            )}
          </div>

          {token && (
            <form
              onSubmit={handleAddReview}
              className="mt-6 space-y-3 bg-slate-50 dark:bg-slate-900/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800"
            >
              <h3 className="text-sm font-bold">Write a Review</h3>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                  className="border dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 rounded-md text-sm"
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
                  className="border dark:border-slate-700 bg-white dark:bg-slate-800 w-full p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          <div className="mt-16 border-t border-slate-100 dark:border-slate-800 pt-8">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">
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
    </>
  );
};

export default Product;