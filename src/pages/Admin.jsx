

// import { useState, useEffect, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { CartContext } from "../context/CartContext";
// import { toast } from "react-toastify";

// const Admin = () => {
//   const { token, user, logout } = useContext(CartContext);
//   const navigate = useNavigate();

//   const [orders, setOrders] = useState([]);
//   const [productsList, setProductsList] = useState([]);
//   const [usersList, setUsersList] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [submittingProduct, setSubmittingProduct] = useState(false);
//   const [activeTab, setActiveTab] = useState("orders");

//   const [isProductModalOpen, setIsProductModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);

//   // ================= METADATA TOTAL COUNTS FOR BACKEND PAGINATION =================
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [totalUsers, setTotalUsers] = useState(0);

//   const [totalOrdersPages, setTotalOrdersPages] = useState(1);
//   const [totalProductsPages, setTotalProductsPages] = useState(1);
//   const [totalUsersPages, setTotalUsersPages] = useState(1);

//   // ================= SORT, SEARCH & PAGE STATES =================
//   const [ordersSort, setOrdersSort] = useState("latest");
//   const [productsSort, setProductsSort] = useState("latest");
//   const [usersSort, setUsersSort] = useState("latest");

//   const [userSearchQuery, setUserSearchQuery] = useState("");

//   const [ordersPage, setOrdersPage] = useState(1);
//   const [productsPage, setProductsPage] = useState(1);
//   const [usersPage, setUsersPage] = useState(1);

