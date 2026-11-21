import { useState, useRef, type FormEvent } from 'react';
import { useDialog } from '../hooks/useDialog';
import {
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { REGIONAL_CHANNELS, type PerfumeItem } from '../data/perfumes';

export interface CartEntry {
  perfume: PerfumeItem;
  quantity: number;
}

interface CartDrawerProps {
  items: CartEntry[];
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

type DrawerStep = 'items' | 'checkout' | 'confirmed';

const EASE_LUXURY: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function CartDrawer({
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [step, setStep] = useState<DrawerStep>('items');
  const [regionId, setRegionId] = useState(REGIONAL_CHANNELS[0].id);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderCode: string;
    total: number;
    whatsappLink: string;
    regionLabel: string;
  } | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(dialogRef, onClose);
  const [website, setWebsite] = useState(''); // honeypot: real users never fill this

  const totalUnits = items.reduce((sum, entry) => sum + entry.quantity, 0);
  const subtotal = items.reduce(
    (sum, entry) => sum + entry.perfume.priceUsd * entry.quantity,
    0
  );
  const freeShippingThreshold = 90;
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 8;
  const total = subtotal + shippingCost;

  const selectedRegion =
    REGIONAL_CHANNELS.find((r) => r.id === regionId) ?? REGIONAL_CHANNELS[0];

  const clean = (v: string, max: number) =>
    v.replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

  const handleCheckout = (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || website) return;

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setError('يرجى استكمال الاسم ورقم التواصل وعنوان التسليم.');
      return;
    }

    if (customerPhone.replace(/\D/g, '').length < 7) {
      setError('رقم الهاتف غير مكتمل؛ يرجى التحقق قبل التأكيد.');
      return;
    }

    setError(null);
    const orderCode = `BLD-${(crypto.getRandomValues(new Uint32Array(1))[0] % 9000) + 1000}`;
    const lines = items
      .map(
        (entry) =>
          `- ${entry.perfume.arabicName} (${entry.quantity}x) = $${
            entry.perfume.priceUsd * entry.quantity
          }`
      )
      .join('\n');
    const message = encodeURIComponent(
      `طلب جديد من متجر :BELIND\nرقم الطلب: ${orderCode}\nالاسم: ${clean(customerName, 60)}\nالهاتف: ${clean(customerPhone, 25)}\nالعنوان: ${clean(customerAddress, 160)}\nالمنتجات:\n${lines}\nالإجمالي: $${total}`
    );

    setConfirmedOrder({
      orderCode,
      total,
      whatsappLink: `${selectedRegion.whatsappUrl}?text=${message}`,
      regionLabel: selectedRegion.region,
    });
    setStep('confirmed');
  };

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="حقيبة التسوق"
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex justify-end bg-stone-950/55 backdrop-blur-md"
    >
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.34, ease: EASE_LUXURY }}
        className="w-full max-w-md bg-[#FAF7F2]/95 backdrop-blur-xl h-full shadow-2xl border-r border-white/60 flex flex-col overflow-hidden"
      >
        {/* Sleek Frosted Header */}
        <div className="px-6 py-5 bg-white/85 backdrop-blur-md border-b border-stone-200/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display-ar text-2xl font-bold text-stone-900">
                {step === 'checkout'
                  ? 'بيانات التوصيل'
                  : step === 'confirmed'
                  ? 'تأكيد الطلب'
                  : 'حقيبة الاقتناء'}
              </h2>
              {step === 'items' && totalUnits > 0 && (
                <span className="text-xs font-medium text-stone-500 tabular-nums">
                  · {totalUnits} {totalUnits === 1 ? 'قطعة' : 'قطع'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              دار :BELIND · شحن مباشر ومغلف للهدايا
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق الحقيبة"
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Free Shipping Progress Strip */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="px-6 py-3 bg-[#F3EDE3]/80 border-b border-stone-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-700 font-medium">
                {remainingForFree === 0
                  ? 'أنت مؤهّل للشحن المجاني المباشر'
                  : `أضف بقيمة $${remainingForFree} للحصول على شحن مجاني`}
              </span>
              <span className="tabular-nums font-semibold text-[#26265E]">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-stone-200/90 overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: EASE_LUXURY }}
                className="h-full rounded-full bg-gradient-to-l from-[#26265E] to-[#B89352]"
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {step === 'confirmed' && confirmedOrder ? (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE_LUXURY }}
                className="relative bg-white/90 border border-[#C5A46D]/45 rounded-3xl p-6 space-y-5 shadow-[0_18px_40px_-15px_rgba(38,38,94,0.14)]"
              >
                <div className="flex items-center justify-between">
                  <CheckCircle2 className="w-9 h-9 text-[#26265E]" aria-hidden="true" />
                  <span className="text-xs font-semibold text-[#8C6D3B] tabular-nums">
                    {confirmedOrder.orderCode}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display-ar text-2xl font-bold text-stone-900">
                    طلبك جاهز للإرسال
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    أكمل إرسال طلبك إلى فريق{' '}
                    <strong className="font-semibold text-stone-900">
                      {confirmedOrder.regionLabel}
                    </strong>{' '}
                    بإجمالي{' '}
                    <span className="font-semibold text-[#26265E] tabular-nums">
                      ${confirmedOrder.total}
                    </span>
                    .
                  </p>
                </div>

                <div className="pt-2 space-y-2.5">
                  <a
                    href={confirmedOrder.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClearCart}
                    className="btn-shine w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#26265E] hover:bg-[#1c1c48] text-white text-sm font-medium transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>تأكيد الشحن عبر واتساب ({confirmedOrder.regionLabel})</span>
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 rounded-full border border-stone-300 text-stone-700 text-sm font-medium hover:border-stone-500 transition-colors cursor-pointer"
                  >
                    العودة إلى الدار
                  </button>
                </div>
              </motion.div>
            ) : items.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-20 text-center space-y-4"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-[#26265E] shadow-xs">
                  <ShoppingBag className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="space-y-1.5">
                  <p className="font-display-ar text-2xl font-bold text-stone-900">
                    لا توجد اختيارات في الحقيبة
                  </p>
                  <p className="text-sm text-stone-600 max-w-xs mx-auto">
                    أضف أياً من إصدارات قدر، شام، شمس، أو قمرين للمتابعة.
                  </p>
                </div>
              </motion.div>
            ) : step === 'items' ? (
              <motion.div
                key="items"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.24, ease: EASE_LUXURY }}
                className="space-y-3.5"
              >
                <AnimatePresence initial={false}>
                  {items.map(({ perfume, quantity }) => (
                    <motion.div
                      layout
                      key={perfume.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.22, ease: EASE_LUXURY }}
                      className="relative bg-white/85 border border-white/90 ring-1 ring-stone-200/80 rounded-2xl p-3.5 flex items-center gap-4 shadow-[0_10px_28px_-14px_rgba(28,25,23,0.12),inset_0_1px_0_rgba(255,255,255,0.95)]"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F3EDE3] shrink-0 border border-stone-100">
                        <img
                          src={perfume.image}
                          alt={perfume.arabicName}
                          referrerPolicy="no-referrer"
                          className={`w-full h-full ${perfume.cropClass}`}
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-display-ar text-xl font-bold text-stone-900 truncate leading-tight">
                              {perfume.arabicName}
                            </h3>
                            <p className="text-[11px] text-stone-500">
                              {perfume.categoryLabel} · {perfume.volumeLabel}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(perfume.id)}
                            aria-label={`حذف ${perfume.arabicName}`}
                            className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="pt-1.5 flex items-center justify-between">
                          <div className="inline-flex items-center bg-[#FAF7F2] border border-stone-200/90 rounded-full px-1.5 py-0.5">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(perfume.id, -1)}
                              aria-label="تقليل"
                              className="p-1 text-stone-600 hover:text-stone-950 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" aria-hidden="true" />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold tabular-nums">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(perfume.id, 1)}
                              aria-label="زيادة"
                              className="p-1 text-stone-600 hover:text-stone-950 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" aria-hidden="true" />
                            </button>
                          </div>

                          <span className="text-base font-semibold text-[#26265E] tabular-nums">
                            ${perfume.priceUsd * quantity}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.form
                key="checkout"
                id="checkout-form"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.24, ease: EASE_LUXURY }}
                onSubmit={handleCheckout}
                className="space-y-5"
                noValidate
              >
                <button
                  type="button"
                  onClick={() => setStep('items')}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-[#26265E] transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>العودة لمراجعة القطع ({totalUnits})</span>
                </button>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-stone-700">
                    اختر وجهة الشحن
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {REGIONAL_CHANNELS.map((ch) => {
                      const active = ch.id === regionId;
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => setRegionId(ch.id)}
                          className={`text-right p-3 rounded-xl border transition-all cursor-pointer ${
                            active
                              ? 'bg-white border-[#26265E] ring-1 ring-[#26265E]/20 shadow-xs'
                              : 'bg-white/60 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <p className="text-sm font-bold text-stone-900">
                            {ch.region}
                          </p>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {ch.deliveryEta}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white/90 border border-stone-200 rounded-2xl p-4 space-y-3.5">
                  <div>
                    <label
                      htmlFor="customer-name"
                      className="block text-xs font-medium text-stone-700 mb-1"
                    >
                      الاسم الكامل
                    </label>
                    <input
                      id="customer-name"
                      autoComplete="name"
                      maxLength={60}
                      type="text"
                      placeholder="الاسم الثلاثي"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF7F2]/60 text-sm text-stone-900 focus:outline-none focus:border-[#26265E] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="customer-phone"
                      className="block text-xs font-medium text-stone-700 mb-1"
                    >
                      رقم الهاتف / واتساب
                    </label>
                    <input
                      id="customer-phone"
                      autoComplete="tel"
                      maxLength={25}
                      type="tel"
                      dir="ltr"
                      placeholder="+90 555 000 0000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF7F2]/60 text-sm text-stone-900 text-right focus:outline-none focus:border-[#26265E] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="customer-address"
                      className="block text-xs font-medium text-stone-700 mb-1"
                    >
                      المدينة والعنوان التفصيلي
                    </label>
                    <input
                      id="customer-address"
                      autoComplete="street-address"
                      maxLength={160}
                      type="text"
                      placeholder="المدينة، المنطقة، الشارع"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF7F2]/60 text-sm text-stone-900 focus:outline-none focus:border-[#26265E] focus:bg-white transition-colors"
                    />
                  </div>

                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label htmlFor="website">الموقع</label>
                    <input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>

                  {error && (
                    <p role="alert" className="text-xs font-medium text-red-600">
                      {error}
                    </p>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Modern Floating Footer Dock */}
        {items.length > 0 && step !== 'confirmed' && (
          <div className="p-6 bg-white/90 backdrop-blur-md border-t border-stone-200/80 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-stone-600">
                <span>المجموع الفرعي</span>
                <span className="tabular-nums">${subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>رسوم التوصيل</span>
                <span className="tabular-nums">
                  {shippingCost === 0 ? 'مجاني' : `$${shippingCost}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
                <span>الإجمالي النهائي</span>
                <span className="text-lg text-[#26265E] tabular-nums">${total}</span>
              </div>
            </div>

            {step === 'items' ? (
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('checkout')}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#26265E] hover:bg-[#1c1c48] text-white text-sm font-medium transition-colors cursor-pointer shadow-sm"
              >
                <span>المتابعة إلى بيانات الشحن</span>
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                form="checkout-form"
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-full bg-[#26265E] hover:bg-[#1c1c48] text-white text-sm font-medium transition-colors cursor-pointer shadow-sm"
              >
                تأكيد وإرسال الطلب · <span className="tabular-nums">${total}</span>
              </motion.button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
