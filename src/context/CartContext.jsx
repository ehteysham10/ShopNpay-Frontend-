// import { createContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";

// export const CartContext = createContext();

// const API_URL = import.meta.env.VITE_API_URL;

// // Helper to normalize product schema
// const normalizeProduct = (backendProduct) => ({
//   id: backendProduct.productId,
//   productId: backendProduct.productId,
//   _id: backendProduct._id,
//   name: backendProduct.title,
//   title: backendProduct.title,
//   price: backendProduct.price,
//   category: backendProduct.category,
//   image: backendProduct.images?.[0]?.url || "",
//   images: backendProduct.images || [],
//   description: backendProduct.description,
//   rating: backendProduct.rating || 4.5,
// });

// // Helper to normalize cart items schema
// const normalizeCart = (backendCart) => {
//   if (!Array.isArray(backendCart)) return [];
//   return backendCart.map(item => ({
//     id: item.product.productId,
//     productId: item.product.productId,
//     _id: item.product._id,
//     name: item.product.title,
//     price: item.product.price,
//     image: item.product.images?.[0]?.url || "",
//     qty: item.quantity,
//     quantity: item.quantity
//   }));
// };

// // Helper to normalize wishlist items schema
// const normalizeWishlist = (backendWishlist) => {
//   if (!Array.isArray(backendWishlist)) return [];
//   return backendWishlist.map(product => normalizeProduct(product));
// };


// const CartProvider = ({ children }) => {
//   // Authentication state
//   const [user, setUser] = useState(() => {
//     try {
//       const saved = localStorage.getItem("user");
//       return saved && saved !== "undefined" ? JSON.parse(saved) : null;
//     } catch (e) {
//       console.error("Error parsing user from localStorage:", e);
//       return null;
//     }
//   });

//   const [token, setToken] = useState(() => {
//     try {
//       return localStorage.getItem("token") || null;
//     } catch {
//       return null;
//     }
//   });

//   // Core cart state
//   const [cart, setCart] = useState(() => {
//     try {
//       const saved = localStorage.getItem("cart");
//       return saved && saved !== "undefined" ? JSON.parse(saved) : [];
//     } catch (e) {
//       console.error("Error parsing cart from localStorage:", e);
//       return [];
//     }
//   });

//   // Wishlist state (array of product objects when logged in, ids when guest)
//   const [wishlist, setWishlist] = useState(() => {
//     try {
//       const saved = localStorage.getItem("wishlist");
//       return saved && saved !== "undefined" ? JSON.parse(saved) : [];
//     } catch (e) {
//       console.error("Error parsing wishlist from localStorage:", e);
//       return [];
//     }
//   });

//   // Orders array
//   const [orders, setOrders] = useState(() => {
//     try {
//       const saved = localStorage.getItem("orders");
//       return saved && saved !== "undefined" ? JSON.parse(saved) : [];
//     } catch (e) {
//       console.error("Error parsing orders from localStorage:", e);
//       return [];
//     }
//   });

//   // UI flags
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     try {
//       const saved = localStorage.getItem("theme");
//       return saved ? saved : "dark";
//     } catch {
//       return "dark";
//     }
//   });

//   // Coupon handling
//   const [appliedCoupon, setAppliedCoupon] = useState(() => {
//     try {
//       const saved = localStorage.getItem("appliedCoupon");
//       return saved && saved !== "undefined" ? JSON.parse(saved) : null;
//     } catch (e) {
//       console.error("Error parsing appliedCoupon from localStorage:", e);
//       return null;
//     }
//   });

//   // Persist guest states/theme to localStorage
//   useEffect(() => {
//     if (!token) {
//       localStorage.setItem("cart", JSON.stringify(cart));
//     }
//   }, [cart, token]);

//   useEffect(() => {
//     if (!token) {
//       localStorage.setItem("wishlist", JSON.stringify(wishlist));
//     }
//   }, [wishlist, token]);

//   useEffect(() => {
//     localStorage.setItem("orders", JSON.stringify(orders));
//   }, [orders]);

//   useEffect(() => {
//     localStorage.setItem("theme", theme);
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [theme]);

//   useEffect(() => {
//     localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
//   }, [appliedCoupon]);

//   // Sync cart and wishlist from backend on login
//   useEffect(() => {
//     if (token) {
//       const fetchCartAndWishlist = async () => {
//         try {
//           // Fetch cart
//           const cartRes = await fetch(`${API_URL}/cart`, {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           });
//           if (cartRes.ok) {
//             const cartData = await cartRes.json();
//             if (cartData.status === "success") {
//               setCart(normalizeCart(cartData.data || []));
//             }
//           }

//           // Fetch wishlist
//           const wishlistRes = await fetch(`${API_URL}/wishlist`, {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           });
//           if (wishlistRes.ok) {
//             const wishlistData = await wishlistRes.json();
//             if (wishlistData.status === "success") {
//               setWishlist(normalizeWishlist(wishlistData.data || []));
//             }
//           }
//         } catch (error) {
//           console.error("Error fetching cart/wishlist:", error);
//         }
//       };
//       fetchCartAndWishlist();
//     } else {
//       const savedCart = localStorage.getItem("cart");
//       try {
//         setCart(savedCart && savedCart !== "undefined" ? JSON.parse(savedCart) : []);
//       } catch {
//         setCart([]);
//       }
//       const savedWishlist = localStorage.getItem("wishlist");
//       try {
//         setWishlist(savedWishlist && savedWishlist !== "undefined" ? JSON.parse(savedWishlist) : []);
//       } catch {
//         setWishlist([]);
//       }
//     }
//   }, [token]);

