

// import { useContext } from "react";
// import { Link } from "react-router-dom";
// import { CartContext } from "../context/CartContext";

// const Navbar = () => {
//   const { cart, wishlist } = useContext(CartContext);

//   const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

//   return (
//     <nav className="w-full bg-[#0b1329] text-white border-b border-slate-800/50 sticky top-0 z-40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">

//           {/* LOGO */}
//           <div className="flex items-center">
//             <Link to="/" className="text-xl font-black tracking-tight text-blue-400 flex items-center gap-1">
//               ShopNpay <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
//             </Link>
//           </div>

//           {/* RIGHT NAVIGATION LINKS (MATCHING IMAGE_5D6D45.PNG EXACTLY) */}
//           <div className="flex items-center gap-6 text-sm font-medium text-slate-300">
//             <Link to="/" className="text-blue-400 border-b-2 border-blue-400 py-1">
//               Home
//             </Link>

//             <Link to="/wishlist" className="hover:text-white transition-colors">
//               Wishlist
//             </Link>

//             <Link to="/cart" className="hover:text-white transition-colors flex items-center gap-1.5">
//               Cart
//               <span className="bg-blue-600 text-white font-bold text-xs px-2 py-0.5 rounded-full">
//                 {cartCount || 1}
//               </span>
//             </Link>

//             <Link to="/checkout" className="hover:text-white transition-colors">
//               Checkout
//             </Link>

//             {/* ADMIN HIDDEN FROM HERE */}

//             <Link to="/login" className="bg-white text-slate-900 font-semibold px-4 py-1.5 rounded-md hover:bg-slate-100 transition-colors ml-2">
//               Login
//             </Link>

//             {/* THEME TOGGLE ICON */}
//             <button className="text-slate-400 hover:text-white p-1 ml-1 cursor-pointer">
//               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M6.343 6.343l.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//             </button>
//           </div>

//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="w-full bg-[#0b1329] text-white border-b border-slate-800/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* LOGO */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-black tracking-tight text-blue-400 flex items-center gap-1">
              ShopNpay <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
            </Link>
          </div>

          {/* DESKTOP LINKS (Hidden on mobile, visible on md screens and up) */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link to="/" className="text-blue-400 border-b-2 border-blue-400 py-1">
              Home
            </Link>

            <Link to="/wishlist" className="hover:text-white transition-colors">
              Wishlist
            </Link>

            <Link to="/cart" className="hover:text-white transition-colors flex items-center gap-1.5">
              Cart
              <span className="bg-blue-600 text-white font-bold text-xs px-2 py-0.5 rounded-full">
                {cartCount || 1}
              </span>
            </Link>

            <Link to="/checkout" className="hover:text-white transition-colors">
              Checkout
            </Link>

            <Link to="/login" className="bg-white text-slate-900 font-semibold px-4 py-1.5 rounded-md hover:bg-slate-100 transition-colors ml-2">
              Login
            </Link>
          </div>

          {/* MOBILE BURGER BUTTON (Visible only on mobile) */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white focus:outline-none p-2"
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

      {/* MOBILE DROPDOWN LINKS PANEL */}
      {isOpen && (
        <div className="md:hidden bg-[#0f1b3a] border-t border-slate-800 px-4 pt-2 pb-4 space-y-3 text-left font-medium text-sm text-slate-300 animate-fade-in">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-blue-400 py-1 border-b border-slate-800"
          >
            Home
          </Link>

          <Link
            to="/wishlist"
            onClick={() => setIsOpen(false)}
            className="block hover:text-white py-1 border-b border-slate-800"
          >
            Wishlist
          </Link>

          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between hover:text-white py-1 border-b border-slate-800"
          >
            <span>Cart</span>
            <span className="bg-blue-600 text-white font-bold text-xs px-2 py-0.5 rounded-full">
              {cartCount || 1}
            </span>
          </Link>

          <Link
            to="/checkout"
            onClick={() => setIsOpen(false)}
            className="block hover:text-white py-1 border-b border-slate-800"
          >
            Checkout
          </Link>

          <div className="pt-2">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block text-center bg-white text-slate-900 font-bold px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;