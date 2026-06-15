
// // import { useState, useEffect, useMemo } from "react";
// // import Navbar from "../components/Navbar";
// // import ProductCard from "../components/ProductCard";
// // import Input from "../components/ui/Input";

// // const API_URL = import.meta.env.VITE_API_URL;

// // const Home = () => {
// //   const [search, setSearch] = useState("");
// //   const [category, setCategory] = useState("All");
// //   const [sortBy, setSortBy] = useState("Featured");
// //   const [productsList, setProductsList] = useState([]);
// //   const [priceRange, setPriceRange] = useState(1000);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   const categories = ["All", "Shoes", "Watch", "Phone", "Headphones", "Laptops", "Cameras", "Gaming", "Accessories"];

// //   const maxProductPrice = useMemo(() => {
// //     return productsList.length > 0
// //       ? Math.max(...productsList.map((p) => p.price))
// //       : 1000;
// //   }, [productsList]);

// //   useEffect(() => {
// //     const fetchProducts = async () => {
// //       setLoading(true);
// //       setError("");
// //       try {
// //         let url = `${API_URL}/products?limit=100`;
// //         if (category !== "All") {
// //           url += `&category=${category.toLowerCase()}`;
// //         }
// //         if (search) {
// //           url += `&search=${search}`;
// //         }
// //         const response = await fetch(url);
// //         const result = await response.json();
// //         if (response.ok && result.status === "success") {
// //           const normalized = (result.data.products || []).map(p => ({
// //             id: p.productId,
// //             productId: p.productId,
// //             _id: p._id,
// //             name: p.title,
// //             title: p.title,
// //             price: p.price,
// //             category: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : "",
// //             image: p.images?.[0]?.url || "",
// //             images: p.images || [],
// //             description: p.description,
// //             rating: p.rating || 4.5,
// //             reviewsCount: p.reviewsCount || 0
// //           }));
// //           setProductsList(normalized);

// //           if (normalized.length > 0) {
// //             setPriceRange(Math.max(...normalized.map(p => p.price)));
// //           }
// //         } else {
// //           setError(result.message || "Failed to load products");
// //         }
// //       } catch (err) {
// //         console.error("Error loading products:", err);
// //         setError("Failed to connect to server");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchProducts();
// //   }, [category, search]);

// //   // Filter products by price range
// //   const filtered = productsList.filter((p) => p.price <= priceRange);

// //   // Sort products dynamically
// //   const sorted = [...filtered].sort((a, b) => {
// //     if (sortBy === "PriceLowToHigh") return a.price - b.price;
// //     if (sortBy === "PriceHighToLow") return b.price - a.price;
// //     if (sortBy === "NameAZ") return a.name.localeCompare(b.name);
// //     if (sortBy === "NameZA") return b.name.localeCompare(a.name);
// //     return 0; // Featured / Default sorting
// //   });

// //   return (
// //     <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
// //       <Navbar />

// //       {/* HERO SECTION */}
// //       <div className="bg-gradient-to-b from-purple-50/50 to-slate-50 dark:from-slate-900/50 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 py-10 sm:py-16 px-4 sm:px-6 text-center">
// //         <div className="max-w-4xl mx-auto animate-fade-in">
// //           <h1 className="text-2xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
// //             Discover Your Next{" "}
// //             <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
// //               Perfect Match
// //             </span>
// //           </h1>
// //           <p className="mt-2 sm:mt-4 text-slate-500 dark:text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto font-medium">
// //             Explore our premium collection of tech, fashion, and lifestyle products curated just for you.
// //           </p>
// //         </div>
// //       </div>

// //       <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 py-6 sm:py-12">
// //         {/* CONTROLS PANEL */}
// //         <div className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 sm:p-5 rounded-2xl shadow-sm mb-6 sm:mb-10 space-y-5">
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-end">
// //             {/* SEARCH */}
// //             <div className="w-full">
// //               <Input
// //                 label="Search Products"
// //                 type="text"
// //                 placeholder="Type to search..."
// //                 value={search}
// //                 onChange={(e) => setSearch(e.target.value)}
// //               />
// //             </div>

