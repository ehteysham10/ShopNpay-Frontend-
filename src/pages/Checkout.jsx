// import { useContext, useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import { CartContext } from "../context/CartContext";
// import Input from "../components/ui/Input";
// import Button from "../components/ui/Button";
// import { toast } from "react-toastify";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51Psz8fF1sN4S88qP3bT");
// const API_URL = import.meta.env.VITE_API_URL;

// const CheckoutForm = () => {
//   // 👀 setCart ko destructuring se hata diya hai takay TypeError completely khatam ho jaye
//   const { cart, totalPrice, discountAmount, finalPrice, token, user } = useContext(CartContext);
//   const navigate = useNavigate();
//   const stripe = useStripe();
//   const elements = useElements();

//   const [address, setAddress] = useState("");
//   const [city, setCity] = useState("");
//   const [phone, setPhone] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   // Search dropdown states
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [pakistaniCities, setPakistaniCities] = useState([]);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const fetchCities = async () => {
//       try {
//         const response = await fetch(`${API_URL}/orders/cities`);
//         const result = await response.json();
//         if (response.ok && result.status === "success") {
//           setPakistaniCities(result.data || []);
//         } else {
//           setPakistaniCities(["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"]);
//         }
//       } catch (err) {
//         console.error("Error fetching cities:", err);
//         setPakistaniCities(["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"]);
//       }
//     };
//     fetchCities();
//   }, []);

//   const filteredCities = pakistaniCities.filter((cityName) =>
//     cityName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleOrder = async (e) => {
//     e.preventDefault();
//     if (!token) {
//       toast.error("Please log in to complete checkout.");
//       return;
//     }
//     if (!city) {
//       toast.error("Please select a city from the list.");
//       return;
//     }
//     if (!stripe || !elements) {
//       return;
//     }

//     setSubmitting(true);
//     try {
//       // 1. Create Payment Intent
//       const response = await fetch(`${API_URL}/orders/create-payment-intent`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           fullAddress: address,
//           city,
//           phone
//         })
//       });
//       const result = await response.json();
//       if (!response.ok || result.status !== "success") {
//         toast.error(result.message || "Failed to initialize payment.");
//         setSubmitting(false);
//         return;
//       }

//       const { clientSecret, paymentIntentId } = result.data;

//       // 2. Confirm Card Payment via Stripe
//       const cardElement = elements.getElement(CardElement);
//       const confirmResult = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: cardElement,
//           billing_details: {
//             name: user?.name || "Customer",
//             phone: phone
//           }
//         }
//       });

//       if (confirmResult.error) {
//         toast.error(confirmResult.error.message || "Payment failed");
//         setSubmitting(false);
//         return;
//       }

//       // 3. Confirm Order on Backend
//       if (confirmResult.paymentIntent.status === "succeeded") {
//         const confirmResponse = await fetch(`${API_URL}/orders/confirm`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             paymentIntentId,
//             fullAddress: address,
//             city,
//             phone
//           })
//         });

//         const confirmResultData = await confirmResponse.json();

//         if (confirmResponse.ok && confirmResultData.status === "success") {
//           toast.success("Order placed successfully!");

//           // 🔥 FIXED: setCart ko remove kar diya hai taaki state crash na ho.
//           // Redirection ke baad jab user Orders page par jayega ya wapis Cart kholega, 
//           // to data backend ke context fetch se automatic safe sync ho jayega.
//           setSubmitting(false);

//           return navigate("/orders");
//         } else {
//           toast.error(confirmResultData.message || "Order verification failed.");
//           setSubmitting(false);
//           return;
//         }
//       }
//     } catch (error) {
//       console.error("Checkout error:", error);
//       toast.error("An error occurred during checkout.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const shipping = cart.length > 0 ? 15 : 0;
//   const grandTotal = finalPrice + shipping;

//   return (
//     <div className="min-h-screen bg-[#0b1329]">
//       <Navbar />

//       <div className="max-w-7xl mx-auto p-6 py-12">
//         <h1 className="text-3xl font-black text-white tracking-tight mb-8 text-left">
//           Checkout
//         </h1>

//         <div className="grid lg:grid-cols-3 gap-10 items-start">
//           {/* LEFT - FORM CONTAINER CARD */}
//           <div className="lg:col-span-2 bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-md">
//             <h2 className="text-xl font-bold text-slate-800 mb-6 text-left">
//               Shipping Information
//             </h2>

//             <form onSubmit={handleOrder} className="space-y-5">
//               <div className="flex flex-col text-left [&_input]:bg-slate-50 [&_input]:text-slate-900 [&_input]:border-slate-200 [&_input]:placeholder-slate-400">
//                 <Input
//                   type="text"
//                   label="Full Address"
//                   placeholder="123 Main St, Apt 4B"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   required
//                   disabled={submitting}
//                 />
//               </div>

//               <div className="grid sm:grid-cols-2 gap-5 items-end">
//                 {/* SEARCHABLE CITY SELECTION CONTAINER */}
//                 <div className="flex flex-col items-start w-full relative text-left" ref={dropdownRef}>
//                   <label className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
//                     City
//                   </label>

//                   <input
//                     type="text"
//                     value={city}
//                     tabIndex={-1}
//                     className="absolute opacity-0 pointer-events-none bottom-0 left-0 w-full h-1"
//                     required
//                     onChange={() => { }}
//                     disabled={submitting}
//                   />

//                   <div
//                     onClick={() => !submitting && setIsDropdownOpen(!isDropdownOpen)}
//                     className={`w-full border-2 border-slate-300 focus-within:border-purple-600 rounded-xl px-4 py-3 text-sm bg-slate-50 text-slate-900 flex justify-between items-center cursor-pointer h-[46px] shadow-sm hover:bg-slate-100/70 transition-all ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
//                   >
//                     <span className={city ? "text-slate-900 font-bold" : "text-slate-400 font-medium"}>
//                       {city || "Search or choose city"}
//                     </span>
//                     <svg className={`w-4 h-4 text-slate-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>

//                   {isDropdownOpen && (
//                     <div className="absolute top-[76px] left-0 w-full bg-white border border-slate-300 rounded-xl shadow-2xl z-50 overflow-hidden border-t-2">
//                       <div className="p-2 border-b border-slate-200 bg-slate-100">
//                         <input
//                           type="text"
//                           placeholder="Type city name to search..."
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                           onClick={(e) => e.stopPropagation()}
//                           className="w-full bg-white border-2 border-purple-300 text-slate-900 placeholder-slate-400 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-600 font-bold"
//                           autoFocus
//                         />
//                       </div>

//                       <ul className="max-h-48 overflow-y-auto text-left text-xs font-bold text-slate-800 divide-y divide-slate-100">
//                         {filteredCities.length > 0 ? (
//                           filteredCities.map((cityName) => (
//                             <li
//                               key={cityName}
//                               onClick={() => {
//                                 setCity(cityName);
//                                 setSearchQuery("");
//                                 setIsDropdownOpen(false);
//                               }}
//                               className={`px-4 py-2.5 hover:bg-purple-600 hover:text-white cursor-pointer transition-colors ${city === cityName ? "bg-purple-100 text-purple-900" : ""}`}
//                             >
//                               {cityName}
//                             </li>
//                           ))
//                         ) : (
//                           <li className="px-4 py-3 text-slate-400 text-center font-medium bg-white">
//                             No matching cities found
//                           </li>
//                         )}
//                       </ul>
//                     </div>
//                   )}
//                 </div>

//                 {/* PHONE NUMBER */}
//                 <div className="flex flex-col text-left w-full [&_input]:bg-slate-50 [&_input]:text-slate-900 [&_input]:border-slate-200 [&_input]:placeholder-slate-400">
//                   <Input
//                     type="text"
//                     label="Phone Number"
//                     placeholder="+92 (300) 000-0000"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     required
//                     disabled={submitting}
//                   />
//                 </div>
//               </div>

//               {/* CARD DETAILS ELEMENT */}
//               <div className="flex flex-col text-left w-full mt-6">
//                 <label className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
//                   Card Details
//                 </label>
//                 <div className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 bg-slate-50 shadow-sm focus-within:border-purple-600 transition-all">
//                   <CardElement
//                     options={{
//                       style: {
//                         base: {
//                           fontSize: "14px",
//                           color: "#0f172a",
//                           fontFamily: "Inter, sans-serif",
//                           "::placeholder": {
//                             color: "#94a3b8",
//                           },
//                         },
//                         invalid: {
//                           color: "#ef4444",
//                         },
//                       },
//                     }}
//                   />
//                 </div>
//               </div>

//               <div className="pt-4">
//                 <Button
//                   type="submit"
//                   variant="primary"
//                   className="w-full py-3 text-sm tracking-wider uppercase font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md rounded-xl transition-colors"
//                   disabled={submitting || cart.length === 0}
//                 >
//                   {submitting ? "Processing Payment..." : "Pay and Place Order"}
//                 </Button>
//               </div>
//             </form>
//           </div>

//           {/* RIGHT - SUMMARY SIDE CONTAINER PANEL */}
//           <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-md">
//             <h2 className="text-xl font-bold text-slate-800 mb-6 text-left">
//               Order Summary
//             </h2>

//             {cart.length === 0 ? (
//               <p className="text-slate-400 text-sm font-medium text-left">No items in your cart.</p>
//             ) : (
//               <>
//                 <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
//                   {cart.map((item) => (
//                     <div
//                       key={item.id}
//                       className="flex justify-between items-center text-sm font-semibold text-slate-600"
//                     >
//                       <div className="text-left">
//                         <p className="text-slate-800 font-bold">{item.name}</p>
//                         <p className="text-xs text-slate-400">Qty: {item.qty}</p>
//                       </div>
//                       <p className="text-slate-800">${item.price * item.qty}</p>
//                     </div>
//                   ))}
//                 </div>

//                 <hr className="border-slate-200 my-4" />

//                 <div className="space-y-3 text-sm text-slate-500 font-semibold">
//                   <div className="flex justify-between">
//                     <span>Subtotal</span>
//                     <span className="text-slate-800">${totalPrice}</span>
//                   </div>
//                   {discountAmount > 0 && (
//                     <div className="flex justify-between text-green-600 font-bold">
//                       <span>Discount</span>
//                       <span>-${discountAmount.toFixed(2)}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between">
//                     <span>Shipping</span>
//                     <span className="text-slate-800">${shipping}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Tax (included)</span>
//                     <span className="text-slate-800">$0.00</span>
//                   </div>
//                   <hr className="border-slate-200 my-2" />
//                   <div className="flex justify-between text-base font-bold text-slate-800">
//                     <span>Grand Total</span>
//                     <span className="text-purple-600 font-black">${grandTotal}</span>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Checkout = () => {
//   return (
//     <Elements stripe={stripePromise}>
//       <CheckoutForm />
//     </Elements>
//   );
// };

// export default Checkout; 





import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { CartContext } from "../context/CartContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51Psz8fF1sN4S88qP3bT");
const API_URL = import.meta.env.VITE_API_URL;

