import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const Wishlist = () => {
  const { wishlist } = useContext(CartContext);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-5">
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            My Wishlist
          </h1>
          <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-extrabold px-3 py-1 rounded-full">
            {wishlist.length} Items
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm max-w-xl mx-auto">
            <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Your wishlist is empty</h2>
            <p className="text-slate-400 dark:text-slate-500 mt-2 text-sm">Save items you love here to shop them later.</p>
            <Link to="/" className="mt-6 inline-block">
              <Button variant="primary">Explore Store</Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {wishlist.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