//   // Register user action
//   const register = async (name, email, password, confirmPassword) => {
//     try {
//       const response = await fetch(`${API_URL}/auth/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ name, email, password, confirmPassword })
//       });
//       const result = await response.json();
//       if (response.ok && result.status === "success") {
//         toast.success("Registration successful! Please verify your email or log in.");
//         return { success: true };
//       } else {
//         throw new Error(result.message || "Registration failed");
//       }
//     } catch (error) {
//       toast.error(error.message);
//       return { success: false, error: error.message };
//     }
//   };

//   // Login user action
//   const login = async (email, password) => {
//     try {
//       const response = await fetch(`${API_URL}/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email, password })
//       });
//       const result = await response.json();
//       if (response.ok && result.status === "success") {
//         const { token: userToken, user: userProfile } = result.data;
//         setToken(userToken);
//         setUser(userProfile);
//         localStorage.setItem("token", userToken);
//         localStorage.setItem("user", JSON.stringify(userProfile));
//         toast.success(`Welcome back, ${userProfile.name}!`);
//         return { success: true, user: userProfile };
//       } else {
//         throw new Error(result.message || "Login failed");
//       }
//     } catch (error) {
//       toast.error(error.message);
//       return { success: false, error: error.message };
//     }
//   };

//   // Forgot password action
//   const forgotPassword = async (email) => {
//     try {
//       const response = await fetch(`${API_URL}/auth/forgot-password`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email })
//       });
//       const result = await response.json();
//       if (response.ok && result.status === "success") {
//         toast.success("Password reset link sent to your email!");
//         return { success: true };
//       } else {
//         throw new Error(result.message || "Failed to send reset link");
//       }
//     } catch (error) {
//       toast.error(error.message);
//       return { success: false, error: error.message };
//     }
//   };

//   // Reset password action
//   const resetPassword = async (resetToken, password) => {
//     try {
//       const response = await fetch(`${API_URL}/auth/reset-password/${resetToken}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ password })
//       });
//       const result = await response.json();
//       if (response.ok && result.status === "success") {
//         toast.success("Password reset successful! You can now log in.");
//         return { success: true };
//       } else {
//         throw new Error(result.message || "Failed to reset password");
//       }
//     } catch (error) {
//       toast.error(error.message);
//       return { success: false, error: error.message };
//     }
//   };

//   // Google OAuth Login
//   const loginGoogle = async (credential) => {
//     try {
//       const response = await fetch(`${API_URL}/auth/google`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ credential })
//       });
//       const result = await response.json();
//       if (response.ok && result.status === "success") {
//         const { token: userToken, user: userProfile } = result.data;
//         setToken(userToken);
//         setUser(userProfile);
//         localStorage.setItem("token", userToken);
//         localStorage.setItem("user", JSON.stringify(userProfile));
//         toast.success(`Welcome back, ${userProfile.name}!`);
//         return { success: true, user: userProfile };
//       } else {
//         throw new Error(result.message || "Google authentication failed");
//       }
//     } catch (error) {
//       console.error("Google login error:", error);
//       toast.error(error.message || "Failed to authenticate with Google");
//       return { success: false, error: error.message };
//     }
//   };

//   // Logout action
//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     setCart([]);
//     setWishlist([]);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("cart");
//     localStorage.removeItem("wishlist");
//     toast.info("Logged out successfully");
//   };

//   // Cart operations helper
//   const updateCartQty = async (productId, newQty) => {
//     if (token) {
//       try {
//         const response = await fetch(`${API_URL}/cart/${productId}`, {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify({ quantity: newQty })
//         });
//         const result = await response.json();
//         if (response.ok && result.status === "success") {
//           setCart(normalizeCart(result.data || []));
//         } else {
//           toast.error(result.message || "Failed to update quantity");
//         }
//       } catch (error) {
//         console.error("Update quantity error:", error);
//       }
//     } else {
//       setCart(
//         cart.map((item) =>
//           item.id === productId ? { ...item, qty: newQty, quantity: newQty } : item
//         )
//       );
//     }
//   };

//   // Add item to cart
//   const addToCart = async (product) => {
//     const productId = product.productId || product.id;
//     if (token) {
//       try {
//         const response = await fetch(`${API_URL}/cart/${productId}`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           }
//         });
//         const result = await response.json();
//         if (response.ok && result.status === "success") {
//           setCart(normalizeCart(result.data || []));
//           toast.success("Added to cart!");
//         } else {
//           if (result.message && result.message.includes("already in your cart")) {
//             const existingItem = cart.find(item => item.id === productId);
//             if (existingItem) {
//               const newQty = Math.min((existingItem.qty || existingItem.quantity) + 1, 5);
//               updateCartQty(productId, newQty);
//               toast.success("Incremented quantity in cart!");
//             }
//           } else {
//             toast.error(result.message || "Failed to add to cart");
//           }
//         }
//       } catch (error) {
//         console.error("Add to cart error:", error);
//         toast.error("Failed to add to cart");
//       }
//     } else {
//       const existing = cart.find((item) => item.id === productId);
//       if (existing) {
//         setCart(
//           cart.map((item) =>
//             item.id === productId ? { ...item, qty: item.qty + 1, quantity: item.qty + 1 } : item
//           )
//         );
//       } else {
//         const normalized = {
//           id: productId,
//           productId: productId,
//           name: product.name || product.title,
//           price: product.price,
//           image: product.image || product.images?.[0]?.url || "",
//           qty: 1,
//           quantity: 1
//         };
//         setCart([...cart, normalized]);
//       }
//       toast.success("Added to cart!");
//     }
//   };

