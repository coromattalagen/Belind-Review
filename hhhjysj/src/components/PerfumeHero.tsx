import { useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { PERFUMES, type PerfumeItem } from '../data/perfumes';

interface PerfumeHeroProps {
  onSelectPerfume: (perfume: PerfumeItem) => void;
  onAddToCart: (perfume: PerfumeItem) => void;
}

const EASE_LUXURY: [number, number, number, number] = [0.16, 1, 0.3, 1];

const INGREDIENT_RIBBON = [
  'الليمون المنعش',
  'المانجو الاستوائي',
  'الياسمين الأبيض',
  'العنبر الذهبي',
  'خشب العود',
  'المسك النقي',
  'حبوب التونكا',
  'القرفة الدافئة',
  'الخزامى الجبلي',
  'الفلفل الوردي',
];

export function PerfumeHero({ onSelectPerfume, onAddToCart }: PerfumeHeroProps) {
  const [featuredId, setFeaturedId] = useState<string>('legend-trio');

  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

  const featured =
    PERFUMES.find((item) => item.id === featuredId) ?? PERFUMES[PERFUMES.length - 1];

  return (
    <section
      id="hero"
      className="relative bg-[#FAF7F2] border-b border-stone-200/80 overflow-hidden"
    >
      {/* Ambient radial light */}
      <div aria-hidden="true" className="anim-orb pointer-events-none absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-[#B89352]/15 blur-3xl" />
      <div aria-hidden="true" className="anim-orb pointer-events-none absolute -bottom-32 right-0 w-[460px] h-[460px] rounded-full bg-[#26265E]/10 blur-3xl [animation-delay:-6s]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Editorial Copy Column */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE_LUXURY }}
              className="space-y-6"
            >
              <p className="text-xs md:text-sm font-medium text-[#8C6D3B] tracking-wide">
                دار عطور بلند · إصدارات نقية بتركيز Eau de Parfum
              </p>

              <h1 className="font-display-ar text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[#1C1917] leading-[1.2] text-balance">
                عطورٌ تُصنع بصدق،{' '}
                <span className="text-gold-shimmer">وتُروى كأثرٍ لا يُنسى.</span>
              </h1>

              <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-xl">
                من قلب الشغف ببناء دار عطور عالمية من الصفر، نقدم في{' '}
                <span className="font-brand-latin font-semibold text-stone-900" dir="ltr">
                  :BELIND
                </span>{' '}
                توليفات أصلية متوازنة بين الانتعاش الشرقي ودفء العنبر والعود في زجاجات مصقولة سعة ٥٠ مل.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <motion.a
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  href="#collection"
                  className="btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#26265E] hover:bg-[#1c1c48] text-white text-sm md:text-base font-medium transition-colors whitespace-nowrap shrink-0 shadow-sm"
                >
                  <span>تصفح المجموعة الكاملة</span>
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                </motion.a>

                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAddToCart(featured)}
                  className="px-6 py-3 rounded-full glass hover:bg-white text-stone-900 text-sm md:text-base font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 border border-[#C5A46D]/30"
                >
                  أضف {featured.arabicName} للحقيبة ·{' '}
                  <span className="tabular-nums">${featured.priceUsd}</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Interactive Signature Switcher */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: EASE_LUXURY }}
              className="mt-10 pt-8 border-t border-stone-200/90"
            >
              <p className="text-xs font-medium text-stone-500 mb-3">
                معاينة الإصدارات المميزة
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {PERFUMES.map((perfume) => {
                  const isActive = perfume.id === featured.id;
                  return (
                    <button
                      key={perfume.id}
                      type="button"
                      onClick={() => setFeaturedId(perfume.id)}
                      className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'text-[#26265E]'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="hero-selector-bg"
                          transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                          className="absolute inset-0 rounded-lg bg-white border border-[#B89352]/60 shadow-xs"
                        />
                      )}
                      <span className="relative z-10">{perfume.arabicName}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Arched Visual Showcase Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE_LUXURY }}
            className="lg:col-span-6 flex flex-col"
          >
            <div ref={stageRef} className="relative glass rounded-t-[7.5rem] sm:rounded-t-[10rem] rounded-b-3xl p-4 md:p-6 h-full flex flex-col justify-between">
              {/* Subtle champagne gold hairline arch */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2.5 rounded-t-[7rem] sm:rounded-t-[9.4rem] rounded-b-xl border border-[#C5A46D]/25"
              />

              <button
                type="button"
                onClick={() => onSelectPerfume(featured)}
                className="group relative w-full aspect-square overflow-hidden rounded-t-[6.8rem] sm:rounded-t-[9.2rem] rounded-b-xl bg-[#F3EDE3] cursor-pointer block text-right"
                aria-label={`عرض تفاصيل ${featured.arabicName}`}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={featured.id}
                    src={featured.image}
                    alt={`عطر ${featured.arabicName} من دار بلند`}
                    referrerPolicy="no-referrer"
                    width={720}
                    height={720}
                    fetchPriority="high"
                    decoding="async"
                    style={{ y: imgY, scale: 1.1 }}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.42, ease: EASE_LUXURY }}
                    className={`w-full h-full ${featured.cropClass} transition-transform duration-500 group-hover:scale-[1.03]`}
                  />
                </AnimatePresence>

                <div aria-hidden="true" className="anim-float glass absolute top-[18%] right-3 sm:right-5 rounded-2xl px-3 py-2 text-[11px] font-semibold text-stone-800">
                  Eau de Parfum
                </div>
                <div aria-hidden="true" className="anim-float-slow glass absolute bottom-[22%] left-3 sm:left-5 rounded-2xl px-3 py-2 text-[11px] font-semibold text-[#26265E]">
                  {featured.volumeLabel.split('·')[0]}
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-stone-950/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <div className="pt-5 px-2 flex items-center justify-between gap-4 relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featured.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: EASE_LUXURY }}
                  >
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span
                        className="font-brand-latin tracking-wider uppercase text-[#8C6D3B] font-semibold"
                        dir="ltr"
                      >
                        {featured.latinName}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{featured.volumeLabel}</span>
                    </div>
                    <h2 className="font-display-ar text-2xl font-bold text-stone-900 mt-0.5">
                      {featured.arabicName}
                    </h2>
                    <p className="text-sm text-stone-600">{featured.tagline}</p>
                  </motion.div>
                </AnimatePresence>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onSelectPerfume(featured)}
                  className="px-4 py-2 rounded-full border border-stone-300 hover:border-[#26265E] text-sm font-medium text-stone-800 hover:text-[#26265E] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  النوتات والتفاصيل
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subtle Raw Ingredients Atelier Marquee */}
      <div className="marquee-pause border-t border-white/60 glass py-3.5 overflow-hidden select-none" role="presentation">
        <div dir="ltr" className="animate-belind-marquee items-center text-xs md:text-sm text-stone-600 font-medium">
          <div className="flex items-center gap-8 px-4 shrink-0">
            {INGREDIENT_RIBBON.map((note) => (
              <span key={`a-${note}`} className="inline-flex items-center gap-8 whitespace-nowrap">
                <span>{note}</span>
                <span aria-hidden="true" className="text-[#B89352]">
                  ✦
                </span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-8 px-4 shrink-0" aria-hidden="true">
            {INGREDIENT_RIBBON.map((note) => (
              <span key={`b-${note}`} className="inline-flex items-center gap-8 whitespace-nowrap">
                <span>{note}</span>
                <span className="text-[#B89352]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
