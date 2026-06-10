

// import { useState } from "react";

// const Admin = () => {
//   // Authentication states
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   // Hardcoded mockup credentials for administration panel
//   const ADMIN_USERNAME = "admin";
//   const ADMIN_PASSWORD = "password123";

//   // Mock dashboard analytics/metrics data
//   const stats = [
//     { name: "Total Sales", value: "$12,450", icon: "💰", change: "+12% this week" },
//     { name: "Active Orders", value: "24", icon: "📦", change: "5 pending dispatch" },
//     { name: "Total Customers", value: "1,204", icon: "👥", change: "+48 this month" },
//     { name: "Out of Stock", value: "3", icon: "⚠️", change: "Items require restock" },
//   ];

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
//       setIsAuthenticated(true);
//       setError("");
//     } else {
//       setError("Invalid username or password. Please try again.");
//     }
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     setUsername("");
//     setPassword("");
//   };

//   // 1. RENDER LOGIN FORM IF NOT AUTHENTICATED
//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-[#0b1329] flex flex-col justify-center items-center px-4">
//         <div className="w-full max-w-md bg-[#111c40] border border-slate-800/80 p-8 rounded-2xl shadow-xl text-white">
//           <div className="text-center mb-8">
//             <h1 className="text-2xl font-black tracking-tight text-blue-400">
//               ShopNpay <span className="text-xs bg-purple-600 text-white font-bold px-2 py-0.5 rounded-full ml-1">Admin Portal</span>
//             </h1>
//             <p className="text-slate-400 text-sm mt-2">Sign in to access control management</p>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-5">
//             {error && (
//               <div className="bg-red-500/10 border border-red-500 text-red-400 text-xs p-3 rounded-xl font-medium animate-fade-in">
//                 {error}
//               </div>
//             )}

//             <div className="flex flex-col items-start w-full">
//               <label className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter admin username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="w-full border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 outline-none text-sm bg-[#0b1329] text-slate-100 transition-all"
//                 required
//               />
//             </div>

//             <div className="flex flex-col items-start w-full">
//               <label className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 placeholder="Enter admin password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 outline-none text-sm bg-[#0b1329] text-slate-100 transition-all"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors mt-2 cursor-pointer shadow-md"
//             >
//               Sign In to Dashboard
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-slate-500 text-[11px]">Hint for testing: admin / password123</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // 2. RENDER ACTUAL ADMIN DASHBOARD SECURE PANEL IF AUTHENTICATED
//   return (
//     <div className="min-h-screen bg-[#0b1329] text-white">
//       {/* INTERNAL DASHBOARD HEADER */}
//       <header className="bg-[#111c40] border-b border-slate-800 px-6 py-4 flex justify-between items-center">
//         <div>
//           <h2 className="text-xl font-black text-blue-400 tracking-tight">Admin Dashboard</h2>
//           <p className="text-xs text-slate-400">Welcome back, Site Manager</p>
//         </div>
//         <button
//           onClick={handleLogout}
//           className="bg-red-600/10 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
//         >
//           Secure Logout
//         </button>
//       </header>

//       {/* DASHBOARD GRID BODY CONTENT */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

//         {/* STATS MATRIX CARDS */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           {stats.map((stat, idx) => (
//             <div key={idx} className="bg-[#111c40] border border-slate-800/60 p-5 rounded-2xl shadow-sm">
//               <div className="flex justify-between items-start">
//                 <span className="text-xl">{stat.icon}</span>
//                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.name === "Out of Stock" ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"
//                   }`}>
//                   Active
//                 </span>
//               </div>
//               <h3 className="text-slate-400 text-xs font-medium mt-3">{stat.name}</h3>
//               <p className="text-2xl font-black text-slate-100 mt-1">{stat.value}</p>
//               <p className="text-[10px] text-slate-500 mt-2 font-medium">{stat.change}</p>
//             </div>
//           ))}
//         </div>

