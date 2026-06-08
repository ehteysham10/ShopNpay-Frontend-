import { useState } from "react";
import Navbar from "../components/Navbar";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    category: ""
  });

  const add = (e) => {
    e.preventDefault();
    setProducts([...products, { ...form, id: Date.now() }]);
    setForm({ name: "", price: "", image: "", category: "" });
  };

  const removeProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-8 text-left">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* FORM */}
          <form
            onSubmit={add}
            className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-left">
              Add New Product
            </h2>

            <Input
              label="Product Name"
              placeholder="e.g. Wireless Headphones"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <Input
              label="Price"
              placeholder="e.g. 99"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />

            <Input
              label="Image URL"
              placeholder="e.g. https://images.unsplash.com/..."
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              required
            />

            <Input
              label="Category"
              placeholder="e.g. Headphones"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 text-sm tracking-wider uppercase font-bold"
              >
                Add Product
              </Button>
            </div>
          </form>

          {/* LIST */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-left">
              Manage Products ({products.length})
            </h2>

            {products.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 p-6">
                <p className="text-slate-400 text-sm font-semibold">
                  No products added yet. Use the form to start building your catalog.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
                  >
                    {/* THUMBNAIL IF IMAGE URL IS GIVEN */}
                    <div className="flex items-center gap-4">
                      {p.image && (
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                      <div className="text-left">
                        <h3 className="font-bold text-slate-800 text-sm">
                          {p.name}
                        </h3>
                        <span className="inline-block mt-0.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                          {p.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-extrabold text-slate-900">
                        ${p.price}
                      </span>
                      <Button
                        onClick={() => removeProduct(p.id)}
                        variant="danger"
                        size="sm"
                        className="px-3 py-1.5 text-xs font-semibold"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;