import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  // Core cart state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist state (array of product ids)
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Orders array – each order contains items, subtotal, discount, total, date
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  // UI flags
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved : "light";
  });

  // Coupon handling
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem("appliedCoupon");
    return saved ? JSON.parse(saved) : null;
  });

  // Persist all relevant pieces to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  // Cart manipulation actions
  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    toast.success("Added to cart!");
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    toast.error("Removed from cart");
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // Wishlist actions
  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
    toast.info(prev => prev.includes(productId) ? "Removed from Wishlist" : "Added to Wishlist");
  };

  // Theme toggle
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Cart drawer toggle
  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  // Coupon handling – simple fixed‑percentage coupons
  const couponCatalog = {
    SAVE10: 0.1,
    SAVE20: 0.2,
    SAVE30: 0.3,
  };

  const applyCoupon = (code) => {
    const discount = couponCatalog[code.toUpperCase()];
    if (discount) {
      setAppliedCoupon({ code: code.toUpperCase(), discount });
      toast.success(`Coupon ${code.toUpperCase()} applied!`);
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

  // Order placement
  const placeOrder = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
    const total = subtotal - discount;
    const newOrder = {
      id: Date.now(),
      items: cart,
      subtotal,
      discount,
      total,
      date: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setAppliedCoupon(null);
    toast.success("Order placed successfully!");
    return newOrder;
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = appliedCoupon ? totalPrice * appliedCoupon.discount : 0;
  const finalPrice = totalPrice - discountAmount;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        totalPrice,
        discountAmount,
        finalPrice,
        wishlist,
        toggleWishlist,
        theme,
        toggleTheme,
        isCartOpen,
        toggleCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        orders,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;