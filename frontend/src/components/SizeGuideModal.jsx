import { motion, AnimatePresence } from "framer-motion";

const SIZE_CHART = [
  { size: "XS", bust: '32" / 81 cm', waist: '26" / 66 cm', hip: '34" / 86 cm', length: '42" / 107 cm' },
  { size: "S", bust: '34" / 86 cm', waist: '28" / 71 cm', hip: '36" / 91 cm', length: '42" / 107 cm' },
  { size: "M", bust: '36" / 91 cm', waist: '30" / 76 cm', hip: '38" / 96 cm', length: '43" / 109 cm' },
  { size: "L", bust: '38" / 96 cm', waist: '32" / 81 cm', hip: '40" / 101 cm', length: '43" / 109 cm' },
  { size: "XL", bust: '40" / 101 cm', waist: '34" / 86 cm', hip: '42" / 107 cm', length: '44" / 112 cm' },
  { size: "XXL", bust: '42" / 107 cm', waist: '36" / 91 cm', hip: '44" / 112 cm', length: '44" / 112 cm' },
  { size: "3XL", bust: '44" / 112 cm', waist: '38" / 96 cm', hip: '46" / 117 cm', length: '45" / 114 cm' },
];

export default function SizeGuideModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 px-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-700">Measurement Chart</p>
                <h2 className="text-xl font-black text-stone-900 sm:text-2xl">Standard Size Guide</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                aria-label="Close size guide"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="mt-3 text-xs text-stone-500">
              All garment measurements are listed in both inches and centimeters. For the best fit, please measure yourself and compare with the table below.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-[10px] font-black uppercase tracking-widest text-stone-500">
                  <tr>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Bust</th>
                    <th className="px-4 py-3">Waist</th>
                    <th className="px-4 py-3">Hip</th>
                    <th className="px-4 py-3">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                  {SIZE_CHART.map((row) => (
                    <tr key={row.size} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-4 py-3 font-black text-stone-900">{row.size}</td>
                      <td className="px-4 py-3">{row.bust}</td>
                      <td className="px-4 py-3">{row.waist}</td>
                      <td className="px-4 py-3">{row.hip}</td>
                      <td className="px-4 py-3">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 rounded-2xl bg-stone-50 p-4">
              <p className="text-xs font-bold text-stone-700">How to Measure:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-stone-500">
                <li><strong>Bust:</strong> Measure around the fullest part of your chest.</li>
                <li><strong>Waist:</strong> Measure around your natural waistline.</li>
                <li><strong>Hip:</strong> Measure around the fullest part of your hips.</li>
                <li><strong>Length:</strong> Measured from shoulder to hemline.</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

