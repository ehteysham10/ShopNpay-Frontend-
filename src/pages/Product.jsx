import { useParams, Link } from "react-router-dom";
import { useState, useContext } from "react";
import { products } from "../data/products";
import Navbar from "../components/Navbar";
import { CartContext } from "../context/CartContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Product = () => {
  const { id } = useParams();
  const { addToCart, wishlist, toggleWishlist, isCartOpen, toggleCart } = useContext(CartContext);

  const product = products.find((p) => p.id === Number(id));

  // Reviews state (initial mock reviews)
  const [reviews, setReviews] = useState([
    { id: 1, author: "Alex Mercer", rating: 5, date: "June 2, 2026", comment: "Absolutely incredible! The build quality exceeded my expectations." },
    { id: 2, author: "Sarah Connor", rating: 4, date: "May 28, 2026", comment: "Really solid, handles well. Highly recommend this for daily use." }
  ]);

  const [reviewForm, setReviewForm] = useState({ author: "", comment: "", rating: 5 });

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Product not found</h2>
          <Link to="/" className="mt-4 inline-block text-purple-600 font-semibold hover:underline">
            Back to Home
          </Link>
        </div>
      </>
    );
  }

  const isFavorited = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
    if (!isCartOpen) {
      toggleCart();
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewForm.author.trim() || !reviewForm.comment.trim()) return;

    const newReview = {
      id: Date.now(),
      author: reviewForm.author,
      rating: Number(reviewForm.rating),
      date: new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
      comment: reviewForm.comment
    };

    setReviews([newReview, ...reviews]);
    setReviewForm({ author: "", comment: "", rating: 5 });
  };

  const related = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* BREADCRUMB */}
        <div className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider mb-6 text-left">
          <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-600 dark:text-slate-400">{product.category}</span>
        </div>

        {/* DETAILS GRID */}
        <div className="grid md:grid-cols-2 gap-12 items-center pb-16 border-b border-slate-100 dark:border-slate-800">
          {/* IMAGE */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm flex items-center justify-center p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-h-[500px] object-contain rounded-2xl hover:scale-102 transition-transform duration-300"
            />
          </div>

          {/* DETAILS */}
          <div className="flex flex-col items-start">
            <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
              {product.category}
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight text-left">
              {product.name}
            </h1>

            {/* RATINGS HEADER */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-amber-400">
                {"★".repeat(5)}
              </div>
              <span className="text-slate-400 dark:text-slate-500 text-xs font-bold">
                (4.8 out of 5 based on {reviews.length} reviews)
              </span>
            </div>

            <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 font-medium">
              Product ID: #{product.id}
            </p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-slate-100">${product.price}</span>
              <span className="text-slate-400 dark:text-slate-500 text-sm line-through">${(product.price * 1.25).toFixed(0)}</span>
            </div>

            <p className="mt-6 text-slate-600 dark:text-slate-400 leading-relaxed text-left text-sm font-medium">
              This high-quality product is designed with precision and style. Features include durable premium materials, modern design aesthetics, and industry-leading utility. Perfect for adding value to your daily essentials.
            </p>

            <div className="mt-8 flex gap-4 w-full">
              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-10"
              >
                Add To Cart
              </Button>

              {/* WISHLIST BUTTON */}
              <Button
                onClick={() => toggleWishlist(product)}
                variant={isFavorited ? "secondary" : "outline"}
                size="lg"
                className="px-6"
              >
                <svg
                  className={`w-5 h-5 mr-2 transition-colors ${
                    isFavorited ? "fill-red-500 text-red-500" : "text-slate-500 dark:text-slate-400"
                  }`}
                  fill={isFavorited ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isFavorited ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </div>
          </div>
        </div>

        {/* REVIEWS & FORM */}
        <div className="py-16 border-b border-slate-100 dark:border-slate-800 grid md:grid-cols-2 gap-12">
          {/* REVIEWS LIST */}
          <div className="space-y-6 text-left">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              Customer Reviews ({reviews.length})
            </h2>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 p-5 rounded-2xl shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                        {rev.author}
                      </h4>
                      <div className="flex text-amber-400 text-xs mt-1">
                        {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                      </div>
                    </div>
                    <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold">
                      {rev.date}
                    </span>
                  </div>
                  <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ADD REVIEW FORM */}
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800/60 p-6 sm:p-8 rounded-2xl text-left h-fit">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              Write a Review
            </h3>

            <form onSubmit={handleAddReview} className="space-y-4">
              <Input
                label="Your Name"
                placeholder="John Doe"
                value={reviewForm.author}
                onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                required
              />

              <div className="flex flex-col items-start w-full">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  Rating
                </label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  className="w-full border border-slate-200 dark:border-slate-700 focus:border-transparent focus:ring-2 focus:ring-purple-500 rounded-xl px-4 py-3 outline-none transition-all duration-200 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Good)</option>
                  <option value="3">3 Stars (Average)</option>
                  <option value="2">2 Stars (Poor)</option>
                  <option value="1">1 Star (Terrible)</option>
                </select>
              </div>

              <div className="flex flex-col items-start w-full">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  Comments
                </label>
                <textarea
                  placeholder="What did you think of the product?"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows="4"
                  className="w-full border border-slate-200 dark:border-slate-700 focus:border-transparent focus:ring-2 focus:ring-purple-500 rounded-xl px-4 py-3 outline-none transition-all duration-200 text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 resize-none"
                  required
                ></textarea>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
              >
                Submit Review
              </Button>
            </form>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="py-16">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-8 text-left">
              Related Products
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {related.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden h-48 bg-slate-50 dark:bg-slate-900/40">
                    <Link to={`/product/${item.id}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1 text-left">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 text-left">${item.price}</p>
                    </div>
                    <Link to={`/product/${item.id}`} className="mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        View Product
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Product;