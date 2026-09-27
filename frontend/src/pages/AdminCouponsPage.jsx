import { useEffect, useState } from "react";
import api from "../services/api";
import { formatCurrency } from "../utils/catalog";

const empty = { code: "", title: "", description: "", discountType: "PERCENT", value: "", minOrderAmount: 0, maxDiscountAmount: 0, usageLimit: 0, startsAt: "", expiresAt: "", active: true };
const dateValue = (date) => date ? new Date(date).toISOString().slice(0, 16) : "";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]); const [form, setForm] = useState(empty); const [editing, setEditing] = useState(""); const [error, setError] = useState("");
  const load = () => api.get("/admin/coupons").then(({ data }) => setCoupons(data));
  useEffect(() => { load().catch(() => setError("Unable to load coupons.")); }, []);
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const edit = (coupon) => { setEditing(coupon._id); setForm({ ...coupon, startsAt: dateValue(coupon.startsAt), expiresAt: dateValue(coupon.expiresAt) }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const submit = async (event) => { event.preventDefault(); setError(""); const data = { ...form, startsAt: form.startsAt || null, expiresAt: form.expiresAt || null };
    try { if (editing) await api.put(`/admin/coupons/${editing}`, data); else await api.post("/admin/coupons", data); setForm(empty); setEditing(""); await load(); } catch (e) { setError(e.response?.data?.message || "Unable to save coupon."); }
  };
  const remove = async (id) => { if (!window.confirm("Delete this coupon?")) return; try { await api.delete(`/admin/coupons/${id}`); await load(); } catch { setError("Unable to delete coupon."); } };
  const toggle = async (coupon) => { try { await api.put(`/admin/coupons/${coupon._id}`, { ...coupon, active: !coupon.active }); await load(); } catch { setError("Unable to update coupon."); } };
  return <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8"><header className="mb-8"><p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-700">Promotions</p><h1 className="mt-2 text-3xl font-black text-stone-900">Coupon Management</h1></header>
    <form onSubmit={submit} className="grid gap-4 rounded-3xl border border-stone-100 bg-white p-6 shadow-xl sm:grid-cols-2 lg:grid-cols-3">
      <input required placeholder="Coupon code" value={form.code} onChange={(e) => update("code", e.target.value.toUpperCase())} className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium" />
      <input required placeholder="Title" value={form.title} onChange={(e) => update("title", e.target.value)} className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium" />
      <select value={form.discountType} onChange={(e) => update("discountType", e.target.value)} className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium"><option value="PERCENT">Percentage (%)</option><option value="FLAT">Fixed amount (â‚¹)</option></select>
      <input required type="number" min="0.01" step="0.01" placeholder="Discount value" value={form.value} onChange={(e) => update("value", e.target.value)} className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium" />
      <input type="number" min="0" placeholder="Minimum order value (â‚¹)" value={form.minOrderAmount} onChange={(e) => update("minOrderAmount", e.target.value)} className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium" />
      {form.discountType === "PERCENT" && <input type="number" min="0" placeholder="Maximum discount (â‚¹), 0 = none" value={form.maxDiscountAmount} onChange={(e) => update("maxDiscountAmount", e.target.value)} className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium" />}
      <input type="number" min="0" placeholder="Usage limit, 0 = unlimited" value={form.usageLimit} onChange={(e) => update("usageLimit", e.target.value)} className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium" />
      <label className="text-xs font-bold text-stone-500">Starts at<input type="datetime-local" value={form.startsAt} onChange={(e) => update("startsAt", e.target.value)} className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium" /></label>
      <label className="text-xs font-bold text-stone-500">Expires at<input type="datetime-local" value={form.expiresAt} onChange={(e) => update("expiresAt", e.target.value)} className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium" /></label>
      <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.active} onChange={(e) => update("active", e.target.checked)} />Active</label>
      <div className="flex gap-2"><button className="btn-primary px-6">{editing ? "Save Changes" : "Create Coupon"}</button>{editing && <button type="button" onClick={() => { setEditing(""); setForm(empty); }} className="btn-secondary px-5">Cancel</button>}</div>
      {error && <p className="text-sm font-bold text-red-600 sm:col-span-2 lg:col-span-3">{error}</p>}
    </form>
    <section className="mt-8 space-y-3">{coupons.map((coupon) => <article key={coupon._id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-100 bg-white p-5"><div><p className="font-black text-stone-900">{coupon.code} <span className="ml-2 text-xs font-bold text-stone-500">{coupon.discountType === "PERCENT" ? `${coupon.value}%` : formatCurrency(coupon.value)}</span></p><p className="mt-1 text-xs text-stone-500">{coupon.title} Â· Min {formatCurrency(coupon.minOrderAmount)} Â· Uses {coupon.usageCount}/{coupon.usageLimit || "âˆž"}</p></div><div className="flex items-center gap-2"><button onClick={() => toggle(coupon)} className="btn-secondary px-4 py-2 text-xs">{coupon.active ? "Deactivate" : "Activate"}</button><button onClick={() => edit(coupon)} className="btn-secondary px-4 py-2 text-xs">Edit</button><button onClick={() => remove(coupon._id)} className="rounded-lg px-4 py-2 text-xs font-bold text-red-600">Delete</button></div></article>)}</section>
  </main>;
}
