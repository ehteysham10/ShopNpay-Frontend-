import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/ui/Button";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_STEPS = ["processing", "shipped", "delivered"];
const STATUS_LABELS = { processing: "Processing", shipped: "Shipped", delivered: "Delivered" };
const STATUS_ICONS = {
  processing: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  shipped: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  delivered: "M5 13l4 4L19 7",
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
    case "shipped": return "bg-amber-100 text-amber-800 border-amber-200";
    case "delivered": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "cancelled": return "bg-rose-100 text-rose-800 border-rose-200";
    default: return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

const getPaymentColor = (status) => {
  switch (status?.toLowerCase()) {
    case "paid": case "succeeded": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "pending": return "bg-amber-100 text-amber-800 border-amber-200";
    default: return "bg-rose-100 text-rose-800 border-rose-200";
  }
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const { token } = useContext(CartContext);
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/orders/my-orders`, { headers: { Authorization: `Bearer ${token}` } });
        const result = await res.json();
        if (res.ok && result.status === "success") {
          const found = (result.data || []).find(
            (o) => o.orderId === orderId || o._id === orderId
          );
          if (found) setOrder(found);
          else setError("Order not found.");
        } else {
          setError(result.message || "Failed to load order.");
        }
      } catch {
        setError("Failed to connect to server.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [token, orderId]);

  const currentStatusIndex = order ? STATUS_STEPS.indexOf(order.orderStatus?.toLowerCase()) : -1;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FAFAF8", color: "#2C2416" }}>
      <Navbar />
      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Back link */}
        <button onClick={() => navigate("/orders")} className="flex items-center gap-2 text-sm font-semibold mb-6 hover:opacity-70 transition-opacity" style={{ color: "#8B6914" }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          Back to Orders
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#8B6914", borderTopColor: "transparent" }} />
            <p className="mt-4 font-bold text-sm" style={{ color: "#A08B70" }}>Loading order details…</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 rounded-3xl" style={{ background: "#FFFFFF", border: "1px solid #EDE5D8" }}>
            <p className="text-red-500 font-bold mb-4">{error}</p>
            <Link to="/orders"><Button variant="outline">Back to Orders</Button></Link>
          </div>
        ) : order && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-5">
            {/* Header */}
            <div className="rounded-2xl p-6 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EDE5D8" }}>
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#A08B70" }}>Order Reference</p>
                  <p className="font-mono font-black text-lg" style={{ color: "#8B6914" }}>{order.orderId || order._id}</p>
                  <p className="text-xs font-medium mt-1" style={{ color: "#A08B70" }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-3 py-1 text-[10px] font-extrabold rounded-full border uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span className={`px-3 py-1 text-[10px] font-extrabold rounded-full border uppercase tracking-wider ${getPaymentColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="rounded-2xl p-6 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EDE5D8" }}>
              <h2 className="text-xs font-black uppercase tracking-widest mb-6" style={{ color: "#A08B70" }}>Order Timeline</h2>
              <div className="flex items-start justify-between relative">
                {/* Connecting line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 mx-10" style={{ background: "#EDE5D8", zIndex: 0 }} />
                {STATUS_STEPS.map((step, idx) => {
                  const isCompleted = currentStatusIndex >= idx;
                  const isCurrent = currentStatusIndex === idx;
                  return (
                    <div key={step} className="flex flex-col items-center gap-2 flex-1 relative z-10">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.15 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500"
                        style={{
                          background: isCompleted ? (isCurrent ? "#FEF3C7" : "#8B6914") : "#F5F0E8",
                          borderColor: isCompleted ? "#8B6914" : "#DDD4C4",
                        }}
                      >
                        <svg className="w-5 h-5" style={{ color: isCompleted ? (isCurrent ? "#8B6914" : "#FFFFFF") : "#C4A882" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={STATUS_ICONS[step]} />
                        </svg>
                      </motion.div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-center" style={{ color: isCompleted ? "#8B6914" : "#C4A882" }}>
                        {STATUS_LABELS[step]}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#FEF3C7", color: "#8B6914" }}>Current</span>
                      )}
                    </div>
                  );
                })}
              </div>
              {order.orderStatus?.toLowerCase() === "cancelled" && (
                <div className="mt-5 text-center text-sm font-bold text-rose-500">This order has been cancelled.</div>
              )}
            </div>

            {/* Items */}
            <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EDE5D8" }}>
              <div className="px-6 py-3 border-b" style={{ background: "#FAF7F2", borderColor: "#EDE5D8" }}>
                <h2 className="text-xs font-black uppercase tracking-widest" style={{ color: "#A08B70" }}>Items Ordered</h2>
              </div>
              <div className="divide-y" style={{ divideColor: "#EDE5D8" }}>
                {(order.items || order.orderItems || []).map((item, idx) => {
                  const title = item.product?.title || item.title || "Product";
                  const image = item.product?.images?.[0]?.url || "";
                  const qty = item.quantity || item.qty || 1;
                  const price = item.price || 0;
                  return (
                    <div key={idx} className="flex items-center justify-between gap-4 px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: "#FAF7F2", border: "1px solid #EDE5D8" }}>
                          {image ? <img src={image} alt={title} className="w-full h-full object-contain" /> : <span className="text-lg">📦</span>}
                        </div>
                        <div>
                          <p className="font-bold text-sm" style={{ color: "#2C2416" }}>{title}</p>
                          <p className="text-xs font-semibold mt-0.5" style={{ color: "#A08B70" }}>Qty: {qty} × ${price}</p>
                        </div>
                      </div>
                      <p className="font-extrabold text-sm" style={{ color: "#8B6914" }}>${(price * qty).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="px-6 py-4 border-t flex justify-between items-center" style={{ borderColor: "#EDE5D8", background: "#FAF7F2" }}>
                <span className="font-bold text-sm" style={{ color: "#7A6A55" }}>Order Total</span>
                <span className="font-black text-lg" style={{ color: "#8B6914" }}>${order.totalAmount?.toFixed(2) || order.totalPrice}</span>
              </div>
            </div>

            {/* Shipping info */}
            <div className="rounded-2xl p-6 shadow-sm grid sm:grid-cols-2 gap-6" style={{ background: "#FFFFFF", border: "1px solid #EDE5D8" }}>
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "#A08B70" }}>Delivery Address</h2>
                <p className="text-sm font-medium leading-relaxed" style={{ color: "#4A3D2C" }}>
                  {order.shippingInfo?.fullAddress || "—"}
                </p>
                <p className="text-sm font-bold mt-1" style={{ color: "#2C2416" }}>{order.shippingInfo?.city}</p>
              </div>
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "#A08B70" }}>Contact</h2>
                <p className="font-mono text-sm font-medium" style={{ color: "#4A3D2C" }}>{order.shippingInfo?.phone || "—"}</p>
              </div>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