//   // Remove item from cart
//   const removeFromCart = async (id) => {
//     if (token) {
//       try {
//         const response = await fetch(`${API_URL}/cart/${id}`, {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         const result = await response.json();
//         if (response.ok && result.status === "success") {
//           setCart(normalizeCart(result.data || []));
//           toast.error("Removed from cart");
//         } else {
//           toast.error(result.message || "Failed to remove item");
//         }
//       } catch (error) {
//         console.error("Remove from cart error:", error);
//       }
//     } else {
//       setCart(cart.filter((item) => item.id !== id));
//       toast.error("Removed from cart");
//     }
//   };

//   // Increase qty
//   const increaseQty = (id) => {
//     const item = cart.find((i) => i.id === id);
//     if (item) {
//       const newQty = Math.min((item.qty || item.quantity) + 1, 5);
//       updateCartQty(id, newQty);
//     }
//   };

//   // Decrease qty
//   const decreaseQty = (id) => {
//     const item = cart.find((i) => i.id === id);
//     if (item) {
//       const newQty = (item.qty || item.quantity) - 1;
//       if (newQty <= 0) {
//         removeFromCart(id);
//       } else {
//         updateCartQty(id, newQty);
//       }
//     }
//   };

//   // Wishlist actions
//   const toggleWishlist = async (productId) => {
//     if (token) {
//       const isAdded = wishlist.some((item) => (item.id === productId || item === productId));
//       try {
//         const url = `${API_URL}/wishlist/${productId}`;
//         const method = isAdded ? "DELETE" : "POST";
//         const response = await fetch(url, {
//           method,
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         const result = await response.json();
//         if (response.ok && result.status === "success") {
//           setWishlist(normalizeWishlist(result.data || []));
//           if (isAdded) {
//             toast.info("Removed from Wishlist");
//           } else {
//             toast.success("Added to Wishlist");
//           }
//         } else {
//           toast.error(result.message || "Failed to update wishlist");
//         }
//       } catch (error) {
//         console.error("Wishlist toggle error:", error);
//         toast.error("Failed to update wishlist");
//       }
//     } else {
//       setWishlist((prev) => {
//         const isAdded = prev.includes(productId);
//         if (isAdded) {
//           toast.info("Removed from Wishlist");
//           return prev.filter((id) => id !== productId);
//         } else {
//           toast.success("Added to Wishlist");
//           return [...prev, productId];
//         }
//       });
//     }
//   };

//   // Theme toggle
//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "light" ? "dark" : "light"));
//   };

//   // Cart drawer toggle
//   const toggleCart = () => {
//     setIsCartOpen((prev) => !prev);
//   };

//   // Coupon handling
//   const couponCatalog = {
//     SAVE10: 0.1,
//     SAVE20: 0.2,
//     SAVE30: 0.3,
//   };

//   const applyCoupon = (code) => {
//     const discount = couponCatalog[code.toUpperCase()];
//     if (discount) {
//       setAppliedCoupon({ code: code.toUpperCase(), discount });
//       toast.success(`Coupon ${code.toUpperCase()} applied!`);
//       return true;
//     } else {
//       toast.error("Invalid coupon code");
//       return false;
//     }
//   };

//   const removeCoupon = () => {
//     setAppliedCoupon(null);
//     toast.info("Coupon removed");
//   };

//   // Order placement (kept for local guest/history compatibility)
//   const placeOrder = () => {
//     const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
//     const discount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
//     const total = subtotal - discount;
//     const newOrder = {
//       id: Date.now(),
//       items: cart,
//       subtotal,
//       discount,
//       total,
//       date: new Date().toISOString(),
//     };
//     setOrders((prev) => [newOrder, ...prev]);
//     setCart([]);
//     setAppliedCoupon(null);
//     toast.success("Order placed successfully!");
//     return newOrder;
//   };

//   const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.qty || item.quantity), 0);
//   const discountAmount = appliedCoupon ? totalPrice * appliedCoupon.discount : 0;
//   const finalPrice = totalPrice - discountAmount;

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         increaseQty,
//         decreaseQty,
//         totalPrice,
//         discountAmount,
//         finalPrice,
//         wishlist,
//         toggleWishlist,
//         theme,
//         toggleTheme,
//         isCartOpen,
//         toggleCart,
//         appliedCoupon,
//         applyCoupon,
//         removeCoupon,
//         orders,
//         setOrders,
//         placeOrder,
//         user,
//         setUser,
//         token,
//         login,
//         register,
//         forgotPassword,
//         resetPassword,
//         loginGoogle,
//         logout,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider; 











// import { createContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";

// export const CartContext = createContext();

