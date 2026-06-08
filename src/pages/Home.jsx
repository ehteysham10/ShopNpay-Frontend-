import { useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Input from "../components/ui/Input";
import { products } from "../data/products";

const Home = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");

  // Dynamically calculate max price from the product catalogue
  const maxProductPrice = Math.max(...products.map((p) => p.price));
  const [priceRange, setPriceRange] = useState(maxProductPrice);

  const categories = ["All", "Shoes", "Watch", "Phone", "Headphones", "Laptops", "Cameras", "Gaming", "Accessories"];

  // Filter products by category, search text, and price range
  const filtered = products.filter((p) => {
    return (
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      p.price <= priceRange
    );
  });

  // Sort products dynamically
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "PriceLowToHigh") return a.price - b.price;
    if (sortBy === "PriceHighToLow") return b.price - a.price;
    if (sortBy === "NameAZ") return a.name.localeCompare(b.name);
    if (sortBy === "NameZA") return b.name.localeCompare(a.name);
    return 0; // Featured / Default sorting
  });

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <div className="bg-gradient-to-b from-purple-50/50 to-slate-50 dark:from-slate-900/50 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 py-16 px-6 text-center transition-colors duration-300">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Discover Your Next{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Perfect Match
            </span>
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Explore our premium collection of tech, fashion, and lifestyle products curated just for you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* CONTROLS PANEL */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm mb-10 space-y-6 transition-colors duration-300">
          <div className="grid md:grid-cols-3 gap-6 items-end">
            {/* SEARCH */}
            <div>
              <Input
                label="Search Products"
                type="text"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* PRICE RANGE FILTER */}
            <div className="flex flex-col items-start w-full">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2.5 uppercase tracking-wider flex justify-between w-full">
                <span>Max Price</span>
                <span className="text-purple-600 dark:text-purple-400 font-extrabold">${priceRange}</span>
              </label>
              <input
                type="range"
                min="0"
                max={maxProductPrice}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none"
              />
            </div>

            {/* SORTING SELECT */}
            <div className="flex flex-col items-start">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 focus:border-transparent focus:ring-2 focus:ring-purple-500 rounded-xl px-4 py-3 outline-none transition-all duration-200 text-sm bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-100 cursor-pointer"
              >
                <option value="Featured">Featured</option>
                <option value="PriceLowToHigh">Price: Low to High</option>
                <option value="PriceHighToLow">Price: High to Low</option>
                <option value="NameAZ">Name: A to Z</option>
                <option value="NameZA">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* CATEGORIES PILLS */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col items-start">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
              Category
            </span>
            <div className="flex gap-2 overflow-x-auto w-full pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2.5 text-sm font-bold rounded-full border transition-all duration-200 cursor-pointer ${
                    category === cat
                      ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-100 dark:shadow-none"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {sorted.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {sorted.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 max-w-xl mx-auto shadow-sm">
            <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No products found</h3>
            <p className="text-slate-400 dark:text-slate-500 mt-2 text-xs">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;