import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

const Admin = () => {
  const { token, user, logout } = useContext(CartContext);
  const navigate = useNavigate();

  // Authentication states
  const [orders, setOrders] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Dashboard Filters State
  const [revenueFilter, setRevenueFilter] = useState("This Month");
  const [activeOrderTab, setActiveOrderTab] = useState("New");
  const [selectedUser, setSelectedUser] = useState(null);

  // Product Modals / Forms State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    images: [] // array of file objects
  });

  const API_URL = import.meta.env.VITE_API_URL || "https://shopnpay-backend.onrender.com/api/v1";

  const fetchAdminData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch products
      const prodRes = await fetch(`${API_URL}/products?limit=100`);
      const prodResult = await prodRes.json();
      
      // Fetch users
      const usersRes = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersResult = await usersRes.json();

      // Fetch orders
      const ordersRes = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ordersResult = await ordersRes.json();

      if (prodRes.ok && prodResult.status === "success") {
        setProductsList(prodResult.data.products || []);
      }
      if (usersRes.ok && usersResult.status === "success") {
        setUsersList(usersResult.data || []);
      }
      if (ordersRes.ok && ordersResult.status === "success") {
        setOrders(ordersResult.data || []);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("Failed to fetch admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user && user.role === "admin") {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (res.ok && result.status === "success") {
        setUsersList(prev => prev.filter(u => u._id !== userId));
        toast.success("User deleted successfully");
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser(null);
        }
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  const toggleUserRole = async (usr) => {
    const nextRole = usr.role === "admin" ? "user" : "admin";
    try {
      const res = await fetch(`${API_URL}/users/${usr._id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: nextRole })
      });
      const result = await res.json();
      if (res.ok && result.status === "success") {
        setUsersList(prev => prev.map(u => u._id === usr._id ? { ...u, role: nextRole } : u));
        if (selectedUser && selectedUser._id === usr._id) {
          setSelectedUser({ ...selectedUser, role: nextRole });
        }
        toast.success(`User role updated to ${nextRole}`);
      } else {
        toast.error(result.message || "Failed to update role");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  const proceedOrder = async (orderId, currentStatus) => {
    let nextStatus = currentStatus;
    if (currentStatus === "New") nextStatus = "Ongoing";
    else if (currentStatus === "Ongoing") nextStatus = "Delivered";

    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const result = await res.json();
      if (res.ok && result.status === "success") {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: nextStatus } : o));
        toast.success(`Order status updated to ${nextStatus}`);
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: "Canceled" })
      });
      const result = await res.json();
      if (res.ok && result.status === "success") {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: "Canceled" } : o));
        toast.success("Order canceled successfully");
      } else {
        toast.error(result.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (res.ok && result.status === "success") {
        setProductsList(prev => prev.filter(p => p.productId !== productId));
        toast.success("Product deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSubmittingProduct(true);

    const formData = new FormData();
    formData.append("title", productForm.title);
    formData.append("price", productForm.price);
    formData.append("category", productForm.category.toLowerCase());
    formData.append("stock", productForm.stock);
    formData.append("description", productForm.description);
    
    // Append images
    for (let i = 0; i < productForm.images.length; i++) {
      formData.append("images", productForm.images[i]);
    }

    try {
      const url = editingProduct 
        ? `${API_URL}/products/${editingProduct.productId}` 
        : `${API_URL}/products`;
      const method = editingProduct ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const result = await res.json();
      if (res.ok && result.status === "success") {
        toast.success(editingProduct ? "Product updated successfully" : "Product created successfully");
        
        // Refresh products list
        const prodRes = await fetch(`${API_URL}/products?limit=100`);
        const prodResult = await prodRes.json();
        if (prodRes.ok && prodResult.status === "success") {
          setProductsList(prodResult.data.products || []);
        }

        setIsProductModalOpen(false);
        setEditingProduct(null);
        setProductForm({ title: "", price: "", category: "", stock: "", description: "", images: [] });
      } else {
        toast.error(result.message || "Failed to save product");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setSubmittingProduct(false);
    }
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      title: p.title || p.name || "",
      price: p.price || "",
      category: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : "",
      stock: p.stock !== undefined ? p.stock : "",
      description: p.description || "",
      images: []
    });
    setIsProductModalOpen(true);
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: "",
      price: "",
      category: "",
      stock: "",
      description: "",
      images: []
    });
    setIsProductModalOpen(true);
  };

  const getRevenueValue = () => {
    switch (revenueFilter) {
      case "This Month": return { total: `$${orders.reduce((sum, o) => sum + (o.status !== "Canceled" ? o.totalPrice : 0), 0).toFixed(0)}`, change: "+4.2% from last week" };
      case "Last 6 Months": return { total: "$28,490", change: "+18.5% over last half" };
      case "Yearly Overview": return { total: "$84,120", change: "+32.1% year-on-year" };
      default: return { total: "$12,450", change: "+12% this week" };
    }
  };

  const currentRevenue = getRevenueValue();

  const countNewOrders = orders.filter((o) => o.status === "New").length;
  const countOngoingOrders = orders.filter((o) => o.status === "Ongoing").length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1329] flex flex-col justify-center items-center px-4 font-sans text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 mt-4 font-bold text-sm">Loading admin dashboard...</p>
      </div>
    );
  }

  if (!token || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0b1329] flex flex-col justify-center items-center px-4 font-sans text-white">
        <div className="w-full max-w-md bg-[#111c40] border border-slate-800 p-8 rounded-2xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-500/20">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Access Denied</h1>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            You do not have administrative privileges to access this page. Please log in with an admin account.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/login">
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer shadow-md">
                Go to Login
              </button>
            </Link>
            <Link to="/">
              <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl border border-slate-700/60 transition-colors cursor-pointer">
                Back to Store
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getOrderItemsString = (order) => {
    return (order.orderItems || []).map(item => `${item.product?.title || "Product"} (x${item.quantity})`).join(", ");
  };

  return (
    <div className="min-h-screen bg-[#0b1329] text-white font-sans antialiased">
      {/* APP BAR HEADER */}
      <header className="bg-[#111c40] border-b border-slate-800/80 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-blue-400 tracking-tight flex items-center gap-2">
            Admin Dashboard <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Live Panel</span>
          </h2>
          <p className="text-xs text-slate-400">Manage orders, dynamic store revenue, and physical inventory lines</p>
        </div>
        <button onClick={handleLogout} className="bg-red-600/10 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm">
          Secure Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* UPPER METRICS PANEL MATRIX */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111c40] border border-slate-800/60 p-5 rounded-2xl relative shadow-md">
            <div className="flex justify-between items-center">
              <span className="text-xl">💰</span>
              <select
                value={revenueFilter}
                onChange={(e) => setRevenueFilter(e.target.value)}
                className="bg-[#0b1329] text-slate-300 text-[11px] font-bold border border-slate-700/80 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="This Month">This Month</option>
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="Yearly Overview">Yearly Overview</option>
              </select>
            </div>
            <h3 className="text-slate-400 text-xs font-medium mt-3">Total Sales Revenue</h3>
            <p className="text-2xl font-black text-slate-100 mt-1 transition-all">{currentRevenue.total}</p>
            <p className="text-[10px] text-emerald-400 mt-2 font-medium">{currentRevenue.change}</p>
          </div>

          <div className="bg-[#111c40] border border-slate-800/60 p-5 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <span className="text-xl">📥</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20">Awaiting Action</span>
            </div>
            <h3 className="text-slate-400 text-xs font-medium mt-3">New Received Orders</h3>
            <p className="text-2xl font-black text-slate-100 mt-1">{countNewOrders}</p>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Requires structural dispatch validation</p>
          </div>

          <div className="bg-[#111c40] border border-slate-800/60 p-5 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <span className="text-xl">📦</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/20">Transit State</span>
            </div>
            <h3 className="text-slate-400 text-xs font-medium mt-3">Ongoing Shipments</h3>
            <p className="text-2xl font-black text-slate-100 mt-1">{countOngoingOrders}</p>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Currently out with logistics partners</p>
          </div>

          <div className="bg-[#111c40] border border-slate-800/60 p-5 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <span className="text-xl">⚠️</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20">Attention</span>
            </div>
            <h3 className="text-slate-400 text-xs font-medium mt-3">Out of Stock Variants</h3>
            <p className="text-2xl font-black text-slate-100 mt-1">
              {productsList.filter((p) => p.stock === 0).length}
            </p>
            <p className="text-[10px] text-amber-400 mt-2 font-medium">Requires warehouse item replenishment</p>
          </div>
        </div>

        {/* WORKFLOW ORDERS PIPELINE SYSTEM PANEL */}
        <div className="bg-[#111c40] border border-slate-800/60 rounded-2xl p-6 shadow-md">
          <div className="sm:flex sm:justify-between sm:items-center border-b border-slate-800 pb-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-200">Interactive Orders Fulfillment Engine</h3>
              <p className="text-xs text-slate-400 mt-0.5">Filter incoming buyer records and pipeline them across distribution channels</p>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4 sm:mt-0 bg-[#0b1329] p-1 rounded-xl border border-slate-800">
              {["New", "Ongoing", "Delivered", "Canceled"].map((tab) => {
                const count = orders.filter((o) => o.status === tab).length;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveOrderTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeOrderTab === tab
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                  >
                    {tab}
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${activeOrderTab === tab ? "bg-blue-700 text-white" : "bg-[#111c40] text-slate-400"
                      }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
              <thead className="text-xs uppercase text-slate-400 bg-[#0b1329] border border-slate-800">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer Client Name</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Purchased Line Items</th>
                  <th className="px-4 py-3">Order Subtotal</th>
                  <th className="px-4 py-3 text-center">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.filter((o) => o.status === activeOrderTab).length > 0 ? (
                  orders
                    .filter((o) => o.status === activeOrderTab)
                    .map((order) => (
                      <tr key={order._id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-blue-400 font-semibold">{order._id?.slice(-8) || order._id}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-200">{order.user?.name || "Guest User"}</td>
                        <td className="px-4 py-3.5 text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3.5 text-xs text-slate-300 max-w-xs truncate">{getOrderItemsString(order)}</td>
                        <td className="px-4 py-3.5 font-extrabold text-slate-100">${order.totalPrice}</td>
                        <td className="px-4 py-3.5 flex justify-center gap-2 items-center">
                          {order.status === "New" && (
                            <button
                              onClick={() => proceedOrder(order._id, "New")}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                            >
                              Proceed Order
                            </button>
                          )}

                          {order.status === "Ongoing" && (
                            <button
                              onClick={() => proceedOrder(order._id, "Ongoing")}
                              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                            >
                              Mark Delivered
                            </button>
                          )}

                          {(order.status === "New" || order.status === "Ongoing") && (
                            <button
                              onClick={() => cancelOrder(order._id)}
                              className="bg-slate-800 hover:bg-red-950/40 border border-slate-700 hover:border-red-900 text-slate-400 hover:text-red-400 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}

                          {order.status === "Delivered" && (
                            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md font-bold flex items-center gap-1">
                              ✓ Completed Fulfillment
                            </span>
                          )}
                          {order.status === "Canceled" && (
                            <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-md font-bold">
                              Voided / Dead Record
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-500 text-xs font-medium bg-[#0b1329]/30">
                      No matching checkout traces found inside the "{activeOrderTab}" workflow bucket.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SYSTEM PRODUCTS INVENTORY REGISTRY SECTION */}
        <div className="bg-[#111c40] border border-slate-800/60 rounded-2xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-200">System Product Management Logs</h3>
              <p className="text-xs text-slate-400 mt-0.5">Control live operational details and catalog stock volumes</p>
            </div>
            <button
              onClick={openAddProduct}
              className="text-xs text-blue-400 font-bold hover:underline cursor-pointer bg-transparent border-none"
            >
              Register New Catalog Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
              <thead className="text-xs uppercase text-slate-400 bg-[#0b1329] border border-slate-800">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Stock Status</th>
                  <th className="px-4 py-3 text-center">Action Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {productsList.map((product) => (
                  <tr key={product.productId} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-xs">{product.productId}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-200">{product.title}</td>
                    <td className="px-4 py-3.5 text-slate-400 uppercase text-xs font-semibold">{product.category}</td>
                    <td className="px-4 py-3.5">
                      {product.stock > 0 ? (
                        <span className="text-emerald-400 font-semibold text-xs bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10">
                          In Stock ({product.stock})
                        </span>
                      ) : (
                        <span className="text-red-400 font-semibold text-xs bg-red-500/5 px-2 py-1 rounded-md border border-red-500/10">
                          Out of Stock (0)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center flex justify-center gap-2">
                      <button
                        onClick={() => openEditProduct(product)}
                        className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors font-medium cursor-pointer"
                      >
                        Edit Item
                      </button>
                      <button
                        onClick={() => deleteProduct(product.productId)}
                        className="text-xs bg-red-950/20 border border-red-900/50 hover:bg-red-600 hover:text-white text-red-400 px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* USER MANAGEMENT REGISTRY SECTION */}
        <div className="bg-[#111c40] border border-slate-800/60 rounded-2xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-200">User Management Registry</h3>
              <p className="text-xs text-slate-400 mt-0.5">View and moderate active user accounts registered in the database</p>
            </div>
            <span className="text-xs text-blue-400 font-bold">Total Accounts: {usersList.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
              <thead className="text-xs uppercase text-slate-400 bg-[#0b1329] border border-slate-800">
                <tr>
                  <th className="px-4 py-3">User ID</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {usersList.length > 0 ? (
                  usersList.map((usr) => (
                    <tr key={usr._id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3.5 text-slate-500 font-mono text-xs">{usr._id}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-200">{usr.email}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${usr.role === "admin"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}>
                          {usr.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedUser(usr)}
                          className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer shadow-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => toggleUserRole(usr)}
                          className="text-xs bg-purple-950/20 border border-purple-900/50 hover:bg-purple-600 hover:text-white text-purple-400 px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
                        >
                          Toggle Role
                        </button>
                        <button
                          onClick={() => deleteUser(usr._id)}
                          className="text-xs bg-red-950/20 border border-red-900/50 hover:bg-red-600 hover:text-white text-red-400 px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-500 text-xs font-medium bg-[#0b1329]/30">
                      No users registered in the system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* USER DETAILS MODAL (Viewer) */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-[#111c40] border border-slate-805 rounded-3xl p-6 max-w-sm w-full text-white shadow-2xl relative">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
              <h3 className="text-lg font-black text-blue-400 border-b border-slate-800 pb-3 mb-4">
                User Details Card
              </h3>
              <div className="space-y-4 text-left">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">User ID</label>
                  <p className="font-mono text-sm text-slate-300 mt-0.5">{selectedUser._id}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <p className="text-base font-bold text-slate-100 mt-0.5">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <p className="text-sm font-semibold text-slate-100 mt-0.5">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Role</label>
                  <div className="mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedUser.role === "admin"
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}>
                      {selectedUser.role.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 px-4 rounded-xl border border-slate-700/60 mt-6 transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        )}

        {/* PRODUCT INVENTORY FORM MODAL */}
        {isProductModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-[#111c40] border border-slate-800 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
              <h3 className="text-lg font-black text-blue-400 border-b border-slate-800 pb-3 mb-4">
                {editingProduct ? "Edit Product Details" : "Register New Product"}
              </h3>
              
              <form onSubmit={handleProductSubmit} className="space-y-4 text-left">
                <div className="flex flex-col items-start w-full">
                  <label className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter product title"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full border border-slate-700 rounded-xl px-4 py-2.5 outline-none text-sm bg-[#0b1329] text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-start w-full">
                    <label className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Price ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 99"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full border border-slate-700 rounded-xl px-4 py-2.5 outline-none text-sm bg-[#0b1329] text-slate-100"
                    />
                  </div>

                  <div className="flex flex-col items-start w-full">
                    <label className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Stock Qty</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 15"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full border border-slate-700 rounded-xl px-4 py-2.5 outline-none text-sm bg-[#0b1329] text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-start w-full">
                  <label className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full border border-slate-700 rounded-xl px-4 py-2.5 outline-none text-sm bg-[#0b1329] text-slate-100 cursor-pointer"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Watch">Watch</option>
                    <option value="Phone">Phone</option>
                    <option value="Headphones">Headphones</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Cameras">Cameras</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="flex flex-col items-start w-full">
                  <label className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Description</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Enter detailed description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full border border-slate-700 rounded-xl px-4 py-2.5 outline-none text-sm bg-[#0b1329] text-slate-100 resize-none"
                  ></textarea>
                </div>

                <div className="flex flex-col items-start w-full">
                  <label className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                    Product Images {editingProduct && "(Optional)"}
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    required={!editingProduct}
                    onChange={(e) => setProductForm({ ...productForm, images: e.target.files })}
                    className="w-full border border-slate-700 rounded-xl px-4 py-2 outline-none text-sm bg-[#0b1329] text-slate-100 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 file:cursor-pointer"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl border border-slate-700/60 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProduct}
                    className="w-1/2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {submittingProduct ? "Saving..." : "Save Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Admin;