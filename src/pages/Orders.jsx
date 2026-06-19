import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Button from "../components/ui/Button";

const API_URL = import.meta.env.VITE_API_URL;

const Orders = () => {
  const { token } = useContext(CartContext);

  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchMyOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_URL}/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (response.ok && result.status === "success") {
          setOrdersList(result.data || []);
        } else {
          setError(result.message || "Failed to load orders");
        }
      } catch (err) {
        console.error("Error loading my orders:", err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [token]);

  // Color mappings for badges
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "ongoing":
      case "shipped":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "delivered":
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "canceled":
      case "voided":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400 border-slate-200 dark:border-slate-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "succeeded":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "pending":
      case "processing":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      default:
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800";
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF8', color: '#2C2416' }}>
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 rounded-3xl shadow-xl" style={{ background: '#FFFFFF', border: '1px solid #EDE5D8' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
              <svg className="w-8 h-8" style={{ color: '#8B6914' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-3">Login Required</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              Please log in to your account to view your order history and tracking information.
            </p>
            <Link to="/login">
              <Button variant="primary" className="w-full py-3 rounded-xl font-bold">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF8', color: '#2C2416' }}>
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: '#2C2416' }}>
              My Orders
            </h1>
            <p className="text-sm mt-1 font-medium" style={{ color: '#A08B70' }}>
              Track active shipments and view past transaction invoices
            </p>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" className="font-bold">
              Back to Shopping
            </Button>
          </Link>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#8B6914', borderTopColor: 'transparent' }}></div>
            <p className="mt-4 font-bold text-sm" style={{ color: '#A08B70' }}>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 rounded-3xl p-8 max-w-xl mx-auto shadow-sm" style={{ background: '#FFFFFF', border: '1px solid #EDE5D8' }}>
            <p className="text-red-500 font-bold">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : ordersList.length === 0 ? (
          <div className="text-center py-20 rounded-3xl p-8 max-w-xl mx-auto shadow-sm" style={{ background: '#FFFFFF', border: '1px solid #EDE5D8' }}>
            <svg className="w-16 h-16 mx-auto mb-5" style={{ color: '#C4A882' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="text-lg font-bold" style={{ color: '#2C2416' }}>No orders placed yet</h3>
            <p className="mt-2 text-sm font-medium max-w-xs mx-auto" style={{ color: '#A08B70' }}>
              Once you checkout and complete your payment, your orders will show up here.
            </p>
            <Link to="/" className="mt-6 inline-block">
              <Button variant="primary" className="px-6">
                Start Browsing Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {ordersList.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl shadow-sm overflow-hidden text-left"
                style={{ background: '#FFFFFF', border: '1px solid #EDE5D8' }}
              >
                {/* ORDER HEADER */}
                <div className="px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-xs font-semibold" style={{ background: '#FAF7F2', borderBottom: '1px solid #EDE5D8', color: '#7A6A55' }}>
                  <div className="grid grid-cols-2 md:flex md:gap-8 gap-y-2">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: '#A08B70' }}>Order Placed</p>
                      <p className="mt-0.5 font-bold" style={{ color: '#2C2416' }}>
                        {new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: '#A08B70' }}>Total Price</p>
                      <p className="mt-0.5 font-extrabold text-sm sm:text-base" style={{ color: '#2C2416' }}>
                        ${order.totalPrice || order.totalAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: '#A08B70' }}>Ship To</p>
                      <p className="mt-0.5 font-bold truncate max-w-[150px]" style={{ color: '#2C2416' }}>
                        {order.shippingInfo?.city || "Customer Address"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${getStatusColor(order.status || order.orderStatus)}`}>
                      Order: {order.status || order.orderStatus}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${getPaymentStatusColor(order.paymentStatus)}`}>
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* ORDER DETAILS & PRODUCTS */}
                  <div className="p-6 divide-y" style={{ divideColor: '#EDE5D8' }}>
                  {/* PRODUCT ROWS */}
                  <div className="pb-4 space-y-4">
                    {(order.orderItems || order.items || []).map((item, index) => {
                      const title = item.product?.title || item.title || "Product";
                      const image = item.product?.images?.[0]?.url || item.product?.image || "";
                      return (
                        <div key={index} className="flex items-center justify-between gap-4 py-1">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-1" style={{ background: '#FAF7F2', border: '1px solid #EDE5D8' }}>
                              {image ? (
                                <img
                                  src={image}
                                  alt={title}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <span className="text-xl">📦</span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-tight">
                                {title}
                              </h4>
                              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold mt-1">
                                Qty: {item.quantity || item.qty} @ ${item.price} each
                              </p>
                            </div>
                          </div>
                          <p className="font-extrabold text-sm sm:text-base" style={{ color: '#2C2416' }}>
                            ${(item.price * (item.quantity || item.qty))}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* SHIPPING SUMMARY SECTION */}
                    <div className="pt-4 grid sm:grid-cols-2 gap-4 text-xs font-semibold" style={{ color: '#7A6A55' }}>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: '#A08B70' }}>Delivery Destination</p>
                        <p className="mt-1 font-medium leading-relaxed" style={{ color: '#4A3D2C' }}>
                        {order.shippingInfo?.fullAddress || order.shippingAddress}<br />
                        {order.shippingInfo?.city || order.city}
                      </p>
                    </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: '#A08B70' }}>Contact Number</p>
                        <p className="mt-1 font-mono font-medium" style={{ color: '#4A3D2C' }}>
                          {order.shippingInfo?.phone || order.phone}
                        </p>
                        <p className="text-[9px] mt-2" style={{ color: '#A08B70' }}>
                          Tracking Reference: <span className="font-mono" style={{ color: '#8B6914' }}>{order.orderId || order._id}</span>
                        </p>
                      </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
