import { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import { CartContext } from "../context/CartContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Checkout = () => {
  const { cart, totalPrice } = useContext(CartContext);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const handleOrder = (e) => {
    e.preventDefault();
    alert(`Order Placed!\nTotal: $${totalPrice}\nAddress: ${address}, ${city}`);
  };

  const shipping = cart.length > 0 ? 15 : 0;
  const grandTotal = totalPrice + shipping;

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 py-12">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-8 text-left">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* LEFT - FORM */}
          <div className="lg:col-span-2 bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-left">
              Shipping Information
            </h2>

            <form onSubmit={handleOrder} className="space-y-5">
              <Input
                type="text"
                label="Full Address"
                placeholder="123 Main St, Apt 4B"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />

              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  type="text"
                  label="City"
                  placeholder="New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />

                <Input
                  type="text"
                  label="Phone Number"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 text-sm tracking-wider uppercase font-bold"
                >
                  Place Order
                </Button>
              </div>
            </form>
          </div>

          {/* RIGHT - SUMMARY */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-left">
              Order Summary
            </h2>

            {cart.length === 0 ? (
              <p className="text-slate-400 text-sm font-medium text-left">No items in your cart.</p>
            ) : (
              <>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm font-semibold text-slate-600"
                    >
                      <div className="text-left">
                        <p className="text-slate-800 font-bold">{item.name}</p>
                        <p className="text-xs text-slate-400">Qty: {item.qty}</p>
                      </div>
                      <p className="text-slate-800">${item.price * item.qty}</p>
                    </div>
                  ))}
                </div>

                <hr className="border-slate-200 my-4" />

                <div className="space-y-3 text-sm text-slate-500 font-semibold">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-800">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-slate-800">${shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (included)</span>
                    <span className="text-slate-800">$0.00</span>
                  </div>
                  <hr className="border-slate-200 my-2" />
                  <div className="flex justify-between text-base font-bold text-slate-800">
                    <span>Grand Total</span>
                    <span className="text-purple-600 font-black">${grandTotal}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;