const CheckoutForm = () => {
  // 🔥 UPDATED: setCart aur setAppliedCoupon dono ko context se destructure kar liya hai
  const { cart, totalPrice, discountAmount, finalPrice, token, user, setCart, setAppliedCoupon } = useContext(CartContext);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Search dropdown states
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pakistaniCities, setPakistaniCities] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/cities`);
        const result = await response.json();
        if (response.ok && result.status === "success") {
          setPakistaniCities(result.data || []);
        } else {
          setPakistaniCities(["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"]);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
        setPakistaniCities(["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"]);
      }
    };
    fetchCities();
  }, []);

  const filteredCities = pakistaniCities.filter((cityName) =>
    cityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please log in to complete checkout.");
      return;
    }
    if (!city) {
      toast.error("Please select a city from the list.");
      return;
    }
    if (!stripe || !elements) {
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create Payment Intent
      const response = await fetch(`${API_URL}/orders/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullAddress: address,
          city,
          phone
        })
      });
      const result = await response.json();
      if (!response.ok || result.status !== "success") {
        toast.error(result.message || "Failed to initialize payment.");
        setSubmitting(false);
        return;
      }

      const { clientSecret, paymentIntentId } = result.data;

      // 2. Confirm Card Payment via Stripe
      const cardElement = elements.getElement(CardElement);
      const confirmResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.name || "Customer",
            phone: phone
          }
        }
      });

      if (confirmResult.error) {
        toast.error(confirmResult.error.message || "Payment failed");
        setSubmitting(false);
        return;
      }

      // 3. Confirm Order on Backend
      if (confirmResult.paymentIntent.status === "succeeded") {
        const confirmResponse = await fetch(`${API_URL}/orders/confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            paymentIntentId,
            fullAddress: address,
            city,
            phone
          })
        });

        const confirmResultData = await confirmResponse.json();

        if (confirmResponse.ok && confirmResultData.status === "success") {
          toast.success("Order placed successfully!");

          // 🔥 ADJUSTED: Frontend UI cart clear aur coupon code flush logic safely applied!
          setCart([]);
          setAppliedCoupon(null);
          setSubmitting(false);

          return navigate("/orders");
        } else {
          toast.error(confirmResultData.message || "Order verification failed.");
          setSubmitting(false);
          return;
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred during checkout.");
    } finally {
      setSubmitting(false);
    }
  };

  const shipping = cart.length > 0 ? 15 : 0;
  const grandTotal = finalPrice + shipping;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen flex flex-col" style={{ background: '#FAFAF8', color: '#2C2416' }}
    >
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto p-6 py-12 w-full">
        <h1 className="text-3xl font-black tracking-tight mb-8 text-left" style={{ color: '#2C2416' }}>
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* LEFT - FORM CONTAINER CARD */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl shadow-sm" style={{ background: '#FFFFFF', border: '1px solid #EDE5D8' }}>
            <h2 className="text-xl font-bold mb-6 text-left" style={{ color: '#2C2416' }}>
              Shipping Information
            </h2>

            <form onSubmit={handleOrder} className="space-y-5">
              <div className="flex flex-col text-left">
                <Input
                  type="text"
                  label="Full Address"
                  placeholder="123 Main St, Apt 4B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5 items-end">
                {/* SEARCHABLE CITY SELECTION CONTAINER */}
                <div className="flex flex-col items-start w-full relative text-left" ref={dropdownRef}>
                  <label className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: '#A08B70' }}>
                    City
                  </label>

                  <input
                    type="text"
                    value={city}
                    tabIndex={-1}
                    className="absolute opacity-0 pointer-events-none bottom-0 left-0 w-full h-1"
                    required
                    onChange={() => { }}
                    disabled={submitting}
                  />

                  <div
                    onClick={() => !submitting && setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full border rounded-xl px-4 py-3 text-sm flex justify-between items-center cursor-pointer h-[46px] shadow-sm transition-all ${
                      submitting ? "opacity-60 cursor-not-allowed" : "hover:bg-[#FAF7F2]"
                    }`}
                    style={{
                      background: '#FFFFFF',
                      borderColor: isDropdownOpen ? '#8B6914' : '#EDE5D8',
                      color: city ? '#2C2416' : '#A08B70'
                    }}
                  >
                    <span className={city ? "font-bold" : "font-medium"}>
                      {city || "Search or choose city"}
                    </span>
                    <svg className="w-4 h-4 transition-transform duration-200" style={{ color: '#8B6914', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-[76px] left-0 w-full bg-white border rounded-xl shadow-2xl z-50 overflow-hidden border-t-2" style={{ borderColor: '#EDE5D8' }}>
                      <div className="p-2 border-b bg-[#FAF7F2]" style={{ borderColor: '#EDE5D8' }}>
                        <input
                          type="text"
                          placeholder="Type city name to search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-white border text-sm placeholder-slate-400 rounded-lg px-3 py-2 outline-none font-semibold"
                          style={{ borderColor: '#EDE5D8', color: '#2C2416' }}
                          autoFocus
                        />
                      </div>

                      <ul className="max-h-48 overflow-y-auto text-left text-xs font-bold divide-y" style={{ borderColor: '#EDE5D8', color: '#2C2416' }}>
                        {filteredCities.length > 0 ? (
                          filteredCities.map((cityName) => (
                            <li
                              key={cityName}
                              onClick={() => {
                                setCity(cityName);
                                setSearchQuery("");
                                setIsDropdownOpen(false);
                              }}
                              className="px-4 py-2.5 hover:bg-[#8B6914] hover:text-white cursor-pointer transition-colors"
                              style={{
                                background: city === cityName ? '#FAF7F2' : '#FFFFFF',
                                color: city === cityName ? '#8B6914' : '#2C2416'
                              }}
                            >
                              {cityName}
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-3 text-center font-medium bg-white" style={{ color: '#A08B70' }}>
                            No matching cities found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* PHONE NUMBER */}
                <div className="flex flex-col text-left w-full">
                  <Input
                    type="text"
                    label="Phone Number"
                    placeholder="+92 (300) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* CARD DETAILS ELEMENT */}
              <div className="flex flex-col text-left w-full mt-6">
                <label className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: '#A08B70' }}>
                  Card Details
                </label>
                <div className="w-full border rounded-xl px-4 py-3 shadow-sm focus-within:border-[#8B6914] transition-all" style={{ background: '#FFFFFF', borderColor: '#EDE5D8' }}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "14px",
                          color: "#2C2416",
                          fontFamily: "Inter, sans-serif",
                          "::placeholder": {
                            color: "#A08B70",
                          },
                        },
                        invalid: {
                          color: "#ef4444",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 text-sm tracking-wider uppercase font-bold"
                  disabled={submitting || cart.length === 0}
                >
                  {submitting ? "Processing Payment..." : "Pay and Place Order"}
                </Button>
              </div>
            </form>
          </div>

          {/* RIGHT - SUMMARY SIDE CONTAINER PANEL */}
          <div className="p-6 rounded-2xl shadow-sm" style={{ background: '#FFFFFF', border: '1px solid #EDE5D8' }}>
            <h2 className="text-xl font-bold mb-6 text-left" style={{ color: '#2C2416' }}>
              Order Summary
            </h2>

            {cart.length === 0 ? (
              <p className="text-sm font-medium text-left" style={{ color: '#A08B70' }}>No items in your cart.</p>
            ) : (
              <>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm font-semibold"
                      style={{ color: '#7A6A55' }}
                    >
                      <div className="text-left">
                        <p className="font-bold" style={{ color: '#2C2416' }}>{item.name}</p>
                        <p className="text-xs" style={{ color: '#A08B70' }}>Qty: {item.qty}</p>
                      </div>
                      <p className="font-bold" style={{ color: '#2C2416' }}>${item.price * item.qty}</p>
                    </div>
                  ))}
                </div>

                <hr className="my-4" style={{ borderColor: '#EDE5D8' }} />

                <div className="space-y-3 text-sm font-semibold" style={{ color: '#7A6A55' }}>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span style={{ color: '#2C2416' }}>${totalPrice}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount</span>
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
                  <hr className="my-2" style={{ borderColor: '#EDE5D8' }} />
                  <div className="flex justify-between text-base font-bold" style={{ color: '#2C2416' }}>
                    <span>Grand Total</span>
                    <span className="font-black" style={{ color: '#8B6914' }}>${grandTotal}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;