//         {/* RECENT INVENTORIES / ORDERS LOG SHEET MOCK */}
//         <div className="bg-[#111c40] border border-slate-800/60 rounded-2xl p-6 shadow-sm">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-base font-bold text-slate-200">System Product Management Logs</h3>
//             <span className="text-xs text-blue-400 cursor-pointer font-medium hover:underline">View All Log Items</span>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm text-slate-300">
//               <thead className="text-xs uppercase text-slate-400 bg-[#0b1329] border border-slate-800">
//                 <tr>
//                   <th className="px-4 py-3">ID</th>
//                   <th className="px-4 py-3">Product Name</th>
//                   <th className="px-4 py-3">Category</th>
//                   <th className="px-4 py-3">Stock Status</th>
//                   <th className="px-4 py-3">Action status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-800">
//                 <tr className="hover:bg-slate-800/20">
//                   <td className="px-4 py-3.5 text-slate-500 font-mono">#03912</td>
//                   <td className="px-4 py-3.5 font-bold text-slate-200">Nike Air Max 270</td>
//                   <td className="px-4 py-3.5">Shoes</td>
//                   <td className="px-4 py-3.5 text-emerald-400 font-semibold">In Stock (12)</td>
//                   <td className="px-4 py-3.5"><span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md cursor-pointer hover:bg-slate-600">Edit</span></td>
//                 </tr>
//                 <tr className="hover:bg-slate-800/20">
//                   <td className="px-4 py-3.5 text-slate-500 font-mono">#03913</td>
//                   <td className="px-4 py-3.5 font-bold text-slate-200">Apple Watch Series 9</td>
//                   <td className="px-4 py-3.5">Watch</td>
//                   <td className="px-4 py-3.5 text-emerald-400 font-semibold">In Stock (8)</td>
//                   <td className="px-4 py-3.5"><span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md cursor-pointer hover:bg-slate-600">Edit</span></td>
//                 </tr>
//                 <tr className="hover:bg-slate-800/20">
//                   <td className="px-4 py-3.5 text-slate-500 font-mono">#03914</td>
//                   <td className="px-4 py-3.5 font-bold text-slate-200">iPhone 15 Pro Max</td>
//                   <td className="px-4 py-3.5">Phone</td>
//                   <td className="px-4 py-3.5 text-red-400 font-semibold">Out of Stock (0)</td>
//                   <td className="px-4 py-3.5"><span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md cursor-pointer hover:bg-slate-600">Edit</span></td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>

//       </main>
//     </div>
//   );
// };

// export default Admin; 



import { useState } from "react";

