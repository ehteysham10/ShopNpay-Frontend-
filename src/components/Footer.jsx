import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Wishlist", to: "/wishlist" },
    { label: "My Orders", to: "/orders" },
    { label: "Cart", to: "/cart" },
    { label: "Profile", to: "/profile" },
  ];

  const categories = [
    { label: "Shoes", to: "/?category=Shoes" },
    { label: "Watches", to: "/?category=Watch" },
    { label: "Phones", to: "/?category=Phone" },
    { label: "Laptops", to: "/?category=Laptops" },
    { label: "Cameras", to: "/?category=Cameras" },
    { label: "Gaming", to: "/?category=Gaming" },
    { label: "Headphones", to: "/?category=Headphones" },
    { label: "Clothing", to: "/?category=Clothing" },
  ];

  return (
    <footer
      className="w-full mt-auto border-t"
      style={{ background: "#FAF7F2", borderColor: "#EDE5D8" }}
    >
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand column */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <span className="text-xl font-black tracking-tight" style={{ color: "#8B6914" }}>
              ShopNpay
            </span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "linear-gradient(135deg, #C4954A, #8B6914)" }}
            />
          </Link>
          <p className="text-sm leading-relaxed font-medium mb-5" style={{ color: "#7A6A55" }}>
            Curated tech, fashion & lifestyle products — handpicked for quality, delivered fast.
          </p>
          {/* Social icons */}
          <div className="flex gap-3">
            {/* Instagram */}
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-110"
              style={{ background: "#FFFFFF", borderColor: "#EDE5D8", color: "#8B7355" }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            {/* Twitter / X */}
            <a
              href="#"
              aria-label="Twitter"
              className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-110"
              style={{ background: "#FFFFFF", borderColor: "#EDE5D8", color: "#8B7355" }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* GitHub */}
            <a
              href="#"
              aria-label="GitHub"
              className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-110"
              style={{ background: "#FFFFFF", borderColor: "#EDE5D8", color: "#8B7355" }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "#C4A882" }}>
            Quick Links
          </h3>
          <ul className="space-y-2.5">
            {quickLinks.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-sm font-medium transition-colors duration-150 hover:underline"
                  style={{ color: "#7A6A55" }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "#C4A882" }}>
            Categories
          </h3>
          <ul className="space-y-2.5">
            {categories.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-sm font-medium transition-colors duration-150 hover:underline"
                  style={{ color: "#7A6A55" }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact / Info */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "#C4A882" }}>
            Get in Touch
          </h3>
          <ul className="space-y-4 text-sm font-medium" style={{ color: "#7A6A55" }}>
            <li className="flex items-start gap-2.5">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#C4A882" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>support@shopnpay.com</span>
            </li>
            <li className="flex items-start gap-2.5">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#C4A882" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Mon – Sat, 9am – 6pm PKT</span>
            </li>
            <li className="flex items-start gap-2.5">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#C4A882" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Pakistan · Nationwide Delivery</span>
            </li>
          </ul>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { label: "72h Delivery" },
              { label: "Secure Pay" },
              { label: "Easy Returns" },
            ].map(({ label }) => (
              <span
                key={label}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg border"
                style={{ background: "#FFFFFF", borderColor: "#EDE5D8", color: "#8B7355" }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{ borderColor: "#EDE5D8" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-medium" style={{ color: "#A08B70" }}>
          <span>© {year} ShopNpay. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