// //             {/* PRICE RANGE FILTER */}
// //             <div className="flex flex-col items-start w-full">
// //               <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2.5 uppercase tracking-wider flex justify-between w-full">
// //                 <span>Max Price</span>
// //                 <span className="text-purple-600 dark:text-purple-400 font-extrabold">${priceRange}</span>
// //               </label>
// //               <input
// //                 type="range"
// //                 min="0"
// //                 max={maxProductPrice}
// //                 value={priceRange}
// //                 onChange={(e) => setPriceRange(Number(e.target.value))}
// //                 className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none"
// //               />
// //             </div>

// //             {/* SORTING SELECT */}
// //             <div className="flex flex-col items-start w-full">
// //               <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
// //                 Sort By
// //               </label>
// //               <select
// //                 value={sortBy}
// //                 onChange={(e) => setSortBy(e.target.value)}
// //                 className="w-full border border-slate-200 dark:border-slate-700 focus:border-transparent focus:ring-2 focus:ring-purple-500 rounded-xl px-4 py-3 outline-none text-sm bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-100 cursor-pointer"
// //               >
// //                 <option value="Featured">Featured</option>
// //                 <option value="PriceLowToHigh">Price: Low to High</option>
// //                 <option value="PriceHighToLow">Price: High to Low</option>
// //                 <option value="NameAZ">Name: A to Z</option>
// //                 <option value="NameZA">Name: Z to A</option>
// //               </select>
// //             </div>
// //           </div>

// //           {/* CATEGORIES PILLS - Fixed overflow container for smooth edge-to-edge mobile scroll */}
// //           <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col items-start w-full min-w-0">
// //             <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
// //               Category
// //             </span>

// //             <div className="w-full overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
// //               <div className="flex gap-2 min-w-max md:min-w-0 md:flex-wrap">
// //                 {categories.map((cat) => (
// //                   <button
// //                     key={cat}
// //                     onClick={() => setCategory(cat)}
// //                     className={`whitespace-nowrap px-4 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold rounded-full border transition-all duration-200 cursor-pointer ${category === cat
// //                       ? "bg-purple-600 border-purple-600 text-white shadow-md"
// //                       : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-white"
// //                       }`}
// //                   >
// //                     {cat}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* PRODUCTS GRID */}
// //         {loading ? (
// //           <div className="flex flex-col items-center justify-center py-20 w-full col-span-full">
// //             <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
// //             <p className="text-slate-400 dark:text-slate-500 mt-4 font-bold text-sm">Loading products...</p>
// //           </div>
// //         ) : error ? (
// //           <div className="text-center py-20 bg-white dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 max-w-xl mx-auto shadow-sm w-full col-span-full">
// //             <p className="text-red-500 font-bold">{error}</p>
// //           </div>
// //         ) : sorted.length > 0 ? (
// //           <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6 md:gap-8 w-full">
// //             {sorted.map((p) => (
// //               <ProductCard key={p.id} product={p} />
// //             ))}
// //           </div>
// //         ) : (
// //           <div className="text-center py-20 bg-white dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 max-w-xl mx-auto shadow-sm">
// //             <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
// //             </svg>
// //             <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No products found</h3>
// //             <p className="text-slate-400 dark:text-slate-500 mt-2 text-xs">Try adjusting your filters or search keywords.</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Home;   


// import { useState, useEffect, useMemo } from "react";
// import Navbar from "../components/Navbar";
// import ProductCard from "../components/ProductCard";
// import Input from "../components/ui/Input";

// const API_URL = import.meta.env.VITE_API_URL;

