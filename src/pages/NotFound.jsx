import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "linear-gradient(135deg, #FDFCFB 0%, #F5F2EE 60%, #FAF6F0 100%)" }}
    >
      {/* Decorative blobs */}
      <div
        className="fixed top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(196,168,130,0.12)" }}
      />
      <div
        className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(139,105,68,0.08)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative flex flex-col items-center max-w-lg"
      >
        {/* 404 number */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="font-black leading-none select-none"
          style={{
            fontSize: "clamp(7rem, 20vw, 14rem)",
            backgroundImage: "linear-gradient(130deg, #C4A882 0%, #8B6914 45%, #D4A843 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.04em",
          }}
        >
          404
        </motion.h1>

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 -mt-4"
          style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}
        >
          <svg className="w-8 h-8" style={{ color: "#8B6914" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>

        {/* Copy */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl sm:text-3xl font-black tracking-tight mb-3"
          style={{ color: "#2C2416" }}
        >
          Page Not Found
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm sm:text-base leading-relaxed mb-8 font-medium max-w-sm"
          style={{ color: "#7A6A55" }}
        >
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-100"
            style={{
              background: "linear-gradient(135deg, #8B6914 0%, #C4954A 100%)",
              boxShadow: "0 8px 24px rgba(139,105,20,0.3)",
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          <Link
            to="/"
            onClick={() => setTimeout(() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" }), 300)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm border transition-all duration-200 hover:scale-105 active:scale-100"
            style={{ background: "rgba(255,255,255,0.85)", borderColor: "#DDD4C4", color: "#5A4A35" }}
          >
            Browse Products
          </Link>
        </motion.div>

        {/* Fun label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-10 text-xs font-medium"
          style={{ color: "#C4A882" }}
        >
          ShopNpay · Lost in the store? We'll help you find your way.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;
