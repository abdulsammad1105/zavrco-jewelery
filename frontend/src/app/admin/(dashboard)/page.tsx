"use client";

import { apiFetch } from "@/lib/api";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
  stock: number;
  featured: boolean;
  isNew: boolean;
  published: boolean;
  images: string[];
  description: string | null;
  material: string | null;
  dimensions: string | null;
  categoryId: number | null;
  collectionId: number | null;
  care: string | null;
};

type Category = { id: number; name: string; slug: string };
type Collection = { id: number; name: string; slug: string };

const emptyForm = {
  name: "",
  slug: "",
  price: "",
  stock: "0",
  description: "",
  material: "",
  dimensions: "",
  care: "",
  image1: "",
  image2: "",
  categoryId: "",
  collectionId: "",
  featured: false,
  isNew: false,
  published: true,
};

const inputClass =
  "bg-obsidian border border-border px-3 py-2 text-sm text-offwhite placeholder:text-muted focus:outline-none focus:border-chrome";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (searchVal = "", categoryVal = "") => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (searchVal) qs.set("search", searchVal);
    if (categoryVal) qs.set("category", categoryVal);

    const [pRes, cRes, colRes] = await Promise.all([
      apiFetch(`/api/admin/products?${qs.toString()}`),
      apiFetch("/api/categories"),
      apiFetch("/api/collections"),
    ]);
    setProducts(await pRes.json());
    setCategories(await cRes.json());
    setCollections(await colRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => load(search, categoryFilter), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter]);

  function startEdit(p: Product) {
    setEditing(p.id);
    setForm({
      name: p.name,
      slug: p.slug,
      price: p.price,
      stock: String(p.stock),
      description: p.description || "",
      material: p.material || "",
      dimensions: p.dimensions || "",
      care: p.care || "",
      image1: (p.images || [])[0] || "",
      image2: (p.images || [])[1] || "",
      categoryId: p.categoryId ? String(p.categoryId) : "",
      collectionId: p.collectionId ? String(p.collectionId) : "",
      featured: p.featured,
      isNew: p.isNew,
      published: p.published,
    });
    setShowForm(true);
  }

  function startNew() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      ...form,
      images: [form.image1, form.image2].map((s) => s.trim()).filter(Boolean),
    };

    if (editing) {
      await apiFetch(`/api/admin/products/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await apiFetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    load(search, categoryFilter);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await apiFetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load(search, categoryFilter);
  }

  async function togglePublished(p: Product) {
    await apiFetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !p.published }),
    });
    load(search, categoryFilter);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-xl tracking-wider uppercase font-light">
          Products ({products.length})
        </h1>
        <button
          onClick={startNew}
          className="px-4 py-2 bg-offwhite text-obsidian text-xs tracking-wider uppercase font-medium hover:bg-silver transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} flex-1 min-w-[200px]`}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-charcoal rounded p-6 border border-border">
          <h2 className="text-sm tracking-wider uppercase text-chrome mb-4">
            {editing ? "Edit Product" : "New Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Product Name *" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              <input type="text" placeholder="Slug (auto if blank)" value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} />
              <input type="number" placeholder="Price (PKR) *" required value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} />
              <input type="number" placeholder="Stock" value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputClass} />
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className={`${inputClass} cursor-pointer`}>
                <option value="">Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={form.collectionId} onChange={(e) => setForm({ ...form, collectionId: e.target.value })}
                className={`${inputClass} cursor-pointer`}>
                <option value="">Collection</option>
                {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="text" placeholder="Material" value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })} className={inputClass} />
              <input type="text" placeholder="Dimensions" value={form.dimensions}
                onChange={(e) => setForm({ ...form, dimensions: e.target.value })} className={inputClass} />
            </div>

            <textarea placeholder="Description" rows={3} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`w-full ${inputClass} resize-none`} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Image path e.g. /products/apex-crystal-cuff.jpg *" required value={form.image1}
                onChange={(e) => setForm({ ...form, image1: e.target.value })} className={inputClass} />
              <input type="text" placeholder="Secondary image (optional)" value={form.image2}
                onChange={(e) => setForm({ ...form, image2: e.target.value })} className={inputClass} />
            </div>
            <p className="text-[11px] text-muted -mt-2">
              Add image files to <code>public/products/</code>, then reference them here as <code>/products/filename.jpg</code>.
            </p>

            <div className="flex gap-6 flex-wrap">
              <label className="flex items-center gap-2 text-sm text-chrome cursor-pointer">
                <input type="checkbox" checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-offwhite" />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-chrome cursor-pointer">
                <input type="checkbox" checked={form.isNew}
                  onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="accent-offwhite" />
                New Arrival
              </label>
              <label className="flex items-center gap-2 text-sm text-chrome cursor-pointer">
                <input type="checkbox" checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-offwhite" />
                Published
              </label>
            </div>

            <div className="flex gap-3">
              <button type="submit"
                className="px-6 py-2 bg-offwhite text-obsidian text-xs tracking-wider uppercase font-medium hover:bg-silver transition-colors">
                {editing ? "Update" : "Create"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                className="px-6 py-2 border border-border text-xs tracking-wider uppercase text-muted hover:text-offwhite transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs tracking-wider uppercase text-chrome">
              <th className="text-left py-3 px-2">Product</th>
              <th className="text-left py-3 px-2">Price</th>
              <th className="text-left py-3 px-2">Stock</th>
              <th className="text-left py-3 px-2">Status</th>
              <th className="text-right py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-8 text-center text-muted">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-muted">No products found.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-charcoal/50">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 shrink-0 bg-charcoal">
                        {p.images?.[0] && (
                          <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted mt-0.5">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">{formatPrice(p.price)}</td>
                  <td className="py-3 px-2">
                    <span className={p.stock === 0 ? "text-red-400" : p.stock < 5 ? "text-yellow-400" : ""}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => togglePublished(p)}
                        className={`text-[10px] px-1.5 py-0.5 border rounded tracking-wider uppercase transition-colors ${
                          p.published
                            ? "border-border text-chrome hover:text-offwhite"
                            : "border-red-400/50 text-red-400"
                        }`}
                      >
                        {p.published ? "Published" : "Unpublished"}
                      </button>
                      {p.featured && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-charcoal border border-border rounded tracking-wider uppercase">
                          Featured
                        </span>
                      )}
                      {p.isNew && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-charcoal border border-border rounded tracking-wider uppercase">
                          New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button onClick={() => startEdit(p)}
                      className="text-xs text-chrome hover:text-offwhite transition-colors tracking-wider uppercase mr-3">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors tracking-wider uppercase">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
