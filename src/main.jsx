import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import CartProvider from "./context/CartContext";

// ── Warm up the Render backend as early as possible ──────────────────────────
// This fires before React renders anything, giving the cold-start server the
// maximum possible head-start while the browser is still parsing/painting UI.
(function warmServer() {
  const API_URL = import.meta.env.VITE_API_URL;
  const WARM_KEY = "shopnpay_server_warm_ts";
  const WARM_TTL = 4 * 60 * 1000; // re-ping every 4 min
  try {
    const last = Number(sessionStorage.getItem(WARM_KEY) || 0);
    if (Date.now() - last > WARM_TTL) {
      sessionStorage.setItem(WARM_KEY, String(Date.now()));
      fetch(`${API_URL}/products?limit=1`, { method: "GET" }).catch(() => {});
    }
  } catch (_) { /* ignore */ }
})();

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <CartProvider>
      <App />
      <ToastContainer position="top-right" />
    </CartProvider>
  </BrowserRouter>
);