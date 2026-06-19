import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Button from "./ui/Button";

const C = {
  bg:      '#FDFCFB',
  border:  '#EDE5D8',
  surface: '#FAF7F2',
  text:    '#2C2416',
  muted:   '#7A6A55',
  subtle:  '#A08B70',
  accent:  '#8B6914',
  itemBg:  '#F8F4EE',
};

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
      {/* BACKDROP */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleCart}
      />

      {/* DRAWER */}
      <div
        className={`fixed inset-y-0 right-0 max-w-md w-full flex flex-col z-50 transition-transform duration-300 ease-in-out transform ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: C.bg, borderLeft: `1px solid ${C.border}`, boxShadow: '-8px 0 40px rgba(139,107,68,0.12)' }}
      >
        {/* HEADER */}
        <div className="p-5 flex justify-between items-center" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-black" style={{ color: C.text }}>
              Shopping Cart
            </h2>
            <span
              className="text-xs font-extrabold px-2.5 py-0.5 rounded-full"
              style={{ background: '#FEF3C7', color: C.accent, border: `1px solid #FDE68A` }}
            >
              {cart.reduce((sum, item) => sum + item.qty, 0)} Items
            </span>
          </div>

          <button
            onClick={toggleCart}
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ color: C.subtle }}
            onMouseEnter={(e) => e.currentTarget.style.background = C.itemBg}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ITEMS */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 flex flex-col justify-center items-center h-full">
              <svg className="w-12 h-12 mb-4" style={{ color: C.border }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="font-bold text-base" style={{ color: C.text }}>Your cart is empty</h3>
              <p className="text-xs mt-1 max-w-[200px]" style={{ color: C.subtle }}>Add items from the store to see them here.</p>
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
                className="flex items-center gap-4 p-3 rounded-xl"
                style={{ background: C.itemBg, border: `1px solid ${C.border}` }}
              >
                {/* THUMBNAIL */}
                <div
                  className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-1"
                  style={{ background: '#FFFFFF', border: `1px solid ${C.border}` }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-grow min-w-0 text-left">
                  <h4 className="font-bold text-xs truncate" style={{ color: C.text }}>{item.name}</h4>
                  <p className="font-black text-sm mt-0.5" style={{ color: C.accent }}>${item.price}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className="flex items-center rounded-lg overflow-hidden"
                      style={{ border: `1px solid ${C.border}`, background: '#FFFFFF' }}
                    >
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="px-2 py-0.5 font-extrabold text-xs cursor-pointer hover:opacity-70"
                        style={{ color: C.muted }}
                      >-</button>
                      <span className="px-2 font-bold text-xs" style={{ color: C.text }}>{item.qty}</span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="px-2 py-0.5 font-extrabold text-xs cursor-pointer hover:opacity-70"
                        style={{ color: C.muted }}
                      >+</button>
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

        {/* SUMMARY & CHECKOUT */}
        {cart.length > 0 && (
          <div className="p-5" style={{ borderTop: `1px solid ${C.border}`, background: C.surface }}>
            <div className="space-y-2 mb-4 text-xs font-semibold" style={{ color: C.muted }}>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span style={{ color: C.text }}>${totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span style={{ color: C.text }}>$15.00</span>
              </div>
              <hr style={{ borderColor: C.border }} className="my-1" />
              <div className="flex justify-between text-sm font-extrabold" style={{ color: C.text }}>
                <span>Estimated Total</span>
                <span className="text-base font-black" style={{ color: C.accent }}>
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
