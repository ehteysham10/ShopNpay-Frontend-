import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";

// ── Colour tokens ──────────────────────────────────────────────
const C = {
  nav:        '#FDFCFB',
  border:     '#EDE5D8',
  text:       '#2C2416',
  textMuted:  '#7A6A55',
  textSubtle: '#A08B70',
  accent:     '#8B6914',
  accentBg:   '#FDF8EE',
  surface:    'rgba(255,255,255,0.95)',
  dropdown:   '#FFFFFF',
};

const Navbar = () => {
  const { cart, user, logout } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const cartCount = cart.reduce((total, item) => total + (item.qty || item.quantity || 0), 0);

  const getLinkStyle = (path) => {
    const isActive = currentPath === path;
    return {
      color: isActive ? C.accent : C.textMuted,
      borderColor: isActive ? C.accent : 'transparent'
    };
  };

  return (
    <div className="w-full sticky top-0 z-45 px-4 sm:px-6 lg:px-8 pt-4 pb-2" style={{ background: 'transparent' }}>
      <nav
        className="max-w-7xl mx-auto rounded-2xl border backdrop-blur-md transition-all duration-300 relative"
        style={{
          background: 'rgba(253, 252, 251, 0.75)',
          borderColor: 'rgba(237, 229, 216, 0.7)',
          boxShadow: '0 8px 32px rgba(139, 107, 68, 0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* LOGO */}
            <div className="flex items-center">
              <Link
                to="/"
                className="text-xl font-black tracking-tight flex items-center gap-2"
                style={{ color: C.accent }}
              >
                ShopNpay
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ background: 'linear-gradient(135deg, #C4954A, #8B6914)' }}
                />
              </Link>
            </div>

            {/* DESKTOP LINKS */}
            <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
              <Link
                to="/"
                className="border-b-2 py-1 transition-all"
                style={getLinkStyle("/")}
              >
                Home
              </Link>

              <Link
                to="/wishlist"
                className="border-b-2 py-1 transition-all"
                style={getLinkStyle("/wishlist")}
              >
                Wishlist
              </Link>

              <Link
                to="/cart"
                className="border-b-2 py-1 transition-all flex items-center gap-1.5"
                style={getLinkStyle("/cart")}
              >
                Cart
                {cartCount > 0 && (
                  <span
                    className="font-bold text-xs px-2 py-0.5 rounded-full text-white"
                    style={{ background: C.accent }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/checkout"
                className="border-b-2 py-1 transition-all"
                style={getLinkStyle("/checkout")}
              >
                Checkout
              </Link>

              {user && (
                <Link
                  to="/orders"
                  className="border-b-2 py-1 transition-all"
                  style={getLinkStyle("/orders")}
                >
                  My Orders
                </Link>
              )}

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 hover:opacity-70 transition-opacity focus:outline-none cursor-pointer"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border-2"
                        style={{ borderColor: C.accent }}
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm"
                        style={{ background: 'linear-gradient(135deg, #8B6914, #C4954A)' }}
                      >
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <span className="hidden sm:inline text-sm" style={{ color: C.text }}>{user.name}</span>
                    <svg className="w-4 h-4" style={{ color: C.textSubtle }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showUserDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-52 rounded-xl shadow-xl py-2 z-50 text-left border"
                      style={{ background: C.dropdown, borderColor: C.border, boxShadow: '0 8px 32px rgba(139,107,68,0.15)' }}
                    >
                      <div className="px-4 py-2.5 border-b" style={{ borderColor: C.border }}>
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.textSubtle }}>Signed in as</p>
                        <p className="text-sm font-bold truncate mt-0.5" style={{ color: C.text }}>{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="block px-4 py-2.5 text-sm transition-colors hover:bg-stone-50"
                        style={{ color: C.textMuted }}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setShowUserDropdown(false)}
                        className="block px-4 py-2.5 text-sm transition-colors hover:bg-stone-50"
                        style={{ color: C.textMuted }}
                      >
                        My Orders
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserDropdown(false)}
                          className="block px-4 py-2.5 text-sm font-bold transition-colors hover:bg-stone-50"
                          style={{ color: C.accent }}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); setShowUserDropdown(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer font-semibold"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="font-bold px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80 text-white"
                  style={{ background: 'linear-gradient(135deg, #8B6914, #C4954A)' }}
                >
                  Login
                </Link>
              )}
            </div>

            {/* MOBILE BURGER */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none p-2 rounded-lg transition-colors"
                style={{ color: C.textMuted }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE MENU (OVERLAY DROPDOWN) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden absolute top-[calc(100%+8px)] left-0 w-full px-4 pt-3 pb-5 space-y-3 text-left font-semibold text-sm rounded-2xl shadow-2xl border backdrop-blur-xl z-50"
              style={{ background: 'rgba(253, 252, 251, 0.95)', borderColor: C.border, color: C.textMuted }}
            >
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block py-2 border-b font-bold"
                style={{ color: currentPath === "/" ? C.accent : C.textMuted, borderColor: C.border }}
              >
                Home
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setIsOpen(false)}
                className="block py-2 border-b hover:opacity-70 font-semibold"
                style={{ color: currentPath === "/wishlist" ? C.accent : C.textMuted, borderColor: C.border }}
              >
                Wishlist
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between py-2 border-b hover:opacity-70 font-semibold"
                style={{ color: currentPath === "/cart" ? C.accent : C.textMuted, borderColor: C.border }}
              >
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="font-bold text-xs px-2 py-0.5 rounded-full text-white" style={{ background: C.accent }}>
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="block py-2 border-b hover:opacity-70 font-semibold"
                style={{ color: currentPath === "/checkout" ? C.accent : C.textMuted, borderColor: C.border }}
              >
                Checkout
              </Link>
              {user && (
                <Link
                  to="/orders"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 border-b hover:opacity-70 font-semibold"
                  style={{ color: currentPath === "/orders" ? C.accent : C.textMuted, borderColor: C.border }}
                >
                  My Orders
                </Link>
              )}

              {user ? (
                <div className="pt-2 border-t space-y-2" style={{ borderColor: C.border }}>
                  <div className="flex items-center gap-3 px-1 py-2">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2" style={{ borderColor: C.accent }} />
                    ) : (
                      <div className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold" style={{ background: 'linear-gradient(135deg, #8B6914, #C4954A)' }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold" style={{ color: C.text }}>{user.name}</p>
                      <p className="text-xs truncate" style={{ color: C.textSubtle }}>{user.email}</p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block text-center font-bold px-4 py-2.5 rounded-xl border transition-colors"
                    style={{ color: C.textMuted, borderColor: C.border }}
                  >
                    My Profile
                  </Link>

                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block text-center font-bold px-4 py-2.5 rounded-xl border transition-colors"
                      style={{ color: C.accent, borderColor: C.border, background: C.accentBg }}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full text-center text-red-500 font-bold px-4 py-2.5 rounded-xl border border-red-100 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block text-center font-bold px-4 py-2.5 rounded-xl text-white transition-opacity hover:opacity-80"
                    style={{ background: 'linear-gradient(135deg, #8B6914, #C4954A)' }}
                  >
                    Login
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;