const Admin = () => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hardcoded mockup credentials for administration panel
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "password123";

  // Dashboard Filters State
  const [revenueFilter, setRevenueFilter] = useState("This Month");
  const [activeOrderTab, setActiveOrderTab] = useState("New");

  // Dynamic Mock Orders Data Matrix
  const [orders, setOrders] = useState([
    { id: "ORD-9481", customer: "Zain Ahmed", date: "2026-06-08", total: 120, items: "Nike Air Max x1", status: "New" },
    { id: "ORD-9482", customer: "Sara Khan", date: "2026-06-07", total: 399, items: "Apple Watch S9 x1", status: "New" },
    { id: "ORD-9310", customer: "Bilal Malik", date: "2026-06-05", total: 1499, items: "iPhone 15 Pro x1", status: "Ongoing" },
    { id: "ORD-9302", customer: "Ayesha Omer", date: "2026-06-04", total: 85, items: "Gaming Mouse x1", status: "Ongoing" },
    { id: "ORD-9124", customer: "Hamza Ali", date: "2026-05-28", total: 240, items: "Wireless Headphones x2", status: "Delivered" },
    { id: "ORD-8901", customer: "Sana Sana", date: "2026-05-15", total: 1250, items: "MacBook Air M2 x1", status: "Canceled" },
  ]);

  // Product Inventory Logs
  const [productsList, setProductsList] = useState([
    { id: "#03912", name: "Nike Air Max 270", category: "Shoes", stock: 12 },
    { id: "#03913", name: "Apple Watch Series 9", category: "Watch", stock: 8 },
    { id: "#03914", name: "iPhone 15 Pro Max", category: "Phone", stock: 0 },
  ]);

  // User management registry list
  const [usersList, setUsersList] = useState([
    { id: "USR-001", name: "Zain Ahmed", email: "zain.ahmed@example.com", role: "user" },
    { id: "USR-002", name: "Sara Khan", email: "sara.khan@example.com", role: "user" },
    { id: "USR-003", name: "Bilal Malik", email: "bilal.malik@example.com", role: "admin" },
    { id: "USR-004", name: "Ayesha Omer", email: "ayesha.omer@example.com", role: "user" }
  ]);

  const [selectedUser, setSelectedUser] = useState(null);

  const deleteUser = (userId) => {
    setUsersList(prev => prev.filter(user => user.id !== userId));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(null);
    }
  };

  // Handle Order Workflow Lifecycle Transitions
  const proceedOrder = (orderId, currentStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          let nextStatus = currentStatus;
          if (currentStatus === "New") nextStatus = "Ongoing";
          else if (currentStatus === "Ongoing") nextStatus = "Delivered";
          return { ...order, status: nextStatus };
        }
        return order;
      })
    );
  };

  const cancelOrder = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "Canceled" } : order
      )
    );
  };

  // Dynamic Revenue Filter Aggregator Engine
  const getRevenueValue = () => {
    switch (revenueFilter) {
      case "This Month": return { total: "$4,210", change: "+4.2% from last week" };
      case "Last 6 Months": return { total: "$28,490", change: "+18.5% over last half" };
      case "Yearly Overview": return { total: "$84,120", change: "+32.1% year-on-year" };
      default: return { total: "$12,450", change: "+12% this week" };
    }
  };

  const currentRevenue = getRevenueValue();

  // Helper Counters for Upper Metric Display Widgets
  const countNewOrders = orders.filter((o) => o.status === "New").length;
  const countOngoingOrders = orders.filter((o) => o.status === "Ongoing").length;

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid credentials. Please use admin / password123");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  // 1. RENDER LOGIN VIEW (IF NOT AUTHENTICATED)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b1329] flex flex-col justify-center items-center px-4 font-sans">
        <div className="w-full max-w-md bg-[#111c40] border border-slate-800 p-8 rounded-2xl shadow-2xl text-white">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black tracking-tight text-blue-400">
              ShopNpay <span className="text-xs bg-purple-600 text-white font-bold px-2.5 py-0.5 rounded-full ml-1">Admin Portal</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">Sign in to manage store management networks</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 text-xs p-3 rounded-xl font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col items-start w-full">
              <label className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Username</label>
              <input
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 outline-none text-sm bg-[#0b1329] text-slate-100 transition-all"
                required
              />
            </div>

            <div className="flex flex-col items-start w-full">
              <label className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 outline-none text-sm bg-[#0b1329] text-slate-100 transition-all"
                required
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer mt-2 shadow-lg">
              Sign In to Dashboard
            </button>
          </form>
          <div className="mt-5 text-center"><p className="text-slate-500 text-[11px]">Testing Creds: admin / password123</p></div>
        </div>
      </div>
    );
  }

  // 2. RENDER FULL INTERACTIVE ADMIN SUITE
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
          {/* INCOME ANALYTICS CARD WITH DROP-DOWN TIME FILTER */}
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

          {/* NEW ORDERS BADGE FIELD */}
          <div className="bg-[#111c40] border border-slate-800/60 p-5 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <span className="text-xl">📥</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20">Awaiting Action</span>
            </div>
            <h3 className="text-slate-400 text-xs font-medium mt-3">New Received Orders</h3>
            <p className="text-2xl font-black text-slate-100 mt-1">{countNewOrders}</p>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Requires structural dispatch validation</p>
          </div>

          {/* ACTIVE ONGOING SHIPMENTS CARD */}
          <div className="bg-[#111c40] border border-slate-800/60 p-5 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <span className="text-xl">📦</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/20">Transit State</span>
            </div>
            <h3 className="text-slate-400 text-xs font-medium mt-3">Ongoing Shipments</h3>
            <p className="text-2xl font-black text-slate-100 mt-1">{countOngoingOrders}</p>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Currently out with logistics partners</p>
          </div>

          {/* OUT OF STOCK ALERTS CARD */}
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

            {/* SUB-STATE PIPELINE CONTROL PILLS BUTTONS */}
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

          {/* GRID RENDER MODULE */}
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
                      <tr key={order.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-blue-400 font-semibold">{order.id}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-200">{order.customer}</td>
                        <td className="px-4 py-3.5 text-slate-400">{order.date}</td>
                        <td className="px-4 py-3.5 text-xs text-slate-300 max-w-xs truncate">{order.items}</td>
                        <td className="px-4 py-3.5 font-extrabold text-slate-100">${order.total}</td>
                        <td className="px-4 py-3.5 flex justify-center gap-2 items-center">
                          {/* WORKFLOW TRANSITION CALL TO ACTION TRIGGERS */}
                          {order.status === "New" && (
                            <button
                              onClick={() => proceedOrder(order.id, "New")}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                            >
                              Proceed Order
                            </button>
                          )}
                          {order.status === "Ongoing" && (
                            <button
                              onClick={() => proceedOrder(order.id, "Ongoing")}
                              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                            >
                              Mark Delivered
                            </button>
                          )}

                          {/* SYSTEM CONDITIONAL CANCEL ACTION */}
                          {(order.status === "New" || order.status === "Ongoing") && (
                            <button
                              onClick={() => cancelOrder(order.id)}
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
            <span className="text-xs text-blue-400 font-bold hover:underline cursor-pointer">Register New Catalog Item</span>
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
                  <tr key={product.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-xs">{product.id}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-200">{product.name}</td>
                    <td className="px-4 py-3.5 text-slate-400">{product.category}</td>
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
                    <td className="px-4 py-3.5 text-center">
                      <button className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors font-medium cursor-pointer">
                        Edit Item
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
                    <tr key={usr.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3.5 text-slate-500 font-mono text-xs">{usr.id}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-200">{usr.email}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          usr.role === "admin"
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
                          onClick={() => deleteUser(usr.id)}
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
                  <p className="font-mono text-sm text-slate-300 mt-0.5">{selectedUser.id}</p>
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
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      selectedUser.role === "admin"
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

      </main>
    </div>
  );
};

export default Admin;