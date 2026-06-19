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
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF8', color: '#2C2416' }}>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto p-6 py-12 w-full">
        <h1 className="text-3xl font-black tracking-tight mb-8 text-left" style={{ color: '#2C2416' }}>
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 rounded-3xl p-8 shadow-sm max-w-xl mx-auto" style={{ background: '#FFFFFF', border: '1px solid #EDE5D8' }}>
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: '#C4A882' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl font-bold" style={{ color: '#2C2416' }}>Your cart is empty</h2>
            <p className="mt-2 text-sm" style={{ color: '#A08B70' }}>Looks like you haven't added anything to your cart yet.</p>
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
                  className="bg-white border p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-sm transition-all"
                  style={{ borderColor: '#EDE5D8' }}
                >
                  <div className="flex items-center gap-4">
                    {/* THUMBNAIL */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-1" style={{ background: '#FAF7F2', border: '1px solid #EDE5D8' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-left" style={{ color: '#2C2416' }}>
                        {item.name}
                      </h2>
                      <p className="font-extrabold text-sm text-left mt-0.5" style={{ color: '#8B6914' }}>${item.price}</p>
                    </div>
                  </div>

                  {/* CONTROLS */}
                  <div className="flex gap-4 items-center justify-between sm:justify-end">
                    <div className="flex items-center rounded-xl overflow-hidden shadow-inner" style={{ border: '1px solid #EDE5D8', background: '#FAF7F2' }}>
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="px-3 py-1.5 font-extrabold transition-colors cursor-pointer hover:opacity-70"
                        style={{ color: '#6B5B45' }}
                      >
                        -
                      </button>
                      <span className="px-3 font-bold text-sm w-8 text-center" style={{ color: '#2C2416' }}>
                        {item.qty}
                      </span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="px-3 py-1.5 font-extrabold transition-colors cursor-pointer hover:opacity-70"
                        style={{ color: '#6B5B45' }}
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
              <div className="p-6 rounded-2xl shadow-sm" style={{ background: '#FFFFFF', border: '1px solid #EDE5D8' }}>
                <h2 className="text-xl font-bold mb-6 text-left" style={{ color: '#2C2416' }}>
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm font-semibold" style={{ color: '#7A6A55' }}>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span style={{ color: '#2C2416' }}>${totalPrice}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo Discount ({appliedCoupon.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span style={{ color: '#2C2416' }}>${shipping}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax (included)</span>
                    <span style={{ color: '#2C2416' }}>$0.00</span>
                  </div>
                  <hr style={{ borderColor: '#EDE5D8' }} className="my-2" />
                  <div className="flex justify-between text-base font-bold" style={{ color: '#2C2416' }}>
                    <span>Grand Total</span>
                    <span className="font-black" style={{ color: '#8B6914' }}>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="block w-full mt-6">
                  <Button variant="primary" className="w-full py-3 text-sm tracking-wider uppercase font-bold">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>

              {/* PROMO PANEL */}
              <div className="p-6 rounded-2xl shadow-sm" style={{ background: '#FFFFFF', border: '1px solid #EDE5D8' }}>
                <h3 className="text-base font-bold mb-4 text-left" style={{ color: '#2C2416' }}>
                  Have a Promo Code?
                </h3>

                {appliedCoupon ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex justify-between items-center text-left">
                    <div>
                      <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Applied Coupon</p>
                      <p className="text-sm font-extrabold text-emerald-900 mt-0.5">
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
                <p className="text-[10px] text-left mt-2.5 font-medium" style={{ color: '#A08B70' }}>
                  Try codes: <code className="font-mono" style={{ color: '#8B6914', background: '#FAF7F2' }}>SAVE10</code> or <code className="font-mono" style={{ color: '#8B6914', background: '#FAF7F2' }}>SAVE20</code>. Limit one per order.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;