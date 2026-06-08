import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Button from "./ui/Button";

const CartDrawer = () => {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    totalPrice,
    isCartOpen,
    toggleCart
  } = useContext(CartContext);

  return (
    <>
      {/* BACKDROP OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/45 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleCart}
      ></div>

      {/* DRAWER CONTAINER */}
      <div
        className={`fixed inset-y-0 right-0 max-w-md w-full bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col z-50 transition-transform duration-300 ease-in-out transform ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">
              Shopping Cart
            </h2>
            <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.qty, 0)} Items
            </span>
          </div>

          <button
            onClick={toggleCart}
            className="p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ITEMS LIST */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 flex flex-col justify-center items-center h-full">
              <svg className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-slate-800 dark:text-slate-300 font-bold text-base">Your cart is empty</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-[200px]">Add items from the store to see them here.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleCart}
                className="mt-6 font-bold"
              >
                Continue Browsing
              </Button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60"
              >
                {/* THUMBNAIL */}
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-1 border border-slate-100 dark:border-slate-800">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-grow min-w-0 text-left">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate">
                    {item.name}
                  </h4>
                  <p className="text-purple-600 dark:text-purple-400 font-black text-sm mt-0.5">${item.price}</p>
                  
                  {/* QUANTITY CONTROL */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="px-2 py-0.5 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-extrabold text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-slate-800 dark:text-slate-200 font-bold text-xs">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="px-2 py-0.5 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-extrabold text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-500 hover:text-red-600 font-bold hover:underline ml-2 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* BOTTOM SUMMARY & CHECKOUT */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="space-y-2 mb-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800 dark:text-slate-200">${totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-slate-800 dark:text-slate-200">$15.00</span>
              </div>
              <hr className="border-slate-100 dark:border-slate-800 my-1" />
              <div className="flex justify-between text-sm font-extrabold text-slate-800 dark:text-slate-200">
                <span>Estimated Total</span>
                <span className="text-purple-600 dark:text-purple-400 text-base font-black">
                  ${totalPrice + 15}
                </span>
              </div>
            </div>

            <Link to="/checkout" className="block w-full" onClick={toggleCart}>
              <Button variant="primary" className="w-full py-3 text-xs tracking-wider uppercase font-extrabold">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