// // Helper to safely format backend product data and keep MongoDB structural identifiers intact
// const normalizeProduct = (p) => {
//   if (!p) return null;
//   return {
//     _id: p._id,
//     id: p._id || p.id || p.productId,
//     name: p.name || p.title || "",
//     title: p.title || p.name || "",
//     price: p.price || 0,
//     category: p.category || "General",
//     image: p.images?.[0]?.url || p.image || "",
//     images: p.images || [],
//     description: p.description || "Premium quality build",
//     rating: p.rating || 4.5
//   };
// };

// const Home = () => {
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");
//   const [sortBy, setSortBy] = useState("Featured");
//   const [productsList, setProductsList] = useState([]);
//   const [priceRange, setPriceRange] = useState(1000);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const categories = ["All", "Shoes", "Watch", "Phone", "Headphones", "Laptops", "Cameras", "Gaming", "Accessories"];

//   const maxProductPrice = useMemo(() => {
//     return productsList.length > 0
//       ? Math.max(...productsList.map((p) => p.price))
//       : 1000;
//   }, [productsList]);

//   // Sync state max boundary automatically when backend delivers payload
//   useEffect(() => {
//     if (maxProductPrice > 0 && priceRange === 1000) {
//       setPriceRange(maxProductPrice);
//     }
//   }, [maxProductPrice]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         let url = `${API_URL}/products?limit=100`;
//         if (category !== "All") {
//           url += `&category=${category.toLowerCase()}`;
//         }
//         if (search) {
//           url += `&search=${search}`;
//         }

//         const res = await fetch(url);
//         const result = await res.json();

//         console.log("HOME PRODUCTS API PAYLOAD:", result);

//         if (res.ok && result.success) {
//           // Extract array data target key cleanly
//           const rawArray = result.products || result.data || [];

//           // Map array data inside state through normalization rule parameters
//           const cleanMappedProducts = rawArray.map(normalizeProduct).filter(Boolean);

//           setProductsList(cleanMappedProducts);
//         } else {
//           setError(result.message || "Failed to fetch inventory collections.");
//         }
//       } catch (err) {
//         console.error("Home API Core Failure:", err);
//         setError("Unable to connect to service registry backend.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [category, search]);

//   // Client side filtering & sorting operations workflow pipeline
//   const sorted = useMemo(() => {
//     let filtered = [...productsList];

//     // Filter by price range state
//     filtered = filtered.filter((p) => p.price <= priceRange);

//     // Apply Sorting metrics logic rules 
//     if (sortBy === "Price: Low to High") {
//       filtered.sort((a, b) => a.price - b.price);
//     } else if (sortBy === "Price: High to Low") {
//       filtered.sort((a, b) => b.price - a.price);
//     } else if (sortBy === "Top Rated") {
//       filtered.sort((a, b) => b.rating - a.rating);
//     }

//     return filtered;
//   }, [productsList, priceRange, sortBy]);

//   return (
//     <>
//       <Navbar />
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col md:flex-row gap-6 md:gap-8 dark:bg-slate-950 min-h-screen">

//         {/* FILTERS SIDEBAR CONTROLLER ELEMENT */}
//         <section className="w-full md:w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 sm:p-6 h-fit md:sticky md:top-24 shadow-sm">
//           <div className="flex justify-between items-center mb-4 sm:mb-6">
//             <h2 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm sm:text-base tracking-wide uppercase">
//               Filters
//             </h2>
//             {(search || category !== "All" || sortBy !== "Featured") && (
//               <button
//                 onClick={() => {
//                   setSearch("");
//                   setCategory("All");
//                   setSortBy("Featured");
//                   setPriceRange(maxProductPrice);
//                 }}
//                 className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 font-bold transition-colors cursor-pointer"
//               >
//                 Clear All
//               </button>
//             )}
//           </div>

