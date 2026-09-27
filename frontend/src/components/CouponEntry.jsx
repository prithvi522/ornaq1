import { useEffect, useState } from "react";
import api, { getApiErrorMessage } from "../services/api";
import { formatCurrency } from "../utils/catalog";

const KEY = "ornaq_coupon_code";
export const getStoredCoupon = () => localStorage.getItem(KEY) || "";
export const storeCoupon = (code) => code ? localStorage.setItem(KEY, code) : localStorage.removeItem(KEY);

export default function CouponEntry({ subtotal, onChange }) {
  const [code, setCode] = useState(getStoredCoupon);
  const [applied, setApplied] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const savedCode = getStoredCoupon();
    if (!savedCode) return;
    let active = true;
    api.post("/coupons/validate", { code: savedCode, subtotal }).then(({ data }) => {
      if (active) { setCode(data.code); setApplied(data); onChange?.(data); }
    }).catch((error) => {
      if (active) { storeCoupon(""); setApplied(null); onChange?.(null); setMessage(getApiErrorMessage(error, "Unable to apply coupon.")); }
    });
    return () => { active = false; };
  }, [subtotal]);
  const apply = async (event) => {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await api.post("/coupons/validate", { code, subtotal });
      setApplied(response.data); storeCoupon(response.data.code); onChange?.(response.data); setMessage("Coupon applied successfully.");
    } catch (error) { setApplied(null); storeCoupon(""); onChange?.(null); setMessage(getApiErrorMessage(error, "Unable to apply coupon.")); }
    finally { setBusy(false); }
  };
  const remove = () => { setApplied(null); setCode(""); setMessage("Coupon removed."); storeCoupon(""); onChange?.(null); };
  return <div className="mt-6 rounded-2xl border border-stone-100 p-4">
    <p className="text-sm font-bold text-stone-800">Promo Code / Apply Coupon</p>
    {applied ? <div className="mt-3 flex items-center justify-between gap-3 text-sm"><span><b>{applied.code}</b> saves {formatCurrency(applied.discountAmount)}</span><button type="button" onClick={remove} className="font-bold text-red-600">Remove</button></div> : <form onSubmit={apply} className="mt-3 flex gap-2">
      <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter code" className="min-w-0 flex-1 rounded-xl bg-stone-50 px-3 py-3 text-sm font-bold" aria-label="Promo code" />
      <button disabled={busy || !code.trim()} className="rounded-xl bg-stone-900 px-4 text-xs font-black text-white disabled:opacity-50">{busy ? "..." : "Apply"}</button>
    </form>}
    {message && <p className={`mt-2 text-xs font-bold ${message.includes("success") || message.includes("removed") ? "text-emerald-700" : "text-red-600"}`}>{message}</p>}
  </div>;
}
