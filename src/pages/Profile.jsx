import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/ui/Button";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { token, user, logout } = useContext(CartContext);
  const [profile, setProfile] = useState(null);
  const [ordersCount, setOrdersCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, ordersRes] = await Promise.all([
          fetch(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/orders/my-orders`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const profileData = await profileRes.json();
        if (profileRes.ok && profileData.status === "success") setProfile(profileData.data);
        const ordersData = await ordersRes.json();
        if (ordersRes.ok && ordersData.status === "success") setOrdersCount((ordersData.data || []).length);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const displayUser = profile || user;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "—";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FAFAF8", color: "#2C2416" }}>
      <Navbar />
      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#8B6914", borderTopColor: "transparent" }} />
            <p className="mt-4 font-bold text-sm" style={{ color: "#A08B70" }}>Loading your profile…</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
            {/* Hero card */}
            <div className="rounded-3xl p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6" style={{ background: "#FFFFFF", border: "1px solid #EDE5D8" }}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white flex-shrink-0 shadow-md" style={{ background: "linear-gradient(135deg, #8B6914, #C4954A)" }}>
                {displayUser?.name ? displayUser.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: "#2C2416" }}>{displayUser?.name || "User"}</h1>
                <p className="text-sm font-medium mt-1" style={{ color: "#7A6A55" }}>{displayUser?.email || "—"}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  <span className="px-3 py-1 text-[11px] font-extrabold rounded-full uppercase tracking-wider border" style={{ background: displayUser?.role === "admin" ? "#FEF3C7" : "#F0FDF4", borderColor: displayUser?.role === "admin" ? "#FDE68A" : "#BBF7D0", color: displayUser?.role === "admin" ? "#8B6914" : "#15803D" }}>
                    {displayUser?.role === "admin" ? "⚡ Admin" : "✓ Customer"}
                  </span>
                  {displayUser?.isVerified && (
                    <span className="px-3 py-1 text-[11px] font-extrabold rounded-full uppercase tracking-wider border" style={{ background: "#EFF6FF", borderColor: "#BFDBFE", color: "#1D4ED8" }}>✓ Verified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Total Orders", value: ordersCount !== null ? ordersCount : "—", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "#8B6914", bg: "#FEF3C7" },
                { label: "Member Since", value: formatDate(displayUser?.createdAt), icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "#6B9E7A", bg: "#F0FDF4" },
                { label: "Auth Provider", value: displayUser?.authProvider === "google" ? "Google OAuth" : "Email & Password", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", color: "#7C3AED", bg: "#F5F3FF" },
              ].map(({ label, value, icon, color, bg }) => (
                <div key={label} className="rounded-2xl p-5 flex flex-col gap-3 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EDE5D8" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                    <svg className="w-5 h-5" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} /></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#A08B70" }}>{label}</p>
                    <p className="text-sm font-extrabold mt-0.5" style={{ color: "#2C2416" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl p-6 shadow-sm" style={{ background: "#FFFFFF", border: "1px solid #EDE5D8" }}>
              <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: "#A08B70" }}>Quick Actions</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Link to="/orders"><Button variant="outline" className="w-full py-3 font-bold">View My Orders</Button></Link>
                <Link to="/wishlist"><Button variant="outline" className="w-full py-3 font-bold">My Wishlist</Button></Link>
                <Link to="/"><Button variant="outline" className="w-full py-3 font-bold">Browse Products</Button></Link>
                <button onClick={logout} className="w-full py-3 rounded-xl font-bold text-sm border transition-all hover:bg-red-50 cursor-pointer" style={{ borderColor: "#FCA5A5", color: "#EF4444" }}>
                  Sign Out
                </button>
              </div>
            </div>
            <p className="text-center text-xs font-medium" style={{ color: "#C4A882" }}>Profile editing coming soon. Contact support to update your details.</p>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