//   const ITEMS_PER_PAGE = 12;
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [productForm, setProductForm] = useState({
//     title: "",
//     price: "",
//     category: "shoes",
//     description: "",
//     images: []
//   });

//   // ================= DYNAMIC FETCH BACKEND DATA FUNCTIONS =================

//   const fetchOrders = async () => {
//     try {
//       const res = await fetch(`${API_URL}/orders?page=${ordersPage}&limit=${ITEMS_PER_PAGE}&sort=${ordersSort}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const result = await res.json();

//       const ordersData = result?.data?.orders || result?.orders || [];
//       setOrders(ordersData);
//       setTotalOrders(result?.totalCount || result?.total || ordersData.length);
//       setTotalOrdersPages(result?.totalPages || Math.ceil((result?.totalCount || ordersData.length) / ITEMS_PER_PAGE));
//     } catch (err) {
//       console.error("Orders Fetch Error:", err);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await fetch(`${API_URL}/products?page=${productsPage}&limit=${ITEMS_PER_PAGE}&sort=${productsSort}`);
//       const result = await res.json();

//       const productsData = result?.data?.products || result?.products || [];
//       setProductsList(productsData);
//       setTotalProducts(result?.totalCount || result?.total || productsData.length);
//       setTotalProductsPages(result?.totalPages || Math.ceil((result?.totalCount || productsData.length) / ITEMS_PER_PAGE));
//     } catch (err) {
//       console.error("Products Fetch Error:", err);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const res = await fetch(
//         `${API_URL}/users?page=${usersPage}&limit=${ITEMS_PER_PAGE}&sort=${usersSort}&search=${userSearchQuery}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const result = await res.json();

//       const usersData = result?.data?.users || result?.orders || [];
//       setUsersList(usersData);
//       setTotalUsers(result?.totalCount || result?.total || usersData.length);
//       setTotalUsersPages(result?.totalPages || Math.ceil((result?.totalCount || usersData.length) / ITEMS_PER_PAGE));
//     } catch (err) {
//       console.error("Users Fetch Error:", err);
//     }
//   };

//   useEffect(() => {
//     if (token && user?.role === "admin") {
//       const loadAll = async () => {
//         setLoading(true);
//         await Promise.all([fetchOrders(), fetchProducts(), fetchUsers()]);
//         setLoading(false);
//       };
//       loadAll();
//     } else {
//       setLoading(false);
//     }
//   }, [token, user]);

//   useEffect(() => { if (token) fetchOrders(); }, [ordersPage, ordersSort]);
//   useEffect(() => { if (token) fetchProducts(); }, [productsPage, productsSort]);
//   useEffect(() => { if (token) fetchUsers(); }, [usersPage, usersSort, userSearchQuery]);

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   // ================= USERS ACTIONS =================
//   const deleteUser = async (id) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;

//     const res = await fetch(`${API_URL}/users/${id}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     if (res.ok) {
//       toast.success("User deleted successfully");
//       fetchUsers();
//     } else {
//       const data = await res.json();
//       toast.error(data.message || "Failed to delete user");
//     }
//   };

//   const toggleUserRole = async (usr) => {
//     const newRole = usr.role === "admin" ? "user" : "admin";

//     const res = await fetch(`${API_URL}/users/${usr._id}/role`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify({ role: newRole })
//     });

//     if (res.ok) {
//       toast.success(`Role updated to ${newRole} successfully`);
//       fetchUsers();
//     } else {
//       const data = await res.json();
//       toast.error(data.message || "Failed to update role");
//     }
//   };

//   // ================= ORDERS ACTIONS =================
//   const proceedOrder = async (orderItem) => {
//     const status = orderItem.orderStatus;
//     const nextStatus =
//       status === "processing"
//         ? "shipped"
//         : status === "shipped"
//           ? "delivered"
//           : status;

//     const res = await fetch(`${API_URL}/orders/${orderItem.orderId}/status`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify({ status: nextStatus })
//     });

//     if (res.ok) {
//       toast.success(`Order status updated to: ${nextStatus}`);
//       fetchOrders();
//     } else {
//       const data = await res.json();
//       toast.error(data.message || "Failed to update order status");
//     }
//   };

//   const cancelOrder = async (orderItem) => {
//     if (!confirm("Are you sure you want to cancel this order?")) return;

//     const res = await fetch(`${API_URL}/orders/${orderItem.orderId}/status`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify({ status: "cancelled" })
//     });

//     if (res.ok) {
//       toast.success("Order cancelled successfully");
//       fetchOrders();
//     } else {
//       const data = await res.json();
//       toast.error(data.message || "Failed to cancel order");
//     }
//   };

//   // ================= PRODUCTS ACTIONS =================
//   const deleteProduct = async (productId) => {
//     if (!confirm("Are you sure you want to delete this product?")) return;

//     const res = await fetch(`${API_URL}/products/${productId}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     if (res.ok) {
//       toast.success("Product deleted successfully");
//       fetchProducts();
//     } else {
//       const data = await res.json();
//       toast.error(data.message || "Failed to delete product");
//     }
//   };

//   const handleProductSubmit = async (e) => {
//     e.preventDefault();
//     setSubmittingProduct(true);

//     const formData = new FormData();
//     formData.append("title", productForm.title);
//     formData.append("price", Number(productForm.price));
//     formData.append("category", productForm.category);
//     formData.append("description", productForm.description);

//     productForm.images.forEach(img => {
//       formData.append("images", img);
//     });

//     const url = editingProduct
//       ? `${API_URL}/products/${editingProduct.productId}`
//       : `${API_URL}/products`;

//     const method = editingProduct ? "PATCH" : "POST";

//     const res = await fetch(url, {
//       method,
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData
//     });

//     if (res.ok) {
//       toast.success(editingProduct ? "Product updated successfully" : "Product created successfully");
//       fetchProducts();
//       setIsProductModalOpen(false);
//       setEditingProduct(null);
//     } else {
//       const data = await res.json();
//       toast.error(data.message || "Failed to save product");
//     }

//     setSubmittingProduct(false);
//   };

//   const openEditProduct = (p) => {
//     setEditingProduct(p);
//     setProductForm({
//       title: p.title || "",
//       price: p.price || "",
//       category: p.category || "shoes",
//       description: p.description || "",
//       images: []
//     });
//     setIsProductModalOpen(true);
//   };

//   const openAddProduct = () => {
//     setEditingProduct(null);
//     setProductForm({
//       title: "",
//       price: "",
//       category: "shoes",
//       description: "",
//       images: []
//     });
//     setIsProductModalOpen(true);
//   };

//   const getStatusBadge = (status) => {
//     const styles = {
//       processing: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
//       shipped: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
//       delivered: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
//       cancelled: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
//     };
//     return styles[status] || "bg-gray-500/10 text-gray-400";
//   };

//   const renderPaginationControls = (currentPage, totalPages, setPage) => {
//     if (totalPages <= 1) return null;
//     return (
//       <div className="p-4 bg-slate-800/20 border-t border-slate-800 flex items-center justify-between">
//         <span className="text-xs text-slate-400">
//           Page <strong className="text-slate-200">{currentPage}</strong> of {totalPages}
//         </span>
//         <div className="inline-flex space-x-2">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setPage(prev => Math.max(prev - 1, 1))}
//             className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 transition"
//           >
//             Previous
//           </button>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
//             className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-30 disabled:hover:bg-indigo-600 transition"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center text-white">
//         <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//         <p className="text-slate-400 font-medium">Loading Dashboard Data...</p>
//       </div>
//     );
//   }

//   if (!token || user?.role !== "admin") {
//     return (
//       <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
//         <div className="bg-[#1e293b] p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-800">
//           <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✕</div>
//           <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
//           <p className="text-slate-400 mb-6">This dashboard is restricted to administrator accounts only.</p>
//           <Link to="/login" className="inline-block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition duration-200 shadow-lg shadow-indigo-600/20">
//             Go to Login
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col lg:flex-row">

//       {/* SIDEBAR */}
//       <aside className="w-full lg:w-64 bg-[#1e293b] border-r border-slate-800 flex flex-col justify-between p-6 shrink-0">
//         <div>
//           <div className="flex items-center space-x-3 mb-8">
//             <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-600/30">S</div>
//             <span className="text-xl font-bold tracking-tight text-white">ShopNPay</span>
//           </div>

//           <nav className="space-y-1.5">
//             {[
//               { id: "orders", label: "Orders List", count: totalOrders },
//               { id: "products", label: "Products Catalog", count: totalProducts },
//               { id: "users", label: "Manage Users", count: totalUsers }
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id
//                   ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
//                   : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
//                   }`}
//               >
//                 <span>{tab.label}</span>
//                 <span className={`text-xs px-2 py-0.5 rounded-md ${activeTab === tab.id ? "bg-indigo-700 text-white" : "bg-slate-800 text-slate-400"}`}>
//                   {tab.count}
//                 </span>
//               </button>
//             ))}
//           </nav>
//         </div>

//         <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-200 uppercase">
//               {user?.name?.slice(0, 2) || "AD"}
//             </div>
//             <div className="truncate max-w-[100px]">
//               <p className="text-sm font-medium text-white truncate">{user?.name || "Admin"}</p>
//               <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
//             </div>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-rose-500/10 rounded-xl transition duration-150"
//             title="Logout"
//           >
//             ➔
//           </button>
//         </div>
//       </aside>

//       {/* MAIN CONTENT AREA */}
//       <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">

//         {/* TOP METRICS STATS */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
//           <div className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-sm">
//             <p className="text-sm font-medium text-slate-400 mb-1">Total Revenue</p>
//             <h3 className="text-2xl font-bold text-emerald-400">
//               ${orders.reduce((sum, o) => sum + (o.orderStatus !== "cancelled" ? o.totalAmount : 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//             </h3>
//           </div>
//           <div className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-sm">
//             <p className="text-sm font-medium text-slate-400 mb-1">Total Orders</p>
//             <h3 className="text-2xl font-bold text-white">{totalOrders}</h3>
//           </div>
//           <div className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-sm">
//             <p className="text-sm font-medium text-slate-400 mb-1">Total Products</p>
//             <h3 className="text-2xl font-bold text-white">{totalProducts}</h3>
//           </div>
//           <div className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-sm">
//             <p className="text-sm font-medium text-slate-400 mb-1">Total Users</p>
//             <h3 className="text-2xl font-bold text-white">{totalUsers}</h3>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-6 flex items-center space-x-3">
//             <span>⚠️</span>
//             <p className="text-sm font-medium">{error}</p>
//           </div>
//         )}

//         {/* DATA CONTAINER PANEL */}
//         <div className="bg-[#1e293b] border border-slate-800 rounded-2xl shadow-sm overflow-hidden">

//           {/* ORDERS TAB */}
//           {activeTab === "orders" && (
//             <div>
//               <div className="p-6 border-b border-slate-800 flex items-center justify-between">
//                 <h2 className="text-lg font-bold text-white">Recent Orders</h2>
//                 <select
//                   value={ordersSort}
//                   onChange={(e) => { setOrdersSort(e.target.value); setOrdersPage(1); }}
//                   className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs font-medium focus:border-indigo-500 focus:outline-none cursor-pointer hover:bg-slate-800 transition"
//                 >
//                   <option value="latest">Latest to Oldest</option>
//                   <option value="oldest">Oldest to Latest</option>
//                 </select>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="bg-slate-800/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
//                       <th className="py-4 px-6">Order ID</th>
//                       <th className="py-4 px-6">Customer Details</th>
//                       <th className="py-4 px-6">Total Amount</th>
//                       <th className="py-4 px-6">Status</th>
//                       <th className="py-4 px-6 text-right">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-800 text-sm">
//                     {orders.length === 0 ? (
//                       <tr>
//                         <td colSpan="5" className="text-center py-10 text-slate-500">No orders found.</td>
//                       </tr>
//                     ) : (
//                       orders.map(o => (
//                         <tr key={o._id} className="hover:bg-slate-800/30 transition duration-150">
//                           <td className="py-4 px-6 font-mono text-xs text-indigo-400">{o.orderId || "N/A"}</td>
//                           <td className="py-4 px-6">
//                             <p className="font-medium text-white">{o.user?.name || "Guest User"}</p>
//                             <p className="text-xs text-slate-400 truncate max-w-[180px]">{o.user?.email || ""}</p>
//                           </td>
//                           <td className="py-4 px-6 font-semibold text-slate-200">${o.totalAmount}</td>
//                           <td className="py-4 px-6">
//                             <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium capitalize ${getStatusBadge(o.orderStatus)}`}>
//                               {o.orderStatus}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6 text-right space-x-2">
//                             {o.orderStatus !== "delivered" && o.orderStatus !== "cancelled" && (
//                               <button
//                                 onClick={() => proceedOrder(o)}
//                                 className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-medium rounded-lg transition"
//                               >
//                                 {o.orderStatus === "processing" ? "Ship Order" : "Deliver Order"}
//                               </button>
//                             )}
//                             {o.orderStatus !== "cancelled" && o.orderStatus !== "delivered" && (
//                               <button
//                                 onClick={() => cancelOrder(o)}
//                                 className="px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:text-white text-xs font-medium rounded-lg transition"
//                               >
//                                 Cancel
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               {renderPaginationControls(ordersPage, totalOrdersPages, setOrdersPage)}
//             </div>
//           )}

//           {/* PRODUCTS CATALOG TAB */}
//           {activeTab === "products" && (
//             <div>
//               <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <h2 className="text-lg font-bold text-white">Product Inventory</h2>
//                 <div className="flex items-center space-x-3 self-end sm:self-auto">
//                   <select
//                     value={productsSort}
//                     onChange={(e) => { setProductsSort(e.target.value); setProductsPage(1); }}
//                     className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs font-medium focus:border-indigo-500 focus:outline-none cursor-pointer hover:bg-slate-800 transition"
//                   >
//                     <option value="latest">Latest to Oldest</option>
//                     <option value="oldest">Oldest to Latest</option>
//                   </select>
//                   <button
//                     onClick={openAddProduct}
//                     className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition shadow-md shadow-indigo-600/10"
//                   >
//                     + Add Product
//                   </button>
//                 </div>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="bg-slate-800/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
//                       <th className="py-4 px-6">Product Title</th>
//                       <th className="py-4 px-6">Category</th>
//                       <th className="py-4 px-6">Price</th>
//                       <th className="py-4 px-6 text-right">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-800 text-sm">
//                     {productsList.length === 0 ? (
//                       <tr>
//                         <td colSpan="4" className="text-center py-10 text-slate-500">No products available.</td>
//                       </tr>
//                     ) : (
//                       productsList.map(p => (
//                         <tr key={p.productId} className="hover:bg-slate-800/30 transition duration-150">
//                           <td className="py-4 px-6">
//                             <div className="flex items-center space-x-3">
//                               {p.images?.[0]?.url && (
//                                 <img src={p.images[0].url} alt="" className="w-8 h-8 rounded-lg bg-slate-900 object-cover border border-slate-800" />
//                               )}
//                               <span className="font-medium text-white">{p.title}</span>
//                             </div>
//                           </td>
//                           <td className="py-4 px-6 text-slate-400 capitalize font-mono text-xs">{p.category || "General"}</td>
//                           <td className="py-4 px-6 font-semibold text-slate-200">${p.price}</td>
//                           <td className="py-4 px-6 text-right space-x-2">
//                             <button
//                               onClick={() => openEditProduct(p)}
//                               className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium rounded-lg transition"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => deleteProduct(p.productId)}
//                               className="px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-medium rounded-lg transition"
//                             >
//                               Delete
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               {renderPaginationControls(productsPage, totalProductsPages, setProductsPage)}
//             </div>
//           )}

//           {/* USERS PRIVILEGE CONTROL TAB */}
//           {activeTab === "users" && (
//             <div>
//               <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <h2 className="text-lg font-bold text-white">Registered Users</h2>

//                 <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//                   <input
//                     type="text"
//                     value={userSearchQuery}
//                     onChange={(e) => { setUserSearchQuery(e.target.value); setUsersPage(1); }}
//                     placeholder="Search user by email..."
//                     className="px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:border-indigo-500 focus:outline-none w-full sm:w-64"
//                   />
//                   <select
//                     value={usersSort}
//                     onChange={(e) => { setUsersSort(e.target.value); setUsersPage(1); }}
//                     className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs font-medium focus:border-indigo-500 focus:outline-none cursor-pointer hover:bg-slate-800 transition"
//                   >
//                     <option value="latest">Latest to Oldest</option>
//                     <option value="oldest">Oldest to Latest</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="bg-slate-800/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
//                       <th className="py-4 px-6">User Info</th>
//                       <th className="py-4 px-6">Role</th>
//                       <th className="py-4 px-6 text-right">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-800 text-sm">
//                     {usersList.length === 0 ? (
//                       <tr>
//                         <td colSpan="3" className="text-center py-10 text-slate-500">No users found.</td>
//                       </tr>
//                     ) : (
//                       usersList.map(u => (
//                         <tr key={u._id} className="hover:bg-slate-800/30 transition duration-150">
//                           <td className="py-4 px-6">
//                             <p className="font-medium text-white">{u.name || "N/A"}</p>
//                             <p className="text-xs text-slate-400">{u.email}</p>
//                           </td>
//                           <td className="py-4 px-6">
//                             <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide border ${u.role === "admin" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-slate-700/50 text-slate-300 border-slate-700"
//                               }`}>
//                               {u.role}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6 text-right space-x-2">
//                             <button
//                               onClick={() => toggleUserRole(u)}
//                               className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium rounded-lg transition"
//                             >
//                               Change Role
//                             </button>
//                             <button
//                               disabled={u._id === user._id}
//                               onClick={() => deleteUser(u._id)}
//                               className="px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-medium rounded-lg transition disabled:opacity-20"
//                             >
//                               Delete
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               {renderPaginationControls(usersPage, totalUsersPages, setUsersPage)}
//             </div>
//           )}

//         </div>
//       </main>

//       {/* MULTIPART FORM MODAL */}
//       {isProductModalOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
//           <div className="bg-[#1e293b] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all">

//             <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
//               <h3 className="text-base font-bold text-white">
//                 {editingProduct ? "Edit Product" : "Add New Product"}
//               </h3>
//               <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
//             </div>

//             <form onSubmit={handleProductSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
//               <div>
//                 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Product Title</label>
//                 <input
//                   type="text"
//                   required
//                   value={productForm.title}
//                   onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
//                   placeholder="e.g. Leather Watch"
//                   className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm focus:border-indigo-500 focus:outline-none"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Price ($)</label>
//                   <input
//                     type="number"
//                     required
//                     min="1"
//                     value={productForm.price}
//                     onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
//                     placeholder="150"
//                     className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Category</label>
//                   <select
//                     value={productForm.category}
//                     onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
//                     className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none capitalize"
//                   >
//                     {["shoes", "watch", "phone", "headphones", "laptops", "cameras", "gaming", "accessories", "clothing"].map((cat) => (
//                       <option key={cat} value={cat}>{cat}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</label>
//                 <textarea
//                   required
//                   rows="3"
//                   value={productForm.description}
//                   onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
//                   placeholder="Write product specifications..."
//                   className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm focus:border-indigo-500 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Product Images</label>
//                 <input
//                   type="file"
//                   multiple={!editingProduct}
//                   accept="image/*"
//                   onChange={(e) => setProductForm({ ...productForm, images: Array.from(e.target.files) })}
//                   className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/10 file:text-indigo-400 hover:file:bg-indigo-600/20 file:cursor-pointer"
//                 />
//               </div>

//               <div className="flex space-x-3 pt-4 border-t border-slate-800">
//                 <button
//                   type="button"
//                   onClick={() => setIsProductModalOpen(false)}
//                   className="flex-1 py-2.5 border border-slate-800 text-slate-300 font-medium rounded-xl text-sm transition hover:bg-slate-800"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submittingProduct}
//                   className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-medium rounded-xl text-sm transition"
//                 >
//                   {submittingProduct ? "Saving..." : "Save Product"}
//                 </button>
//               </div>
//             </form>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Admin; 









import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

const Admin = () => {
  const { token, user, logout } = useContext(CartContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // ================= METADATA TOTAL COUNTS =================
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const [totalOrdersPages, setTotalOrdersPages] = useState(1);
  const [totalProductsPages, setTotalProductsPages] = useState(1);
  const [totalUsersPages, setTotalUsersPages] = useState(1);

  // ================= SORT, SEARCH & PAGE STATES =================
  const [ordersSort, setOrdersSort] = useState("latest");
  const [productsSort, setProductsSort] = useState("latest");
  const [usersSort, setUsersSort] = useState("latest");

  const [userSearchQuery, setUserSearchQuery] = useState("");

  const [ordersPage, setOrdersPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);

  const ITEMS_PER_PAGE = 12;
  const API_URL = import.meta.env.VITE_API_URL;

  const [productForm, setProductForm] = useState({
    title: "",
    price: "",
    category: "shoes",
    description: "",
    images: []
  });

  // Trackers to completely avoid component trigger loops
  const fetchingRef = useRef({ orders: false, products: false, users: false });

  // ================= FETCH LOGIC FUNCTIONS =================

  const fetchOrders = async () => {
    if (!token || fetchingRef.current.orders) return;
    fetchingRef.current.orders = true;
    try {
      const res = await fetch(`${API_URL}/orders?page=${ordersPage}&limit=${ITEMS_PER_PAGE}&sort=${ordersSort}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      const ordersData = result?.data?.orders || result?.orders || [];
      setOrders(ordersData);
      setTotalOrders(result?.totalCount || result?.total || ordersData.length);
      setTotalOrdersPages(result?.totalPages || Math.ceil((result?.totalCount || ordersData.length) / ITEMS_PER_PAGE));
    } catch (err) {
      console.error("Orders Fetch Error:", err);
    } finally {
      fetchingRef.current.orders = false;
    }
  };

  const fetchProducts = async () => {
    if (fetchingRef.current.products) return;
    fetchingRef.current.products = true;
    try {
      const res = await fetch(`${API_URL}/products?page=${productsPage}&limit=${ITEMS_PER_PAGE}&sort=${productsSort}`);
      const result = await res.json();
      const productsData = result?.data?.products || result?.products || [];
      setProductsList(productsData);
      setTotalProducts(result?.totalCount || result?.total || productsData.length);
      setTotalProductsPages(result?.totalPages || Math.ceil((result?.totalCount || productsData.length) / ITEMS_PER_PAGE));
    } catch (err) {
      console.error("Products Fetch Error:", err);
    } finally {
      fetchingRef.current.products = false;
    }
  };

  const fetchUsers = async () => {
    if (!token || fetchingRef.current.users) return;
    fetchingRef.current.users = true;
    try {
      const res = await fetch(
        `${API_URL}/users?page=${usersPage}&limit=${ITEMS_PER_PAGE}&sort=${usersSort}&search=${userSearchQuery}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await res.json();
      const usersData = result?.data?.users || result?.users || [];
      setUsersList(usersData);
      setTotalUsers(result?.totalCount || result?.total || usersData.length);
      setTotalUsersPages(result?.totalPages || Math.ceil((result?.totalCount || usersData.length) / ITEMS_PER_PAGE));
    } catch (err) {
      console.error("Users Fetch Error:", err);
    } finally {
      fetchingRef.current.users = false;
    }
  };

  // 🔥 SINGLE MASTER UNIFIED LIFECYCLE HOOK (No Race Conditions)
  useEffect(() => {
    // If context is still loading authentication data, just wait
    if (token === undefined || user === undefined) return;

    if (!token || user?.role !== "admin") {
      setLoading(false);
      return;
    }

    const loadDashboardData = async () => {
      setError("");
      try {
        await Promise.all([fetchOrders(), fetchProducts(), fetchUsers()]);
      } catch (err) {
        setError("Error loading tracking data logs.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    token,
    user,
    ordersPage,
    ordersSort,
    productsPage,
    productsSort,
    usersPage,
    usersSort,
    userSearchQuery
  ]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ================= ACTION HANDLERS =================
  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      toast.success("User deleted successfully");
      fetchUsers();
    } else {
      const data = await res.json();
      toast.error(data.message || "Failed to delete user");
    }
  };

  const toggleUserRole = async (usr) => {
    const newRole = usr.role === "admin" ? "user" : "admin";
    const res = await fetch(`${API_URL}/users/${usr._id}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ role: newRole })
    });
    if (res.ok) {
      toast.success(`Role updated to ${newRole} successfully`);
      fetchUsers();
    } else {
      const data = await res.json();
      toast.error(data.message || "Failed to update role");
    }
  };

  const proceedOrder = async (orderItem) => {
    const status = orderItem.orderStatus;
    const nextStatus = status === "processing" ? "shipped" : status === "shipped" ? "delivered" : status;
    const res = await fetch(`${API_URL}/orders/${orderItem.orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: nextStatus })
    });
    if (res.ok) {
      toast.success(`Order status updated to: ${nextStatus}`);
      fetchOrders();
    } else {
      const data = await res.json();
      toast.error(data.message || "Failed to update order status");
    }
  };

  const cancelOrder = async (orderItem) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    const res = await fetch(`${API_URL}/orders/${orderItem.orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: "cancelled" })
    });
    if (res.ok) {
      toast.success("Order cancelled successfully");
      fetchOrders();
    } else {
      const data = await res.json();
      toast.error(data.message || "Failed to cancel order");
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(`${API_URL}/products/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      toast.success("Product deleted successfully");
      fetchProducts();
    } else {
      const data = await res.json();
      toast.error(data.message || "Failed to delete product");
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSubmittingProduct(true);

    const formData = new FormData();
    formData.append("title", productForm.title);
    formData.append("price", Number(productForm.price));
    formData.append("category", productForm.category);
    formData.append("description", productForm.description);
    productForm.images.forEach(img => formData.append("images", img));

    const url = editingProduct ? `${API_URL}/products/${editingProduct.productId}` : `${API_URL}/products`;
    const method = editingProduct ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      toast.success(editingProduct ? "Product updated successfully" : "Product created successfully");
      fetchProducts();
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } else {
      const data = await res.json();
      toast.error(data.message || "Failed to save product");
    }
    setSubmittingProduct(false);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({ title: p.title || "", price: p.price || "", category: p.category || "shoes", description: p.description || "", images: [] });
    setIsProductModalOpen(true);
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ title: "", price: "", category: "shoes", description: "", images: [] });
    setIsProductModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      processing: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      shipped: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
      delivered: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      cancelled: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    };
    return styles[status] || "bg-gray-500/10 text-gray-400";
  };

  const renderPaginationControls = (currentPage, totalPages, setPage) => {
    if (totalPages <= 1) return null;
    return (
      <div className="p-4 bg-slate-800/20 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Page <strong className="text-slate-200">{currentPage}</strong> of {totalPages}
        </span>
        <div className="inline-flex space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 transition"
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-30 disabled:hover:bg-indigo-600 transition"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium">Loading Dashboard Data...</p>
      </div>
    );
  }

  if (!token || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
        <div className="bg-[#1e293b] p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-800">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-6">This dashboard is restricted to administrator accounts only.</p>
          <Link to="/login" className="inline-block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition duration-200 shadow-lg shadow-indigo-600/20">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col lg:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full lg:w-64 bg-[#1e293b] border-r border-slate-800 flex flex-col justify-between p-6 shrink-0">
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-600/30">S</div>
            <span className="text-xl font-bold tracking-tight text-white">ShopNPay</span>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: "orders", label: "Orders List", count: totalOrders },
              { id: "products", label: "Products Catalog", count: totalProducts },
              { id: "users", label: "Manage Users", count: totalUsers }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
              >
                <span>{tab.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-md ${activeTab === tab.id ? "bg-indigo-700 text-white" : "bg-slate-800 text-slate-400"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-200 uppercase">
              {user?.name?.slice(0, 2) || "AD"}
            </div>
            <div className="truncate max-w-[100px]">
              <p className="text-sm font-medium text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-rose-500/10 rounded-xl transition duration-150" title="Logout">➔</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
        {/* TOP METRICS STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-sm">
            <p className="text-sm font-medium text-slate-400 mb-1">Total Revenue</p>
            <h3 className="text-2xl font-bold text-emerald-400">
              ${orders.reduce((sum, o) => sum + (o.orderStatus !== "cancelled" ? o.totalAmount : 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-sm">
            <p className="text-sm font-medium text-slate-400 mb-1">Total Orders</p>
            <h3 className="text-2xl font-bold text-white">{totalOrders}</h3>
          </div>
          <div className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-sm">
            <p className="text-sm font-medium text-slate-400 mb-1">Total Products</p>
            <h3 className="text-2xl font-bold text-white">{totalProducts}</h3>
          </div>
          <div className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-sm">
            <p className="text-sm font-medium text-slate-400 mb-1">Total Users</p>
            <h3 className="text-2xl font-bold text-white">{totalUsers}</h3>
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-6 flex items-center space-x-3">
            <span>⚠️</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* DATA CONTAINER PANEL */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div>
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Recent Orders</h2>
                <select
                  value={ordersSort}
                  onChange={(e) => { setOrdersSort(e.target.value); setOrdersPage(1); }}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs font-medium focus:border-indigo-500 focus:outline-none cursor-pointer hover:bg-slate-800 transition"
                >
                  <option value="latest">Latest to Oldest</option>
                  <option value="oldest">Oldest to Latest</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-4 px-6">Order ID</th>
                      <th className="py-4 px-6">Customer Details</th>
                      <th className="py-4 px-6">Total Amount</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-10 text-slate-500">No orders found.</td>
                      </tr>
                    ) : (
                      orders.map(o => (
                        <tr key={o._id} className="hover:bg-slate-800/30 transition duration-150">
                          <td className="py-4 px-6 font-mono text-xs text-indigo-400">{o.orderId || "N/A"}</td>
                          <td className="py-4 px-6">
                            <p className="font-medium text-white">{o.user?.name || "Guest User"}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[180px]">{o.user?.email || ""}</p>
                          </td>
                          <td className="py-4 px-6 font-semibold text-slate-200">${o.totalAmount}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium capitalize ${getStatusBadge(o.orderStatus)}`}>
                              {o.orderStatus}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            {o.orderStatus !== "delivered" && o.orderStatus !== "cancelled" && (
                              <button onClick={() => proceedOrder(o)} className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-medium rounded-lg transition">
                                {o.orderStatus === "processing" ? "Ship Order" : "Deliver Order"}
                              </button>
                            )}
                            {o.orderStatus !== "cancelled" && o.orderStatus !== "delivered" && (
                              <button onClick={() => cancelOrder(o)} className="px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:text-white text-xs font-medium rounded-lg transition">Cancel</button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {renderPaginationControls(ordersPage, totalOrdersPages, setOrdersPage)}
            </div>
          )}

          {/* PRODUCTS CATALOG TAB */}
          {activeTab === "products" && (
            <div>
              <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg font-bold text-white">Product Inventory</h2>
                <div className="flex items-center space-x-3 self-end sm:self-auto">
                  <select
                    value={productsSort}
                    onChange={(e) => { setProductsSort(e.target.value); setProductsPage(1); }}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs font-medium focus:border-indigo-500 focus:outline-none cursor-pointer hover:bg-slate-800 transition"
                  >
                    <option value="latest">Latest to Oldest</option>
                    <option value="oldest">Oldest to Latest</option>
                  </select>
                  <button onClick={openAddProduct} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition shadow-md shadow-indigo-600/10">+ Add Product</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-4 px-6">Product Title</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {productsList.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-10 text-slate-500">No products available.</td>
                      </tr>
                    ) : (
                      productsList.map(p => (
                        <tr key={p.productId} className="hover:bg-slate-800/30 transition duration-150">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              {p.images?.[0]?.url && <img src={p.images[0].url} alt="" className="w-8 h-8 rounded-lg bg-slate-900 object-cover border border-slate-800" />}
                              <span className="font-medium text-white">{p.title}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-400 capitalize font-mono text-xs">{p.category || "General"}</td>
                          <td className="py-4 px-6 font-semibold text-slate-200">${p.price}</td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button onClick={() => openEditProduct(p)} className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium rounded-lg transition">Edit</button>
                            <button onClick={() => deleteProduct(p.productId)} className="px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-medium rounded-lg transition">Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {renderPaginationControls(productsPage, totalProductsPages, setProductsPage)}
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div>
              <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg font-bold text-white">Registered Users</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => { setUserSearchQuery(e.target.value); setUsersPage(1); }}
                    placeholder="Search user by email..."
                    className="px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:border-indigo-500 focus:outline-none w-full sm:w-64"
                  />
                  <select
                    value={usersSort}
                    onChange={(e) => { setUsersSort(e.target.value); setUsersPage(1); }}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs font-medium focus:border-indigo-500 focus:outline-none cursor-pointer hover:bg-slate-800 transition"
                  >
                    <option value="latest">Latest to Oldest</option>
                    <option value="oldest">Oldest to Latest</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-4 px-6">User Info</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-10 text-slate-500">No users found.</td>
                      </tr>
                    ) : (
                      usersList.map(u => (
                        <tr key={u._id} className="hover:bg-slate-800/30 transition duration-150">
                          <td className="py-4 px-6">
                            <p className="font-medium text-white">{u.name || "N/A"}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide border ${u.role === "admin" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-slate-700/50 text-slate-300 border-slate-700"}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button onClick={() => toggleUserRole(u)} className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium rounded-lg transition">Change Role</button>
                            <button disabled={u._id === user._id} onClick={() => deleteUser(u._id)} className="px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-medium rounded-lg transition disabled:opacity-20">Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {renderPaginationControls(usersPage, totalUsersPages, setUsersPage)}
            </div>
          )}
        </div>
      </main>

      {/* MULTIPART FORM MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Product Title</label>
                <input type="text" required value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Price ($)</label>
                  <input type="number" required min="1" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                  <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none">
                    <option value="shoes">Shoes</option>
                    <option value="watch">Watch</option>
                    <option value="phone">Phone</option>
                    <option value="headphones">Headphones</option>
                    <option value="laptops">Laptops</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                <textarea required rows="4" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Product Images</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setProductForm({ ...productForm, images: Array.from(e.target.files) })} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-600/10 file:text-indigo-400 cursor-pointer" />
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition">Cancel</button>
                <button type="submit" disabled={submittingProduct} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition disabled:opacity-50">{submittingProduct ? "Saving..." : "Save Product"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;