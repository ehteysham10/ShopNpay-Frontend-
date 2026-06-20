import { useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import Input from "../components/ui/Input";

const API_URL = import.meta.env.VITE_API_URL;
const CACHE_KEY = "shopnpay_products_cache";
const CACHE_TTL = 10 * 60 * 1000; // 10 min cache

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
    rating: p.rating || null,
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

// Note: backend warm-up ping is fired from main.jsx before React renders.

const Home = () => {
  const cachedData = useRef(readCache());
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [productsList, setProductsList] = useState(() => cachedData.current || []);
  const [priceRange, setPriceRange] = useState(1000);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState(1000);

  // Pagination states
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [isBackendPaginated, setIsBackendPaginated] = useState(false);
  const [backendMaxPrice, setBackendMaxPrice] = useState(1000);

  // Only show skeleton if we have NO cached data at all
  const [initialLoading, setInitialLoading] = useState(() => !cachedData.current);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  // Show a friendly banner if the server takes > 4s (Render cold-start)
  const [slowLoad, setSlowLoad] = useState(false);

  const hasDataRef = useRef(!!cachedData.current);
  const fetchControllerRef = useRef(null);
  const isFirstRender = useRef(true);
  const slowTimerRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Debounce price range
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 400);
    return () => clearTimeout(timer);
  }, [priceRange]);

  const maxProductPrice = useMemo(() => {
    if (isBackendPaginated) {
      return backendMaxPrice;
    }
    return productsList.length > 0
      ? Math.max(...productsList.map((p) => p.price))
      : 1000;
  }, [productsList, isBackendPaginated, backendMaxPrice]);

  useEffect(() => {
    if (maxProductPrice > 0 && priceRange === 1000) {
      setPriceRange(maxProductPrice);
      setDebouncedPriceRange(maxProductPrice);
    }
  }, [maxProductPrice, priceRange]);

  const fetchProducts = useCallback(async ({ isBackground = false, cursor = null, reset = false } = {}) => {
    // Abort any in-flight request
    if (fetchControllerRef.current) fetchControllerRef.current.abort();
    const controller = new AbortController();
    fetchControllerRef.current = controller;

    if (!isBackground) {
      if (reset) setInitialLoading(true);
      else setMoreLoading(true);
    } else {
      setRefreshing(true);
    }
    setError("");

    try {
      let url = `${API_URL}/products?limit=12`;
      if (cursor) {
        url += `&cursor=${cursor}`;
      }
      if (category !== "All") {
        url += `&category=${encodeURIComponent(category)}`;
      }
      if (debouncedSearch.trim()) {
        url += `&search=${encodeURIComponent(debouncedSearch.trim())}`;
      }
      if (sortBy) {
        url += `&sortBy=${encodeURIComponent(sortBy)}`;
      }
      // Only filter by price if it has been adjusted below max
      if (debouncedPriceRange && debouncedPriceRange < maxProductPrice) {
        url += `&maxPrice=${debouncedPriceRange}`;
      }

      const res = await fetch(url, {
        signal: controller.signal,
      });
      const result = await res.json();

      if (res.ok && (result.success || result.status === "success")) {
        const rawArray =
          result.products || result.data?.products || result.data || [];
        const cleanMappedProducts = rawArray.map(normalizeProduct).filter(Boolean);
        
        setProductsList((prev) => {
          const newList = reset ? cleanMappedProducts : [...prev, ...cleanMappedProducts];
          if (reset && !cursor) {
            writeCache(newList);
          }
          return newList;
        });

        if (result.maxPrice) {
          setBackendMaxPrice(result.maxPrice);
        }

        // Support both old backend (no cursor) and new cursor backend
        setNextCursor(result.nextCursor || null);
        setHasMore(!!result.hasMore);
        setIsBackendPaginated(result.nextCursor !== undefined || result.hasMore !== undefined);
        hasDataRef.current = true;
      } else if (!hasDataRef.current) {
        setError(result.message || "Failed to load products.");
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Home API failure:", err);
      if (!hasDataRef.current) {
        setError("Unable to connect to the store. Please try again.");
      }
    } finally {
      setInitialLoading(false);
      setMoreLoading(false);
      setRefreshing(false);
    }
  }, [category, debouncedSearch, sortBy, debouncedPriceRange, maxProductPrice]);

  // On mount: fetch initial page (background if cached); show slow-load banner after 4s
  useEffect(() => {
    fetchProducts({ isBackground: !!cachedData.current, cursor: null, reset: true });
    // If no cached data, show a "server waking up" message after 4s
    if (!cachedData.current) {
      slowTimerRef.current = setTimeout(() => setSlowLoad(true), 4000);
    }
    return () => {
      fetchControllerRef.current?.abort();
      clearTimeout(slowTimerRef.current);
    };
  }, []);

  // Clear the slow-load banner once data arrives
  useEffect(() => {
    if (!initialLoading) {
      setSlowLoad(false);
      clearTimeout(slowTimerRef.current);
    }
  }, [initialLoading]);

  // On filter/sort change: refetch first page (except on mount)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchProducts({ cursor: null, reset: true });
  }, [category, debouncedSearch, sortBy, debouncedPriceRange]);

  const filtered = useMemo(() => {
    if (isBackendPaginated) {
      return productsList;
    }

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
  }, [productsList, category, search, priceRange, sortBy, isBackendPaginated]);

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

      {/* Hero — Full Viewport */}
      <section className="relative overflow-hidden" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #FDFCFB 0%, #F5F2EE 45%, #FAF6F0 100%)' }} />
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(196,168,130,0.10)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(139,105,68,0.07)' }} />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-12 lg:py-0">

            {/* ── LEFT: Text ─────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="flex flex-col gap-6"
            >
              {/* Badge */}
              <span className="inline-flex w-fit items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border shadow-sm" style={{ background: 'rgba(255,255,255,0.9)', borderColor: '#E8DDD0', color: '#8B7355' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C4A882' }} />
                Premium Collection · 2025
              </span>

              {/* Headline */}
              <h1 className="font-black tracking-tight leading-[1.08]" style={{ color: '#1E1810', fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}>
                Discover<br />Your Next<br />
                <span style={{ backgroundImage: 'linear-gradient(130deg, #8B6914 0%, #D4A843 50%, #8B6914 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Perfect Match.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg leading-relaxed max-w-md font-medium" style={{ color: '#7A6A55' }}>
                Curated tech, fashion and lifestyle products — handpicked for quality, delivered fast.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-100"
                  style={{ background: 'linear-gradient(135deg, #8B6914 0%, #C4954A 100%)', boxShadow: '0 8px 24px rgba(139,105,20,0.35)' }}
                >
                  Shop Now
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
                <button
                  onClick={() => document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm border transition-all duration-200 hover:scale-105 active:scale-100"
                  style={{ background: 'rgba(255,255,255,0.8)', borderColor: '#DDD4C4', color: '#5A4A35' }}
                >
                  Browse Categories
                </button>
              </div>

              {/* Trust pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', label: '72-Hr Delivery', color: '#C4954A' },
                  { icon: 'M5 13l4 4L19 7', label: 'Secure Payment', color: '#6B9E7A' },
                  { icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', label: 'Top Rated', color: '#D4A843' },
                ].map(({ icon, label, color }) => (
                  <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border" style={{ background: 'rgba(255,255,255,0.75)', borderColor: '#E8DDD0', color: '#6A5A45' }}>
                    <svg className="w-3.5 h-3.5" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} /></svg>
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* ── RIGHT: Product Collage ──────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
              className="hidden lg:grid grid-cols-2 gap-4"
              style={{ height: 'clamp(420px, 60vh, 580px)' }}
            >
              {/* Tall left image */}
              <div className="relative group overflow-hidden rounded-3xl shadow-xl row-span-2" style={{ border: '1px solid rgba(220,210,195,0.5)' }}>
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&h=900&q=75"
                  alt="Premium Sneakers"
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(30,20,10,0.45) 0%, transparent 55%)' }} />
                <div className="absolute bottom-5 left-5 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-75 mb-0.5">Trending</p>
                  <p className="text-sm font-black">Fresh Kicks</p>
                </div>
              </div>
              {/* Top-right image */}
              <div className="relative group overflow-hidden rounded-3xl shadow-xl" style={{ border: '1px solid rgba(220,210,195,0.5)' }}>
                <img
                  src="https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&h=420&q=75"
                  alt="Luxury Watch"
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(30,20,10,0.4) 0%, transparent 55%)' }} />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-75 mb-0.5">Timeless</p>
                  <p className="text-sm font-black">Fine Watches</p>
                </div>
              </div>
              {/* Bottom-right image */}
              <div className="relative group overflow-hidden rounded-3xl shadow-xl" style={{ border: '1px solid rgba(220,210,195,0.5)' }}>
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=420&q=75"
                  alt="Premium Headphones"
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(30,20,10,0.4) 0%, transparent 55%)' }} />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-75 mb-0.5">Premium Audio</p>
                  <p className="text-sm font-black">Headphones</p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* ── Scroll indicator ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer"
            onClick={() => document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#B0A090' }}>Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED CATEGORIES GRID ─────────────────────────────── */}
      <section id="categories-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
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
          ].map(({ cat, label, sub, img }, index) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => { setCategory(cat); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="relative group overflow-hidden rounded-2xl cursor-pointer text-left"
              style={{ height: '220px', boxShadow: '0 4px 24px rgba(44,36,22,0.10)' }}
            >
              <img src={img} alt={label} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(44,36,22,0.75) 0%, rgba(44,36,22,0.10) 60%, transparent 100%)' }} />
              <div className="absolute bottom-0 left-0 p-4 sm:p-5">
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,220,150,0.85)' }}>{sub}</p>
                <p className="text-sm sm:text-base md:text-lg font-black text-white leading-tight">{label}</p>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-2xl transition-all duration-300" />
            </motion.button>
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
          ].map(({ cat, label, sub, img }, index) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onClick={() => { setCategory(cat); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="relative group overflow-hidden rounded-2xl cursor-pointer text-left"
              style={{ height: '150px', boxShadow: '0 4px 24px rgba(44,36,22,0.10)' }}
            >
              <img src={img} alt={label} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(44,36,22,0.72) 0%, rgba(44,36,22,0.05) 70%, transparent 100%)' }} />
              <div className="absolute bottom-0 left-0 p-3 sm:p-4">
                <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,220,150,0.85)' }}>{sub}</p>
                <p className="text-xs sm:text-sm font-black text-white leading-tight">{label}</p>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-2xl transition-all duration-300" />
            </motion.button>
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
            <div>
              {slowLoad && (
                <div
                  className="flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-6 text-sm font-semibold"
                  style={{ background: 'rgba(196,168,130,0.12)', border: '1px solid rgba(196,168,130,0.35)', color: '#7A5C2E' }}
                >
                  <span
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
                    style={{ borderColor: '#C4A882', borderTopColor: 'transparent' }}
                  />
                  <span>
                    Server is waking up — this only takes a moment on first visit.&nbsp;
                    <span style={{ color: '#A08B70', fontWeight: 400 }}>Hang tight…</span>
                  </span>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
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
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => fetchProducts({ cursor: nextCursor })}
                    disabled={moreLoading}
                    className="px-8 py-3 rounded-xl font-bold border transition-all duration-200 cursor-pointer flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                    style={{
                      background: '#FAF7F2',
                      borderColor: '#EDE5D8',
                      color: '#8B6914',
                      boxShadow: '0 4px 12px rgba(139,107,68,0.05)',
                    }}
                  >
                    {moreLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#8B6914', borderTopColor: 'transparent' }} />
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
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
