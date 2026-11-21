import { useState, useRef } from 'react';
import { useDialog } from '../hooks/useDialog';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { PerfumeItem } from '../data/perfumes';

interface PerfumeDetailModalProps {
  perfume: PerfumeItem;
  onClose: () => void;
  onAddToCart: (perfume: PerfumeItem, quantity: number) => void;
}

const EASE_LUXURY: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function PerfumeDetailModal({
  perfume,
  onClose,
  onAddToCart,
}: PerfumeDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [showSecondary, setShowSecondary] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(dialogRef, onClose);

  const activeImage =
    showSecondary && perfume.secondaryImage ? perfume.secondaryImage : perfume.image;
  const activeCrop =
    showSecondary && perfume.secondaryCropClass
      ? perfume.secondaryCropClass
      : perfume.cropClass;

  const handleAdd = () => {
    onAddToCart(perfume, quantity);
    onClose();
  };

  const pyramidLayers = [
    { label: 'الافتتاحية', notes: perfume.topNotes.join(' · '), delay: 0.08 },
    { label: 'قلب العطر', notes: perfume.heartNotes.join(' · '), delay: 0.14 },
    { label: 'القاعدة', notes: perfume.baseNotes.join(' · '), delay: 0.2 },
  ];

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md overflow-y-auto overscroll-contain"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.32, ease: EASE_LUXURY }}
        className="relative w-full max-w-4xl bg-[#FAF7F2]/95 rounded-3xl border border-white/70 shadow-2xl overflow-hidden my-auto"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق نافذة تفاصيل العطر"
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-stone-800 border border-stone-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          {/* Gallery Column */}
          <div className="md:col-span-6 bg-white p-6 flex flex-col justify-between border-b md:border-b-0 md:border-l border-stone-200">
            <div className="w-full aspect-square overflow-hidden rounded-xl bg-[#F3EDE3] relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={`صورة عطر ${perfume.arabicName}`}
                  referrerPolicy="no-referrer"
                  width={720}
                  height={720}
                  decoding="async"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE_LUXURY }}
                  className={`w-full h-full ${activeCrop}`}
                />
              </AnimatePresence>
            </div>

            {perfume.secondaryImage && (
              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowSecondary(false)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    !showSecondary
                      ? 'border-[#26265E] bg-[#26265E]/5 text-[#26265E]'
                      : 'border-stone-200 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  الزجاجة الرئيسية
                </button>
                <button
                  type="button"
                  onClick={() => setShowSecondary(true)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    showSecondary
                      ? 'border-[#26265E] bg-[#26265E]/5 text-[#26265E]'
                      : 'border-stone-200 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  المكونات والأجواء
                </button>
              </div>
            )}
          </div>

          {/* Contiguous Purchase & Olfactory Pyramid Column */}
          <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>{perfume.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{perfume.concentration}</span>
                <span aria-hidden="true">·</span>
                <span>{perfume.volumeLabel}</span>
              </div>

              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <h2
                    id="pdp-title"
                    className="font-display-ar text-3xl font-bold text-stone-900"
                  >
                    {perfume.arabicName}
                  </h2>
                  <p className="text-sm text-[#8C6D3B] font-medium mt-0.5">
                    {perfume.tagline}
                  </p>
                </div>
                <span className="text-2xl font-semibold text-[#26265E] tabular-nums">
                  ${perfume.priceUsd}
                </span>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed">
                {perfume.description}
              </p>

              {/* Animated Olfactory Pyramid */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  الهرم العطري والمكونات
                </p>

                <div className="space-y-2.5 text-sm">
                  {pyramidLayers.map((layer) => (
                    <motion.div
                      key={layer.label}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: layer.delay,
                        ease: EASE_LUXURY,
                      }}
                      className="flex items-baseline justify-between gap-4 py-2 border-b border-stone-200/70 last:border-b-0"
                    >
                      <span className="font-semibold text-stone-800 shrink-0">
                        {layer.label}
                      </span>
                      <span className="text-stone-600 text-left">
                        {layer.notes}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-stone-500 pt-1">
                الطابع العام: {perfume.mood}
              </p>
            </div>

            {/* Purchase Controls */}
            <div className="pt-4 border-t border-stone-200 flex items-center gap-3">
              <div className="inline-flex items-center border border-stone-300 rounded-full bg-white px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="تقليل الكمية"
                  className="p-1.5 text-stone-700 hover:text-stone-950 cursor-pointer"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="w-8 text-center text-sm font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  aria-label="زيادة الكمية"
                  className="p-1.5 text-stone-700 hover:text-stone-950 cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={handleAdd}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#26265E] hover:bg-[#1c1c48] text-white text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                <span>
                  أضف للحقيبة ·{' '}
                  <span className="tabular-nums">${perfume.priceUsd * quantity}</span>
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
