import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const STORAGE_KEY = "shopnpay_recently_viewed";
const MAX_ITEMS = 8;

/**
 * Saves a product to the recently viewed list in localStorage.
 * Call this from Product.jsx when a product is loaded.
 */
export const saveRecentlyViewed = (product) => {
  if (!product) return;
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const id = product.productId || product.id;
    const filtered = existing.filter((p) => p.id !== id && p.productId !== id);
    const slim = {
      id,
      productId: id,
      name: product.name || product.title,
      price: product.price,
      image: product.image || product.images?.[0]?.url || "",
    };
    const updated = [slim, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
};

const RecentlyViewed = ({ excludeId, title = "Recently Viewed" }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const filtered = excludeId ? raw.filter((p) => p.id !== excludeId && p.productId !== excludeId) : raw;
      setItems(filtered.slice(0, 6));
    } catch {
      setItems([]);
    }
  }, [excludeId]);

  if (items.length === 0) return null;

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-black tracking-tight" style={{ color: "#2C2416" }}>{title}</h2>
        <button
          onClick={() => { localStorage.removeItem(STORAGE_KEY); setItems([]); }}
          className="text-[10px] font-bold hover:underline"
          style={{ color: "#C4A882" }}
        >
          Clear history
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="flex-shrink-0 w-36"
          >
            <Link to={`/product/${item.productId || item.id}`} className="block group">
              <div
                className="w-36 h-36 rounded-2xl overflow-hidden mb-2 flex items-center justify-center transition-shadow duration-200 group-hover:shadow-md"
                style={{ background: "#FAF7F2", border: "1px solid #EDE5D8" }}
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <span className="text-3xl">📦</span>
                )}
              </div>
              <p className="text-xs font-bold truncate" style={{ color: "#2C2416" }}>{item.name}</p>
              <p className="text-xs font-extrabold mt-0.5" style={{ color: "#8B6914" }}>${item.price}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
