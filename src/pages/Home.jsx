import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import Input from "../components/ui/Input";

const API_URL = import.meta.env.VITE_API_URL;
const CACHE_KEY = "shopnpay_products_cache";
const CACHE_TTL = 5 * 60 * 1000;

const CATEGORIES = [
  "All",
  "Shoes",
  "Watch",
  "Phone",
  "Headphones",
  "Laptops",
  "Cameras",
  "Gaming",
  "Accessories",
  "Clothing",
];

const formatCategory = (cat) => {
  if (!cat) return "General";
  return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
};

const normalizeProduct = (p) => {
  if (!p) return null;
  const productId = p.productId || p.id || p._id;
  return {
    id: productId,
    productId,
    _id: p._id || "",
    name: p.name || p.title || "",
    title: p.title || p.name || "",
    price: p.price || 0,
    category: formatCategory(p.category),
    image: p.images?.[0]?.url || p.image || "",
    images: p.images || [],
    description: p.description || "Premium quality build",
    rating: p.rating || 4.5,
  };
};

const readCache = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (!Array.isArray(data) || Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
};

const writeCache = (products) => {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: products, ts: Date.now() })
    );
  } catch {
    /* ignore quota errors */
  }
};

const Home = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [productsList, setProductsList] = useState(() => readCache() || []);
  const [priceRange, setPriceRange] = useState(1000);
  const [initialLoading, setInitialLoading] = useState(() => !readCache());
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const hasDataRef = useRef(!!readCache());

  const maxProductPrice = useMemo(() => {
    return productsList.length > 0
      ? Math.max(...productsList.map((p) => p.price))
      : 1000;
  }, [productsList]);

  useEffect(() => {
    if (maxProductPrice > 0 && priceRange === 1000) {
      setPriceRange(maxProductPrice);
    }
  }, [maxProductPrice, priceRange]);

  const fetchProducts = useCallback(async (isBackground = false) => {
    if (!isBackground) setInitialLoading(true);
    else setRefreshing(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/products?limit=100`);
      const result = await res.json();

      if (res.ok && (result.success || result.status === "success")) {
        const rawArray =
          result.products || result.data?.products || result.data || [];
        const cleanMappedProducts = rawArray.map(normalizeProduct).filter(Boolean);
        setProductsList(cleanMappedProducts);
        writeCache(cleanMappedProducts);
        hasDataRef.current = true;
      } else if (!hasDataRef.current) {
        setError(result.message || "Failed to load products.");
      }
    } catch (err) {
      console.error("Home API failure:", err);
      if (!hasDataRef.current) {
        setError("Unable to connect to the store. Please try again.");
      }
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const cached = readCache();
    fetchProducts(!!cached);
  }, [fetchProducts]);

  const filtered = useMemo(() => {
    let list = [...productsList];

    if (category !== "All") {
      list = list.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    list = list.filter((p) => p.price <= priceRange);

    if (sortBy === "Price: Low to High") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Top Rated") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "NameAZ") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "NameZA") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    }

    return list;
  }, [productsList, category, search, priceRange, sortBy]);

  const hasActiveFilters =
    category !== "All" || search.trim() || priceRange < maxProductPrice;

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSortBy("Featured");
    setPriceRange(maxProductPrice || 1000);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 dark:border-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-slate-50 to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />
        <div className="absolute inset-0 hero-mesh" />
        <div className="absolute top-10 left-[10%] w-48 h-48 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-[15%] w-64 h-64 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-purple-100 dark:border-purple-900/50 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest shadow-sm mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              Premium Collection
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-[1.1]">
              Discover Your Next{" "}
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                Perfect Match
              </span>
            </h1>

            <p className="mt-4 sm:mt-5 text-slate-500 dark:text-slate-400 text-sm sm:text-lg max-w-xl mx-auto font-medium leading-relaxed">
              Curated tech, fashion, and lifestyle products — handpicked for quality and style.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-100 dark:border-slate-800">
                <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                {initialLoading ? "..." : productsList.length} Products
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-100 dark:border-slate-800">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Secure Checkout
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-100 dark:border-slate-800">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Fast Delivery
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filters */}
        <div className="w-full bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800/80 p-5 sm:p-6 rounded-2xl shadow-sm shadow-slate-200/50 dark:shadow-none mb-8 space-y-5 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-end">
            <div className="w-full space-y-1.5">
              <label className="text-[10px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Search Products
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  type="text"
                  placeholder="Search by name, category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 text-xs sm:text-sm bg-slate-50 border-slate-100 dark:bg-slate-950 dark:border-slate-800"
                />
              </div>
            </div>

            <div className="flex flex-col items-start w-full space-y-1.5">
              <label className="text-[10px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex justify-between w-full">
                <span>Max Price</span>
                <span className="text-purple-600 dark:text-purple-400 font-black">${priceRange}</span>
              </label>
              <input
                type="range"
                min="0"
                max={maxProductPrice || 1000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-purple-600 focus:outline-none"
              />
            </div>

            <div className="flex flex-col items-start w-full space-y-1.5">
              <label className="text-[10px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-3 py-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
              >
                <option value="Featured">Featured</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Top Rated">Top Rated</option>
                <option value="NameAZ">Name: A to Z</option>
                <option value="NameZA">Name: Z to A</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Categories
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] sm:text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="w-full overflow-x-auto pb-1 scrollbar-none">
              <div className="flex gap-2 min-w-max md:min-w-0 md:flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold rounded-full border transition-all duration-200 cursor-pointer ${
                      category === cat
                        ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/20 scale-[1.02]"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100">
              {category === "All" ? "All Products" : category}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-0.5">
              {initialLoading
                ? "Loading catalog..."
                : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          {refreshing && (
            <span className="flex items-center gap-2 text-xs font-semibold text-purple-500 dark:text-purple-400">
              <span className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              Updating
            </span>
          )}
        </div>

        {/* Products grid */}
        <div className="w-full">
          {initialLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 max-w-xl mx-auto shadow-sm">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-red-500 font-bold">{error}</p>
              <button
                onClick={() => fetchProducts(false)}
                className="mt-4 px-5 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
              {filtered.map((p, i) => (
                <div
                  key={p.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(i * 40, 320)}ms`, opacity: 0 }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 max-w-xl mx-auto shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300">
                No matching products
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">
                Try adjusting your filters or search terms.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-5 px-5 py-2 text-sm font-bold text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