// const API_URL = import.meta.env.VITE_API_URL;

// // Helper to normalize product schema
// const normalizeProduct = (backendProduct) => ({
//   id: backendProduct.productId,
//   productId: backendProduct.productId,
//   _id: backendProduct._id,
//   name: backendProduct.title,
//   title: backendProduct.title,
//   price: backendProduct.price,
//   category: backendProduct.category,
//   image: backendProduct.images?.[0]?.url || "",
//   images: backendProduct.images || [],
//   description: backendProduct.description,
//   rating: backendProduct.rating || 4.5,
// });

// // Helper to normalize cart items schema
// const normalizeCart = (backendCart) => {
//   if (!Array.isArray(backendCart)) return [];
//   return backendCart.map(item => ({
//     id: item.product.productId,
//     productId: item.product.productId,
//     _id: item.product._id,
//     name: item.product.title,
//     price: item.product.price,
//     image: item.product.images?.[0]?.url || "",
//     qty: item.quantity,
//     quantity: item.quantity
//   }));
// };

// // Helper to normalize wishlist items schema
// const normalizeWishlist = (backendWishlist) => {
//   if (!Array.isArray(backendWishlist)) return [];
//   return backendWishlist.map(product => normalizeProduct(product));
// };


// const CartProvider = ({ children }) => {
//   // Authentication state
//   const [user, setUser] = useState(() => {
//     try {
//       const saved = localStorage.getItem("user");
//       return saved && saved !== "undefined" ? JSON.parse(saved) : null;
//     } catch (e) {
//       console.error("Error parsing user from localStorage:", e);
//       return null;
//     }
//   });

//   const [token, setToken] = useState(() => {
//     try {
//       return localStorage.getItem("token") || null;
//     } catch {
//       return null;
//     }
//   });

//   // Core cart state
//   const [cart, setCart] = useState(() => {
//     try {
//       const saved = localStorage.getItem("cart");
//       return saved && saved !== "undefined" ? JSON.parse(saved) : [];
//     } catch (e) {
//       console.error("Error parsing cart from localStorage:", e);
//       return [];
//     }
//   });

//   // Wishlist state (array of product objects when logged in, ids when guest)
//   const [wishlist, setWishlist] = useState(() => {
//     try {
//       const saved = localStorage.getItem("wishlist");
//       return saved && saved !== "undefined" ? JSON.parse(saved) : [];
//     } catch (e) {
//       console.error("Error parsing wishlist from localStorage:", e);
//       return [];
//     }
//   });

//   // Orders array
//   const [orders, setOrders] = useState(() => {
//     try {
//       const saved = localStorage.getItem("orders");
//       return saved && saved !== "undefined" ? JSON.parse(saved) : [];
//     } catch (e) {
//       console.error("Error parsing orders from localStorage:", e);
//       return [];
//     }
//   });

