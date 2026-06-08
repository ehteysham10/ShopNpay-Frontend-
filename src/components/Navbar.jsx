import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import Button from "./ui/Button";

const Navbar = () => {
  const { cart, wishlist, toggleCart } = useContext(CartContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => `
    relative py-2 text-sm font-semibold transition-all duration-200
    ${isActive(path)
      ? "text-blue-600 dark:text-blue-400 after:w-full"
      : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 after:w-0"}
    after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full
  `;

  const mobileLinkStyle = (path) => `
    block py-3 px-4 text-base font-bold rounded-xl transition-all duration-200 text-left
    ${isActive(path)
      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"}
  `;

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              ShopNpay
            </span>
            <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 group-hover:scale-125 transition-transform duration-200"></div>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-8">
            <Link className={linkStyle("/")} to="/">
              Home
            </Link>

            {/* WISHLIST LINK */}
            <Link className={linkStyle("/wishlist")} to="/wishlist">
              <span className="flex items-center">
                Wishlist
                {wishlist.length > 0 && (
                  <span className="ml-1.5 text-[10px] font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </span>
            </Link>

            {/* DRAWER TRIGGER */}
            <button
              onClick={toggleCart}
              className="relative py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer"
            >
              <span className="flex items-center">
                Cart
                <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${cart.length > 0
                    ? "bg-blue-600 text-white scale-110 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}>
                  {cart.length}
                </span>
              </span>
            </button>

            <Link className={linkStyle("/checkout")} to="/checkout">
              Checkout
            </Link>

            <Link className={linkStyle("/admin")} to="/admin">
              Admin
            </Link>

            <Link to="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          </div>

          {/* MOBILE TOGGLE AND CART TRIGGER BUTTON */}
          <div className="flex items-center gap-4 md:hidden">
            {/* MINI CART BUTTON FOR MOBILE QUICK ACCESS */}
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              aria-label="Toggle Cart"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 text-[9px] font-black bg-blue-600 text-white w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {cart.length}
                  </span>
                )}
              </span>
            </button>

            {/* HAMBURGER BUTTON */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-fade-in">
            <Link className={mobileLinkStyle("/")} to="/" onClick={() => setIsOpen(false)}>
              Home
            </Link>

            <Link className={mobileLinkStyle("/wishlist")} to="/wishlist" onClick={() => setIsOpen(false)}>
              <span className="flex items-center justify-between">
                <span>Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="text-xs font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </span>
            </Link>

            <Link className={mobileLinkStyle("/checkout")} to="/checkout" onClick={() => setIsOpen(false)}>
              Checkout
            </Link>

            <Link className={mobileLinkStyle("/admin")} to="/admin" onClick={() => setIsOpen(false)}>
              Admin
            </Link>

            <div className="pt-2 px-4">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full justify-center">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;