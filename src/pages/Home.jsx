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
    <div className="w-full max-w-full overflow-x-hidden min-h-screen transition-colors duration-300" style={{ background: '#FAFAF8' }}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-stone-100">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #FDFCFB 0%, #F5F3F0 50%, #FAF8F5 100%)' }} />
        <div className="absolute inset-0 hero-mesh" />
        <div className="absolute top-10 left-[10%] w-48 h-48 rounded-full blur-3xl" style={{ background: 'rgba(210, 193, 173, 0.15)' }} />
        <div className="absolute bottom-0 right-[15%] w-64 h-64 rounded-full blur-3xl" style={{ background: 'rgba(180, 160, 140, 0.1)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text & Badges */}
            <div className="lg:col-span-6 space-y-6 text-left animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-sm border text-xs font-bold uppercase tracking-widest shadow-sm" style={{ background: 'rgba(255,255,255,0.85)', borderColor: '#E8E0D6', color: '#8B7355' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C4A882' }} />
                Premium Collection
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]" style={{ color: '#2C2416' }}>
                Discover Your Next<br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #8B6914 0%, #C4954A 50%, #8B6914 100%)' }}>
                  Perfect Match
                </span>
              </h1>

              <p className="text-sm sm:text-lg font-medium leading-relaxed max-w-xl" style={{ color: '#7A6A55' }}>
                Curated tech, fashion, and lifestyle products — handpicked for quality and style.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold" style={{ color: '#7A6A55' }}>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-sm border bg-white/60" style={{ borderColor: '#E8DDD0' }}>
                  <svg className="w-4 h-4" style={{ color: '#C4954A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  72-Hours Delivery
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-sm border bg-white/60" style={{ borderColor: '#E8DDD0' }}>
                  <svg className="w-4 h-4" style={{ color: '#6B9E7A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Secure Checkout
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-sm border bg-white/60" style={{ borderColor: '#E8DDD0' }}>
                  <svg className="w-4 h-4" style={{ color: '#7B9E87' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Fast Delivery
                </span>
              </div>
            </div>

            {/* Right Column: Beautiful Product Collage */}
            <div className="lg:col-span-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <div className="grid grid-cols-3 gap-3 md:gap-4 max-h-[450px]">
                <div className="relative group overflow-hidden rounded-2xl shadow-md border" style={{ borderColor: 'rgba(237, 229, 216, 0.4)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=400&h=800&q=80" 
                    alt="Minimalist Gold Watch" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ aspectRatio: '2/3' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 to-transparent pointer-events-none" />
                </div>
                <div className="relative group overflow-hidden rounded-2xl shadow-md border" style={{ borderColor: 'rgba(237, 229, 216, 0.4)', transform: 'translateY(16px)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&h=800&q=80" 
                    alt="Leather Sneakers" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ aspectRatio: '2/3' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 to-transparent pointer-events-none" />
                </div>
                <div className="relative group overflow-hidden rounded-2xl shadow-md border" style={{ borderColor: 'rgba(237, 229, 216, 0.4)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=400&h=800&q=80" 
                    alt="Sleek Laptop" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ aspectRatio: '2/3' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURED CATEGORIES GRID ─────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#C4A882' }}>Browse by</p>
            <h2 className="text-2xl sm:text-3xl font-black" style={{ color: '#2C2416' }}>Featured Categories</h2>
          </div>
          <span className="text-xs font-semibold hidden sm:block" style={{ color: '#A08B70' }}>
            Click a category to explore →
          </span>
        </div>

        {/* Large top row: 3 cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
          {[
            { cat: 'Shoes',       label: 'Curated Shoes',       sub: 'Everyday Elegance',  img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&h=520&q=80' },
            { cat: 'Watch',       label: 'Fine Watches',        sub: 'Timeless Precision',  img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=520&q=80' },
            { cat: 'Accessories', label: 'Accessories',         sub: 'Polish Your Look',    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&h=520&q=80' },
          ].map(({ cat, label, sub, img }) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="relative group overflow-hidden rounded-2xl cursor-pointer text-left"
              style={{ height: '220px', boxShadow: '0 4px 24px rgba(44,36,22,0.10)' }}
            >
              <img src={img} alt={label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(44,36,22,0.75) 0%, rgba(44,36,22,0.10) 60%, transparent 100%)' }} />
              <div className="absolute bottom-0 left-0 p-4 sm:p-5">
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,220,150,0.85)' }}>{sub}</p>
                <p className="text-sm sm:text-base md:text-lg font-black text-white leading-tight">{label}</p>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-2xl transition-all duration-300" />
            </button>
          ))}
        </div>

        {/* Bottom row: 4 smaller cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { cat: 'Headphones', label: 'Headphones',  sub: 'Premium Audio',    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=400&q=80' },
            { cat: 'Laptops',    label: 'Laptops',     sub: 'Powerful Machines', img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&h=400&q=80' },
            { cat: 'Cameras',    label: 'Cameras',     sub: 'Capture Moments',   img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&h=400&q=80' },
            { cat: 'Gaming',     label: 'Gaming',      sub: 'Level Up',          img: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=600&h=400&q=80' },
            { cat: 'Phone',      label: 'Phones',      sub: 'Stay Connected',    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&h=400&q=80' },
            { cat: 'Clothing',   label: 'Clothing',    sub: 'Define Your Style', img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&h=400&q=80' },
          ].map(({ cat, label, sub, img }) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="relative group overflow-hidden rounded-2xl cursor-pointer text-left"
              style={{ height: '150px', boxShadow: '0 4px 24px rgba(44,36,22,0.10)' }}
            >
              <img src={img} alt={label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(44,36,22,0.72) 0%, rgba(44,36,22,0.05) 70%, transparent 100%)' }} />
              <div className="absolute bottom-0 left-0 p-3 sm:p-4">
                <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,220,150,0.85)' }}>{sub}</p>
                <p className="text-xs sm:text-sm font-black text-white leading-tight">{label}</p>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-2xl transition-all duration-300" />
            </button>
          ))}
        </div>
      </section>

      {/* ── FILTER WORKSPACE + PRODUCTS ──────────────────────────── */}
      <div id="products-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filters */}

        <div className="w-full p-5 sm:p-6 rounded-2xl mb-8 space-y-5" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid #EDE5D8', boxShadow: '0 2px 16px rgba(139,107,68,0.07)' }}>
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
              <label className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider flex justify-between w-full" style={{ color: '#A08B70' }}>
                <span>Max Price</span>
                <span className="font-black" style={{ color: '#8B6914' }}>${priceRange}</span>
              </label>
              <input
                type="range"
                min="0"
                max={maxProductPrice || 1000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none"
                style={{ background: '#EDE5D8', accentColor: '#8B6914' }}
              />
            </div>

            <div className="flex flex-col items-start w-full space-y-1.5">
              <label className="text-[10px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl px-3 py-3 text-xs sm:text-sm font-semibold focus:outline-none transition-all cursor-pointer"
                style={{ background: '#FAF7F2', border: '1px solid #EDE5D8', color: '#4A3D2C' }}
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

        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-xl font-black" style={{ color: '#2C2416' }}>
                {category === "All" ? "All Products" : category}
              </h2>
              {category !== "All" && (
                <button
                  onClick={() => setCategory("All")}
                  className="px-2.5 py-1 text-[10px] font-bold rounded-full border transition-all duration-200 cursor-pointer"
                  style={{ background: '#FAF7F2', borderColor: '#E8DDD0', color: '#8B6914' }}
                >
                  Clear filter ×
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#A08B70' }}>
              {initialLoading
                ? "Loading catalog..."
                : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          {refreshing && (
            <span className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#8B6914' }}>
              <span className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#8B6914', borderTopColor: 'transparent' }} />
              Updating
            </span>
          )}
        </div>

        {/* Products grid */}
        <div className="w-full">
          {initialLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 rounded-3xl p-8 max-w-xl mx-auto" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid #EDE5D8', boxShadow: '0 2px 16px rgba(139,107,68,0.07)' }}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: '#FEF2F2' }}>
                <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-red-500 font-bold">{error}</p>
              <button
                onClick={() => fetchProducts(false)}
                className="mt-4 px-5 py-2 text-sm font-bold text-white rounded-xl transition-colors cursor-pointer"
                style={{ background: '#8B6914' }}
              >
                Try Again
              </button>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
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
            <div className="text-center py-20 rounded-3xl p-8 max-w-xl mx-auto" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid #EDE5D8', boxShadow: '0 2px 16px rgba(139,107,68,0.07)' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: '#FAF7F2' }}>
                <svg className="w-8 h-8" style={{ color: '#C4A882' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold" style={{ color: '#4A3D2C' }}>
                No matching products
              </h3>
              <p className="text-xs sm:text-sm mt-1" style={{ color: '#A08B70' }}>
                Try adjusting your filters or search terms.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-5 px-5 py-2 text-sm font-bold rounded-xl transition-colors cursor-pointer"
                  style={{ color: '#8B6914', border: '1px solid #E8DDD0' }}
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