//   // UI flags
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [theme, setTheme] = useState(() => {
//     try {
//       const saved = localStorage.getItem("theme");
//       return saved ? saved : "dark";
//     } catch {
//       return "dark";
//     }
//   });

//   // Coupon handling
//   const [appliedCoupon, setAppliedCoupon] = useState(() => {
//     try {
//       const saved = localStorage.getItem("appliedCoupon");
//       return saved && saved !== "undefined" ? JSON.parse(saved) : null;
//     } catch (e) {
//       console.error("Error parsing appliedCoupon from localStorage:", e);
//       return null;
//     }
//   });

//   // Persist guest states/theme to localStorage
//   useEffect(() => {
//     if (!token) {
//       localStorage.setItem("cart", JSON.stringify(cart));
//     }
//   }, [cart, token]);

//   useEffect(() => {
//     if (!token) {
//       localStorage.setItem("wishlist", JSON.stringify(wishlist));
//     }
//   }, [wishlist, token]);

//   useEffect(() => {
//     localStorage.setItem("orders", JSON.stringify(orders));
//   }, [orders]);

//   useEffect(() => {
//     localStorage.setItem("theme", theme);
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [theme]);

//   useEffect(() => {
//     localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
//   }, [appliedCoupon]);

//   // Sync cart and wishlist from backend on login
//   useEffect(() => {
//     if (token) {
//       const fetchCartAndWishlist = async () => {
//         try {
//           // Fetch cart
//           const cartRes = await fetch(`${API_URL}/cart`, {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           });
//           if (cartRes.ok) {
//             const cartData = await cartRes.json();
//             if (cartData.status === "success") {
//               setCart(normalizeCart(cartData.data || []));
//             }
//           }

//           // Fetch wishlist
//           const wishlistRes = await fetch(`${API_URL}/wishlist`, {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           });
//           if (wishlistRes.ok) {
//             const wishlistData = await wishlistRes.json();
//             if (wishlistData.status === "success") {
//               setWishlist(normalizeWishlist(wishlistData.data || []));
//             }
//           }
//         } catch (error) {
//           console.error("Error fetching cart/wishlist:", error);
//         }
//       };
//       fetchCartAndWishlist();
//     } else {
//       const savedCart = localStorage.getItem("cart");
//       try {
//         setCart(savedCart && savedCart !== "undefined" ? JSON.parse(savedCart) : []);
//       } catch {
//         setCart([]);
//       }
//       const savedWishlist = localStorage.getItem("wishlist");
//       try {
//         setWishlist(savedWishlist && savedWishlist !== "undefined" ? JSON.parse(savedWishlist) : []);
//       } catch {
//         setWishlist([]);
//       }
//     }
//   }, [token]);

//   // Register user action
//   const register = async (name, email, password, confirmPassword) => {
//     try {
//       const response = await fetch(`${API_URL}/auth/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ name, email, password, confirmPassword })
//       });
//       const result = await response.json();
//       if (response.ok && result.status === "success") {
//         toast.success("Registration successful! Please verify your email or log in.");
//         return { success: true };
//       } else {
//         throw new Error(result.message || "Registration failed");
//       }
//     } catch (error) {
//       toast.error(error.message);
//       return { success: false, error: error.message };
//     }
//   };

//   // Login user action
//   const login = async (email, password) => {
//     try {
//       const response = await fetch(`${API_URL}/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email, password })
//       });
//       const result = await response.json();
//       if (response.ok && result.status === "success") {
//         const { token: userToken, user: userProfile } = result.data;
//         setToken(userToken);
//         setUser(userProfile);
//         localStorage.setItem("token", userToken);
//         localStorage.setItem("user", JSON.stringify(userProfile));
//         toast.success(`Welcome back, ${userProfile.name}!`);
//         return { success: true, user: userProfile };
//       } else {
//         throw new Error(result.message || "Login failed");
//       }
//     } catch (error) {
//       toast.error(error.message);
//       return { success: false, error: error.message };
//     }
//   };

//   // Forgot password action
//   const forgotPassword = async (email) => {
//     try {
//       const response = await fetch(`${API_URL}/auth/forgot-password`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email })
//       });
//       const result = await response.json();
//       if (response.ok && result.status === "success") {
//         toast.success("Password reset link sent to your email!");
//         return { success: true };
//       } else {
//         throw new Error(result.message || "Failed to send reset link");
//       }
//     } catch (error) {
//       toast.error(error.message);
//       return { success: false, error: error.message };
//     }
//   };

//   // Reset password action
//   const resetPassword = async (resetToken, password) => {
//     try {
//       const response = await fetch(`${API_URL}/auth/reset-password/${resetToken}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ password })
//       });
//       const result = await response.json();
//       if (response.ok && result.status === "success") {
//         toast.success("Password reset successful! You can now log in.");
//         return { success: true };
//       } else {
//         throw new Error(result.message || "Failed to reset password");
//       }
//     } catch (error) {
//       toast.error(error.message);
//       return { success: false, error: error.message };
//     }
//   };

//   // Google OAuth Login
//   const loginGoogle = async (credential) => {
//     try {
//       const response = await fetch(`${API_URL}/auth/google`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ credential })
//       });
//       const result = await response.json();
//       if (response.ok && result.status === "success") {
//         const { token: userToken, user: userProfile } = result.data;
//         setToken(userToken);
//         setUser(userProfile);
//         localStorage.setItem("token", userToken);
//         localStorage.setItem("user", JSON.stringify(userProfile));
//         toast.success(`Welcome back, ${userProfile.name}!`);
//         return { success: true, user: userProfile };
//       } else {
//         throw new Error(result.message || "Google authentication failed");
//       }
//     } catch (error) {
//       console.error("Google login error:", error);
//       toast.error(error.message || "Failed to authenticate with Google");
//       return { success: false, error: error.message };
//     }
//   };

//   // Logout action
//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     setCart([]);
//     setWishlist([]);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("cart");
//     localStorage.removeItem("wishlist");
//     toast.info("Logged out successfully");
//   };

//   // Cart operations helper
//   const updateCartQty = async (productId, newQty) => {
//     if (token) {
//       try {
//         const response = await fetch(`${API_URL}/cart/${productId}`, {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify({ quantity: newQty })
//         });
//         const result = await response.json();
//         if (response.ok && result.status === "success") {
//           setCart(normalizeCart(result.data || []));
//         } else {
//           toast.error(result.message || "Failed to update quantity");
//         }
//       } catch (error) {
//         console.error("Update quantity error:", error);
//       }
//     } else {
//       setCart(
//         cart.map((item) =>
//           item.id === productId ? { ...item, qty: newQty, quantity: newQty } : item
//         )
//       );
//     }
//   };

//   // Add item to cart
//   const addToCart = async (product) => {
//     const productId = product.productId || product.id;
//     if (token) {
//       try {
//         const response = await fetch(`${API_URL}/cart/${productId}`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           }
//         });
//         const result = await response.json();
//         if (response.ok && result.status === "success") {
//           setCart(normalizeCart(result.data || []));
//           toast.success("Added to cart!");
//         } else {
//           if (result.message && result.message.includes("already in your cart")) {
//             const existingItem = cart.find(item => item.id === productId);
//             if (existingItem) {
//               const newQty = Math.min((existingItem.qty || existingItem.quantity) + 1, 5);
//               updateCartQty(productId, newQty);
//               toast.success("Incremented quantity in cart!");
//             }
//           } else {
//             toast.error(result.message || "Failed to add to cart");
//           }
//         }
//       } catch (error) {
//         console.error("Add to cart error:", error);
//         toast.error("Failed to add to cart");
//       }
//     } else {
//       const existing = cart.find((item) => item.id === productId);
//       if (existing) {
//         setCart(
//           cart.map((item) =>
//             item.id === productId ? { ...item, qty: item.qty + 1, quantity: item.qty + 1 } : item
//           )
//         );
//       } else {
//         const normalized = {
//           id: productId,
//           productId: productId,
//           name: product.name || product.title,
//           price: product.price,
//           image: product.image || product.images?.[0]?.url || "",
//           qty: 1,
//           quantity: 1
//         };
//         setCart([...cart, normalized]);
//       }
//       toast.success("Added to cart!");
//     }
//   };

//   // Remove item from cart
//   const removeFromCart = async (id) => {
//     if (token) {
//       try {
//         const response = await fetch(`${API_URL}/cart/${id}`, {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         const result = await response.json();
//         if (response.ok && result.status === "success") {
//           setCart(normalizeCart(result.data || []));
//           toast.error("Removed from cart");
//         } else {
//           toast.error(result.message || "Failed to remove item");
//         }
//       } catch (error) {
//         console.error("Remove from cart error:", error);
//       }
//     } else {
//       setCart(cart.filter((item) => item.id !== id));
//       toast.error("Removed from cart");
//     }
//   };

//   // Increase qty
//   const increaseQty = (id) => {
//     const item = cart.find((i) => i.id === id);
//     if (item) {
//       const newQty = Math.min((item.qty || item.quantity) + 1, 5);
//       updateCartQty(id, newQty);
//     }
//   };

//   // Decrease qty
//   const decreaseQty = (id) => {
//     const item = cart.find((i) => i.id === id);
//     if (item) {
//       const newQty = (item.qty || item.quantity) - 1;
//       if (newQty <= 0) {
//         removeFromCart(id);
//       } else {
//         updateCartQty(id, newQty);
//       }
//     }
//   };

//   // Wishlist actions
//   const toggleWishlist = async (productId) => {
//     if (token) {
//       const isAdded = wishlist.some((item) => (item.id === productId || item === productId));
//       try {
//         const url = `${API_URL}/wishlist/${productId}`;
//         const method = isAdded ? "DELETE" : "POST";
//         const response = await fetch(url, {
//           method,
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         const result = await response.json();
//         if (response.ok && result.status === "success") {
//           setWishlist(normalizeWishlist(result.data || []));
//           if (isAdded) {
//             toast.info("Removed from Wishlist");
//           } else {
//             toast.success("Added to Wishlist");
//           }
//         } else {
//           toast.error(result.message || "Failed to update wishlist");
//         }
//       } catch (error) {
//         console.error("Wishlist toggle error:", error);
//         toast.error("Failed to update wishlist");
//       }
//     } else {
//       setWishlist((prev) => {
//         const isAdded = prev.includes(productId);
//         if (isAdded) {
//           toast.info("Removed from Wishlist");
//           return prev.filter((id) => id !== productId);
//         } else {
//           toast.success("Added to Wishlist");
//           return [...prev, productId];
//         }
//       });
//     }
//   };

//   // Theme toggle
//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "light" ? "dark" : "light"));
//   };

//   // Cart drawer toggle
//   const toggleCart = () => {
//     setIsCartOpen((prev) => !prev);
//   };

//   // Coupon handling
//   const couponCatalog = {
//     SAVE10: 0.1,
//     SAVE20: 0.2,
//     SAVE30: 0.3,
//   };

//   const applyCoupon = (code) => {
//     const discount = couponCatalog[code.toUpperCase()];
//     if (discount) {
//       setAppliedCoupon({ code: code.toUpperCase(), discount });
//       toast.success(`Coupon ${code.toUpperCase()} applied!`);
//       return true;
//     } else {
//       toast.error("Invalid coupon code");
//       return false;
//     }
//   };

//   const removeCoupon = () => {
//     setAppliedCoupon(null);
//     toast.info("Coupon removed");
//   };

//   // Order placement (kept for local guest/history compatibility)
//   const placeOrder = () => {
//     const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
//     const discount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
//     const total = subtotal - discount;
//     const newOrder = {
//       id: Date.now(),
//       items: cart,
//       subtotal,
//       discount,
//       total,
//       date: new Date().toISOString(),
//     };
//     setOrders((prev) => [newOrder, ...prev]);
//     setCart([]);
//     setAppliedCoupon(null);
//     toast.success("Order placed successfully!");
//     return newOrder;
//   };

//   const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.qty || item.quantity), 0);
//   const discountAmount = appliedCoupon ? totalPrice * appliedCoupon.discount : 0;
//   const finalPrice = totalPrice - discountAmount;

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         setCart, // 🔥 FIXED BUG: Added setCart here so that Checkout.jsx can call it securely!
//         addToCart,
//         removeFromCart,
//         increaseQty,
//         decreaseQty,
//         totalPrice,
//         discountAmount,
//         finalPrice,
//         wishlist,
//         toggleWishlist,
//         theme,
//         toggleTheme,
//         isCartOpen,
//         toggleCart,
//         appliedCoupon,
//         setAppliedCoupon, // 🔥 Passed setAppliedCoupon to easily flush applied promos upon successful purchase
//         applyCoupon,
//         removeCoupon,
//         orders,
//         setOrders,
//         placeOrder,
//         user,
//         setUser,
//         token,
//         login,
//         register,
//         forgotPassword,
//         resetPassword,
//         loginGoogle,
//         logout,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider; 











import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

// Helper to normalize product schema safely
const normalizeProduct = (backendProduct) => {
  if (!backendProduct) return null;
  return {
    id: backendProduct.productId || backendProduct._id || "",
    productId: backendProduct.productId || backendProduct._id || "",
    _id: backendProduct._id || "",
    name: backendProduct.title || backendProduct.name || "Untitled Product",
    title: backendProduct.title || backendProduct.name || "Untitled Product",
    price: Number(backendProduct.price) || 0,
    category: backendProduct.category || "General",
    image: backendProduct.images?.[0]?.url || backendProduct.image || "",
    images: backendProduct.images || [],
    description: backendProduct.description || "",
    rating: backendProduct.rating || 4.5,
  };
};

// Helper to normalize cart items schema safely
const normalizeCart = (backendCart) => {
  if (!backendCart || !Array.isArray(backendCart)) return [];
  return backendCart
    .map(item => {
      if (!item || !item.product) return null;
      return {
        id: item.product.productId || item.product._id,
        productId: item.product.productId || item.product._id,
        _id: item.product._id,
        name: item.product.title || item.product.name || "Product",
        price: Number(item.product.price) || 0,
        image: item.product.images?.[0]?.url || item.product.image || "",
        qty: Number(item.quantity) || 1,
        quantity: Number(item.quantity) || 1
      };
    })
    .filter(Boolean); // removes null elements safely
};

// Helper to normalize wishlist items schema safely
const normalizeWishlist = (backendWishlist) => {
  if (!backendWishlist || !Array.isArray(backendWishlist)) return [];
  return backendWishlist
    .map(product => {
      if (!product) return null;
      // If backend sends nested product schema like { product: { ... } }
      if (product.product) {
        return normalizeProduct(product.product);
      }
      return normalizeProduct(product);
    })
    .filter(Boolean);
};


const CartProvider = ({ children }) => {
  // Authentication state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved && saved !== "undefined" ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || null;
    } catch {
      return null;
    }
  });

  // Core cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved && saved !== "undefined" ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      return saved && saved !== "undefined" ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Orders array
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("orders");
      return saved && saved !== "undefined" ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // UI flags
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      return saved ? saved : "dark";
    } catch {
      return "dark";
    }
  });

  // Coupon handling
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem("appliedCoupon");
      return saved && saved !== "undefined" ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Persist guest states/theme to localStorage
  useEffect(() => {
    if (!token) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, token]);

  useEffect(() => {
    if (!token) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, token]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  // ── Auto-logout when stored token is expired ──
  // Runs once on app load. Decodes the JWT's `exp` field (no library needed —
  // JWTs are just base64-encoded JSON). If token is stale, silently clears
  // state so the user sees the logged-out UI immediately instead of hitting
  // "invalid token" errors when they try to do something.
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      // JWT structure: header.payload.signature (all base64url encoded)
      const payloadBase64 = storedToken.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      const isExpired = payload.exp && Date.now() / 1000 > payload.exp;

      if (isExpired) {
        // Clear all auth data silently
        setToken(null);
        setUser(null);
        setCart([]);
        setWishlist([]);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        localStorage.removeItem("wishlist");
        // Friendly toast — not a scary error
        toast.info("Your session has expired. Please log in again.", {
          toastId: "session-expired", // prevents duplicate toasts
        });
      }
    } catch {
      // Malformed token — clear it quietly
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync cart and wishlist from backend on login securely
  useEffect(() => {
    if (token) {
      const fetchCartAndWishlist = async () => {
        try {
          // Fetch cart
          const cartRes = await fetch(`${API_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (cartRes.ok) {
            const cartData = await cartRes.json();
            if (cartData.status === "success") {
              const rawData = cartData.data?.items || cartData.data || [];
              setCart(normalizeCart(rawData));
            }
          }

          // Fetch wishlist
          const wishlistRes = await fetch(`${API_URL}/wishlist`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (wishlistRes.ok) {
            const wishlistData = await wishlistRes.json();
            if (wishlistData.status === "success") {
              const rawWishData = wishlistData.data?.products || wishlistData.data || [];
              setWishlist(normalizeWishlist(rawWishData));
            }
          }
        } catch (error) {
          console.error("Error fetching cart/wishlist assets:", error);
        }
      };
      fetchCartAndWishlist();
    } else {
      const savedCart = localStorage.getItem("cart");
      try {
        setCart(savedCart && savedCart !== "undefined" ? JSON.parse(savedCart) : []);
      } catch {
        setCart([]);
      }
      const savedWishlist = localStorage.getItem("wishlist");
      try {
        setWishlist(savedWishlist && savedWishlist !== "undefined" ? JSON.parse(savedWishlist) : []);
      } catch {
        setWishlist([]);
      }
    }
  }, [token]);

  // Register user action
  const register = async (name, email, password, confirmPassword) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword })
      });
      const result = await response.json();
      if (response.ok && result.status === "success") {
        toast.success("Registration successful! Please verify your email.");
        return { success: true };
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Login user action
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (response.ok && result.status === "success") {
        const { token: userToken, user: userProfile } = result.data;
        setToken(userToken);
        setUser(userProfile);
        localStorage.setItem("token", userToken);
        localStorage.setItem("user", JSON.stringify(userProfile));
        toast.success(`Welcome back, ${userProfile.name}!`);
        return { success: true, user: userProfile };
      } else {
        throw new Error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Forgot password action
  const forgotPassword = async (email) => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      if (response.ok && result.status === "success") {
        toast.success("Password reset link sent to your email!");
        return { success: true };
      } else {
        throw new Error(result.message || "Failed to send reset link");
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Reset password action
  const resetPassword = async (resetToken, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password/${resetToken}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const result = await response.json();
      if (response.ok && result.status === "success") {
        toast.success("Password reset successful!");
        return { success: true };
      } else {
        throw new Error(result.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // Google OAuth Login
  const loginGoogle = async (credential) => {
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential })
      });
      const result = await response.json();
      if (response.ok && result.status === "success") {
        const { token: userToken, user: userProfile } = result.data;
        setToken(userToken);
        setUser(userProfile);
        localStorage.setItem("token", userToken);
        localStorage.setItem("user", JSON.stringify(userProfile));
        toast.success(`Welcome back, ${userProfile.name}!`);
        return { success: true, user: userProfile };
      } else {
        throw new Error(result.message || "Google authentication failed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to authenticate with Google");
      return { success: false, error: error.message };
    }
  };

  // Logout action
  const logout = () => {
    setToken(null);
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
    toast.info("Logged out successfully");
  };

  const updateCartQty = async (productId, newQty) => {
    if (token) {
      try {
        const response = await fetch(`${API_URL}/cart/${productId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ quantity: newQty })
        });
        const result = await response.json();
        if (response.ok && result.status === "success") {
          const rawData = result.data?.items || result.data || [];
          setCart(normalizeCart(rawData));
        } else {
          toast.error(result.message || "Failed to update quantity");
        }
      } catch (error) {
        console.error("Update quantity error:", error);
      }
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, qty: newQty, quantity: newQty } : item
        )
      );
    }
  };

  const addToCart = async (product) => {
    const productId = product.productId || product.id || product._id;
    if (!token) {
      toast.error("Please log in first to add items to your cart");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/cart/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok && result.status === "success") {
        const rawData = result.data?.items || result.data || [];
        setCart(normalizeCart(rawData));
        toast.success("Added to cart!");
      } else {
        if (result.message && result.message.includes("already in your cart")) {
          const existingItem = cart.find(item => item.id === productId);
          if (existingItem) {
            const newQty = Math.min((existingItem.qty || existingItem.quantity) + 1, 5);
            updateCartQty(productId, newQty);
            toast.success("Incremented quantity in cart!");
          }
        } else {
          toast.error(result.message || "Failed to add to cart");
        }
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (id) => {
    if (token) {
      try {
        const response = await fetch(`${API_URL}/cart/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await response.json();
        if (response.ok && result.status === "success") {
          const rawData = result.data?.items || result.data || [];
          setCart(normalizeCart(rawData));
          toast.error("Removed from cart");
        } else {
          toast.error(result.message || "Failed to remove item");
        }
      } catch (error) {
        console.error("Remove from cart error:", error);
      }
    } else {
      setCart(cart.filter((item) => item.id !== id));
      toast.error("Removed from cart");
    }
  };

  const increaseQty = (id) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
      const newQty = Math.min((item.qty || item.quantity) + 1, 5);
      updateCartQty(id, newQty);
    }
  };

  const decreaseQty = (id) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
      const newQty = (item.qty || item.quantity) - 1;
      if (newQty <= 0) {
        removeFromCart(id);
      } else {
        updateCartQty(id, newQty);
      }
    }
  };

  const toggleWishlist = async (productId) => {
    if (!token) {
      toast.error("Please log in first to add items to your wishlist");
      return;
    }
    const isAdded = wishlist.some((item) => (item.id === productId || item === productId || item._id === productId));
    try {
      const url = `${API_URL}/wishlist/${productId}`;
      const method = isAdded ? "DELETE" : "POST";
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok && result.status === "success") {
        const rawWishData = result.data?.products || result.data || [];
        setWishlist(normalizeWishlist(rawWishData));
        if (isAdded) {
          toast.info("Removed from Wishlist");
        } else {
          toast.success("Added to Wishlist");
        }
      } else {
        toast.error(result.message || "Failed to update wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const couponCatalog = { SAVE10: 0.1, SAVE20: 0.2, SAVE30: 0.3 };
  const applyCoupon = (code) => {
    const discount = couponCatalog[code.toUpperCase()];
    if (discount) {
      setAppliedCoupon({ code: code.toUpperCase(), discount });
      toast.success(`Coupon ${code.toUpperCase()} applied!`);
      return true;
    } else {
      toast.error("Invalid coupon code");
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

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

  const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.qty || item.quantity), 0);
  const discountAmount = appliedCoupon ? totalPrice * appliedCoupon.discount : 0;
  const finalPrice = totalPrice - discountAmount;

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
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
        setAppliedCoupon,
        applyCoupon,
        removeCoupon,
        orders,
        setOrders,
        placeOrder,
        user,
        setUser,
        token,
        login,
        register,
        forgotPassword,
        resetPassword,
        loginGoogle,
        logout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;