//           {/* Search Input Field */}
//           <div className="space-y-1.5 mb-5 sm:mb-6">
//             <label className="text-[10px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
//               Search Products
//             </label>
//             <Input
//               type="text"
//               placeholder="Type keywords..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full text-xs sm:text-sm bg-slate-50 border-slate-100 dark:bg-slate-950 dark:border-slate-800"
//             />
//           </div>

//           {/* Sort Selection Menu Option */}
//           <div className="space-y-1.5 mb-5 sm:mb-6">
//             <label className="text-[10px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
//               Sort By
//             </label>
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
//             >
//               <option>Featured</option>
//               <option>Price: Low to High</option>
//               <option>Price: High to Low</option>
//               <option>Top Rated</option>
//             </select>
//           </div>

//           {/* Category List Selection Section */}
//           <div className="space-y-2 mb-5 sm:mb-6">
//             <label className="text-[10px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
//               Categories
//             </label>
//             <div className="flex flex-wrap md:flex-col gap-1.5 max-h-40 md:max-h-none overflow-y-auto pr-1">
//               {categories.map((cat) => (
//                 <button
//                   key={cat}
//                   onClick={() => setCategory(cat)}
//                   className={`px-3 py-2 text-left text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-between border ${category === cat
//                       ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/10"
//                       : "bg-slate-50 dark:bg-slate-950 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
//                     }`}
//                 >
//                   <span>{cat}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Price Range Slider Control Filter Element */}
//           <div className="space-y-2">
//             <div className="flex justify-between items-baseline">
//               <label className="text-[10px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
//                 Max Price
//               </label>
//               <span className="text-xs sm:text-sm font-black text-purple-600 dark:text-purple-400">
//                 ${priceRange}
//               </span>
//             </div>
//             <input
//               type="range"
//               min="0"
//               max={maxProductPrice || 1000}
//               value={priceRange}
//               onChange={(e) => setPriceRange(Number(e.target.value))}
//               className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none"
//             />
//           </div>
//         </section>

//         {/* PRODUCTS DYNAMIC GRID WORKSPACE LAYOUT CONTAINER */}
//         <section className="flex-1">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-32 col-span-full">
//               <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
//               <p className="text-slate-400 dark:text-slate-500 mt-4 font-bold text-sm">
//                 Loading products...
//               </p>
//             </div>
//           ) : error ? (
//             <div className="text-center py-20 bg-white dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 max-w-xl mx-auto shadow-sm w-full col-span-full">
//               <p className="text-red-500 font-bold">{error}</p>
//             </div>
//           ) : sorted.length > 0 ? (
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6 md:gap-8 w-full">
//               {sorted.map((p) => (
//                 <ProductCard key={p.id} product={p} />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-20 bg-white dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 max-w-xl mx-auto shadow-sm w-full">
//               <svg
//                 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="1.5"
//                   d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <h3 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300">
//                 No matching products found
//               </h3>
//               <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">
//                 Try adjustment controls or expanding keyword combinations.
//               </p>
//             </div>
//           )}
//         </section>
//       </main>
//     </>
//   );
// };

// export default Home; 








import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Input from "../components/ui/Input";

const API_URL = import.meta.env.VITE_API_URL;

const normalizeProduct = (p) => {
  if (!p) return null;
  return {
    _id: p._id,
    id: p._id || p.id || p.productId,
    name: p.name || p.title || "",
    title: p.title || p.name || "",
    price: p.price || 0,
    category: p.category || "General",
    image: p.images?.[0]?.url || p.image || "",
    images: p.images || [],
    description: p.description || "Premium quality build",
    rating: p.rating || 4.5
  };
};

