import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { CartContext } from "../context/CartContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    totalPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useContext(CartContext);

  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponInput("");
    }
  };

  const shipping = cart.length > 0 ? 15 : 0;
  const discountAmount = appliedCoupon ? totalPrice * appliedCoupon.discount : 0;
  const grandTotal = totalPrice - discountAmount + shipping;

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 py-12">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-8 text-left">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm max-w-xl mx-auto">
            <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Your cart is empty</h2>
            <p className="text-slate-400 dark:text-slate-500 mt-2 text-sm">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className="mt-6 inline-block">
              <Button variant="primary">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {/* LEFT - ITEMS LIST */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    {/* THUMBNAIL */}
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base text-left">
                        {item.name}
                      </h2>
                      <p className="text-purple-600 dark:text-purple-400 font-extrabold text-sm text-left mt-0.5">${item.price}</p>
                    </div>
                  </div>

                  {/* CONTROLS */}
                  <div className="flex gap-4 items-center justify-between sm:justify-end">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-inner">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-extrabold transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 text-slate-800 dark:text-slate-200 font-bold text-sm w-8 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-extrabold transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <Button
                      onClick={() => removeFromCart(item.id)}
                      variant="danger"
                      size="sm"
                      className="px-3 py-1.5 text-xs font-semibold"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT - SUMMARY & PROMO CARD */}
            <div className="space-y-6">
              {/* ORDER SUMMARY */}
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-left">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-semibold">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-800 dark:text-slate-200">${totalPrice}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Promo Discount ({appliedCoupon.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-slate-800 dark:text-slate-200">${shipping}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax (included)</span>
                    <span className="text-slate-800 dark:text-slate-200">$0.00</span>
                  </div>
                  <hr className="border-slate-100 dark:border-slate-700 my-2" />
                  <div className="flex justify-between text-base font-bold text-slate-800 dark:text-slate-100">
                    <span>Grand Total</span>
                    <span className="text-purple-600 dark:text-purple-400 font-black">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="block w-full mt-6">
                  <Button variant="primary" className="w-full py-3 text-sm tracking-wider uppercase font-bold">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>

              {/* PROMOCODE PANEL */}
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 text-left">
                  Have a Promo Code?
                </h3>

                {appliedCoupon ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-4 flex justify-between items-center text-left">
                    <div>
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Applied Coupon</p>
                      <p className="text-sm font-extrabold text-emerald-900 dark:text-emerald-300 mt-0.5">
                        {appliedCoupon.code} ({(appliedCoupon.discount * 100)}% Off)
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold text-slate-400 hover:text-red-500 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="flex-grow">
                      <Input
                        type="text"
                        placeholder="e.g. SAVE20"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Button type="submit" variant="secondary" className="h-[46px] rounded-xl self-end">
                      Apply
                    </Button>
                  </form>
                )}
                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-left mt-2.5 font-medium">
                  Try codes: <code className="text-purple-600 bg-slate-50 dark:bg-slate-900 dark:text-purple-400">SAVE10</code> or <code className="text-purple-600 bg-slate-50 dark:bg-slate-900 dark:text-purple-400">SAVE20</code>. Limit one per order.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;