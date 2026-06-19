import { useContext } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { products } from "../data/products";

const Wishlist = () => {
  const { wishlist } = useContext(CartContext);

  // Resolve ID array to full product objects (backward compatible with objects)
  const wishlistProducts = wishlist
    .map((item) => {
      if (item && typeof item === "object") {
        return item;
      }
      return products.find((p) => p.id === item);
    })
    .filter((p) => p !== undefined);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF8', color: '#2C2416' }}>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="flex justify-between items-center mb-8 pb-5" style={{ borderBottom: '1px solid #EDE5D8' }}>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#2C2416' }}>
            My Wishlist
          </h1>
          <span
            className="text-xs font-extrabold px-3 py-1 rounded-full"
            style={{ background: '#FEF3C7', color: '#8B6914', border: '1px solid #FDE68A' }}
          >
            {wishlistProducts.length} Items
          </span>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20 rounded-3xl p-8 shadow-sm max-w-xl mx-auto" style={{ background: '#FFFFFF', border: '1px solid #EDE5D8' }}>
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: '#C4A882' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-xl font-bold" style={{ color: '#2C2416' }}>Your wishlist is empty</h2>
            <p className="mt-2 text-sm" style={{ color: '#A08B70' }}>Save items you love here to shop them later.</p>
            <Link to="/" className="mt-6 inline-block">
              <Button variant="primary">Explore Store</Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {wishlistProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