const Home = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [productsList, setProductsList] = useState([]);
  const [priceRange, setPriceRange] = useState(1000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = ["All", "Shoes", "Watch", "Phone", "Headphones", "Laptops", "Cameras", "Gaming", "Accessories"];

  const maxProductPrice = useMemo(() => {
    return productsList.length > 0
      ? Math.max(...productsList.map((p) => p.price))
      : 1000;
  }, [productsList]);

  useEffect(() => {
    if (maxProductPrice > 0 && priceRange === 1000) {
      setPriceRange(maxProductPrice);
    }
  }, [maxProductPrice]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        let url = `${API_URL}/products?limit=100`;
        if (category !== "All") {
          url += `&category=${category.toLowerCase()}`;
        }
        if (search) {
          url += `&search=${search}`;
        }

        const res = await fetch(url);
        const result = await res.json();

        if (res.ok && (result.success || result.status === "success")) {
          const rawArray = result.products || result.data?.products || result.data || [];
          const cleanMappedProducts = rawArray.map(normalizeProduct).filter(Boolean);
          setProductsList(cleanMappedProducts);
        } else {
          setError(result.message || "Failed to fetch inventory collections.");
        }
      } catch (err) {
        console.error("Home API Core Failure:", err);
        setError("Unable to connect to service registry backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search]);

  const sorted = useMemo(() => {
    let filtered = [...productsList];
    filtered = filtered.filter((p) => p.price <= priceRange);

    if (sortBy === "Price: Low to High" || sortBy === "PriceLowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low" || sortBy === "PriceHighToLow") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Top Rated") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "NameAZ") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "NameZA") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  }, [productsList, priceRange, sortBy]);

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      {/* PREMIUM HERO SECTION RESTORED */}
      <div className="bg-gradient-to-b from-purple-50/50 to-slate-50 dark:from-slate-900/40 dark:to-slate-950 border-b border-slate-100 dark:border-slate-900 py-10 sm:py-16 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-2xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Discover Your Next{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Perfect Match
            </span>
          </h1>
          <p className="mt-2 sm:mt-4 text-slate-500 dark:text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto font-medium">
            Explore our premium collection of tech, fashion, and lifestyle products curated just for you.
          </p>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">

        {/* CONTROLS HORIZONTAL PANEL LAYOUT */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 sm:p-6 rounded-2xl shadow-sm mb-6 sm:mb-10 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-end">

            {/* SEARCH PRODUCTS BLOCK */}
            <div className="w-full space-y-1.5">
              <label className="text-[10px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Search Products
              </label>
              <Input
                type="text"
                placeholder="Type keywords to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border-slate-100 dark:bg-slate-950 dark:border-slate-800"
              />
            </div>

            {/* PRICE INTERACTION SLIDER */}
            <div className="flex flex-col items-start w-full space-y-1.5">
              <label className="text-[10px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex justify-between w-full">
                <span>Max Price</span>
                <span className="text-purple-600 dark:text-purple-400 font-black">${priceRange}</span>
              </label>
              <input
                type="range"
                min="0"
                max={maxProductPrice || 1000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none"
              />
            </div>

            {/* SORT SELECTION LAYER */}
            <div className="flex flex-col items-start w-full space-y-1.5">
              <label className="text-[10px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
              >
                <option value="Featured">Featured</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Top Rated">Top Rated</option>
                <option value="NameAZ">Name: A to Z</option>
                <option value="NameZA">Name: Z to a</option>
              </select>
            </div>
          </div>

          {/* HORIZONTAL CATEGORY PILLS (Fixed Edge-To-Edge Container) */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-start w-full min-w-0">
            <span className="text-[10px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
              Categories
            </span>

            <div className="w-full overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-2 min-w-max md:min-w-0 md:flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold rounded-full border transition-all duration-200 cursor-pointer ${category === cat
                        ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/10"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCTS AREA DYNAMIC BLOCK */}
        <div className="w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 dark:text-slate-500 mt-4 font-bold text-sm">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 max-w-xl mx-auto shadow-sm w-full">
              <p className="text-red-500 font-bold">{error}</p>
            </div>
          ) : sorted.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8 w-full">
              {sorted.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 max-w-xl mx-auto shadow-sm w-full">
              <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300">No matching products found</h3>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">Try adjustment controls or expanding keyword combinations.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Home;