import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ShoppingBag,
  Eye,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { motion, AnimatePresence, type PanInfo } from 'motion/react';
import {
  CATEGORY_FILTERS,
  PERFUMES,
  type FragranceCategory,
  type PerfumeItem,
} from '../data/perfumes';

interface CollectionSectionProps {
  onSelectPerfume: (perfume: PerfumeItem) => void;
  onAddToCart: (perfume: PerfumeItem) => void;
}

const EASE_LUXURY: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function CollectionSection({
  onSelectPerfume,
  onAddToCart,
}: CollectionSectionProps) {
  const [activeCategory, setActiveCategory] = useState<FragranceCategory>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepSpacing, setStepSpacing] = useState(300);

  const filteredPerfumes =
    activeCategory === 'all'
      ? PERFUMES
      : PERFUMES.filter((item) => item.category === activeCategory);

  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);
  const total = filteredPerfumes.length;
  const safeActiveIndex = total > 0 ? ((activeIndex % total) + total) % total : 0;

  useEffect(() => {
    const updateSpacing = () => {
      if (window.innerWidth < 640) {
        setStepSpacing(175);
      } else if (window.innerWidth < 1024) {
        setStepSpacing(250);
      } else {
        setStepSpacing(315);
      }
    };
    updateSpacing();
    window.addEventListener('resize', updateSpacing);
    return () => window.removeEventListener('resize', updateSpacing);
  }, []);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (paused || total <= 1 || reduced.current) return;
    const id = window.setInterval(() => setActiveIndex((p) => (p + 1) % total), 5200);
    return () => window.clearInterval(id);
  }, [paused, total, activeIndex]);

  const handleCategoryChange = (catId: FragranceCategory) => {
    setActiveCategory(catId);
    setActiveIndex(0);
  };

  const rotateNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const rotatePrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (total <= 1) return;
    // In RTL: swiping right advances to next item, swiping left goes to previous
    if (info.offset.x > 45 || info.velocity.x > 300) {
      rotateNext();
    } else if (info.offset.x < -45 || info.velocity.x < -300) {
      rotatePrev();
    }
  };

  return (
    <section
      id="collection"
      className="relative py-20 md:py-28 px-4 sm:px-6 md:px-8 bg-[#FAF7F2] overflow-hidden"
    >
      {/* Subtle static ambient light for glossy glass depth without runtime cost */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[440px] rounded-full bg-[radial-gradient(circle,rgba(197,164,109,0.16)_0%,rgba(38,38,94,0.06)_48%,transparent_72%)]"
      />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: EASE_LUXURY }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 px-2 md:px-0"
        >
          <div className="space-y-3 max-w-xl">
            <p className="text-xs font-semibold text-[#8C6D3B] tracking-wider uppercase">
              كتالوج :BELIND الدوّار
            </p>
            <h2 className="font-display-ar text-3xl md:text-4xl font-bold text-[#1C1917] text-balance">
              استعرض التوقيعات العطرية في حلقة العرض
            </h2>
            <p className="text-sm md:text-base text-stone-600">
              مرّر أو أدر الرينج لاختيار عطرك ومراجعة نفحاته وإضافته للحقيبة مباشرة.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="تصنيف العطور"
            className="flex flex-wrap items-center gap-1 p-1.5 glass rounded-2xl self-start lg:self-auto"
          >
            {CATEGORY_FILTERS.map((cat) => {
              const isSelected = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`relative px-3.5 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'text-white'
                      : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="collection-active-tab"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-[#26265E] shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 3D Rotating Ring Stage */}
        <div
          className="relative select-none"
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label="دولاب عرض عطور بلند"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') rotateNext();
            if (e.key === 'ArrowRight') rotatePrev();
          }}
        >
          {/* Decorative circular glass ring track behind the cards */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[920px] h-[260px] rounded-[50%] border border-[#C5A46D]/30 shadow-[inset_0_0_60px_rgba(197,164,109,0.12)]"
          />

          <motion.div
            drag={total > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={handleDragEnd}
            style={{ perspective: 1400 }}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="relative h-[535px] sm:h-[555px] flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredPerfumes.map((perfume, index) => {
                let offset = index - safeActiveIndex;
                if (total > 2) {
                  if (offset > total / 2) offset -= total;
                  if (offset < -total / 2) offset += total;
                }

                const absOffset = Math.abs(offset);
                const isCenter = offset === 0;
                // True cylinder: each card sits on a ring and faces outward.
                const theta = (offset * 2 * Math.PI) / Math.max(total, 4);
                const radius = stepSpacing * 1.55;
                const translateX = -Math.sin(theta) * radius;
                const translateZ = (Math.cos(theta) - 1) * radius * 0.9;
                const rotateY = (theta * 180) / Math.PI;
                const depth = (Math.cos(theta) + 1) / 2; // 1 front, 0 back
                const scale = 0.72 + depth * 0.28;
                const opacity = isCenter ? 1 : 0.25 + depth * 0.6;
                const zIndex = Math.round(depth * 30);
                const interactive = depth > 0.45;

                return (
                  <motion.article
                    key={perfume.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{
                      x: translateX,
                      z: translateZ,
                      scale,
                      rotateY,
                      opacity,
                      zIndex,
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      type: 'spring',
                      stiffness: 240,
                      damping: 28,
                      mass: 0.85,
                    }}
                    onClick={() => {
                      if (!isCenter) setActiveIndex(index);
                    }}
                    style={{ transformStyle: 'preserve-3d', pointerEvents: interactive ? 'auto' : 'none' }}
                    aria-hidden={interactive ? undefined : true}
                    className={`absolute w-[295px] sm:w-[345px] md:w-[365px] rounded-3xl p-4 flex flex-col justify-between will-change-transform border ${
                      isCenter
                        ? 'glass ring-1 ring-[#C5A46D]/50'
                        : 'glass ring-1 ring-white/60 cursor-pointer'
                    }`}
                  >
                    {/* Glossy crystal glass diagonal reflection layer */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(128deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.16)_34%,transparent_58%,rgba(255,255,255,0.34)_100%)]"
                    />

                    <div className="relative z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (!isCenter) return;
                          e.stopPropagation();
                          onSelectPerfume(perfume);
                        }}
                        tabIndex={isCenter ? 0 : -1}
                        className="group relative w-full aspect-square overflow-hidden rounded-2xl bg-[#F3EDE3] cursor-pointer block border border-white/70"
                        aria-label={`عرض تفاصيل عطر ${perfume.arabicName}`}
                      >
                        <img
                          src={perfume.image}
                          alt={`عطر ${perfume.arabicName} — ${perfume.latinName}`}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                          width={720}
                          height={720}
                          draggable={false}
                          className={`w-full h-full ${perfume.cropClass} transition-transform duration-500 ease-out ${
                            isCenter ? 'group-hover:scale-[1.05]' : ''
                          }`}
                        />

                        {/* Glossy glass specular gleam sweep on center card */}
                        {isCenter && (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          />
                        )}
                      </button>

                      <div className="pt-4 px-1 space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                          <span>
                            {perfume.categoryLabel} · {perfume.volumeLabel}
                          </span>
                          <span
                            className="font-brand-latin tracking-wider uppercase text-[#8C6D3B] font-semibold"
                            dir="ltr"
                          >
                            {perfume.latinName}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className="font-display-ar text-2xl font-bold text-stone-900">
                            {perfume.arabicName}
                          </h3>
                          <span className="text-lg font-semibold text-[#26265E] tabular-nums">
                            ${perfume.priceUsd}
                          </span>
                        </div>

                        <p className="text-sm text-stone-600 leading-relaxed line-clamp-1">
                          {perfume.tagline}
                        </p>

                        <p className="text-xs text-stone-500 pt-0.5 line-clamp-1">
                          النوتات:{' '}
                          {[
                            ...perfume.topNotes.slice(0, 2),
                            ...perfume.baseNotes.slice(0, 2),
                          ].join(' · ')}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 pt-4 mt-4 border-t border-stone-200/70 flex items-center gap-2.5 px-1">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        tabIndex={isCenter ? 0 : -1}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isCenter) {
                            setActiveIndex(index);
                            return;
                          }
                          onAddToCart(perfume);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#26265E] hover:bg-[#1c1c48] text-white text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                      >
                        <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                        <span>أضف للحقيبة</span>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        tabIndex={isCenter ? 0 : -1}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isCenter) {
                            setActiveIndex(index);
                            return;
                          }
                          onSelectPerfume(perfume);
                        }}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white/85 hover:bg-white border border-stone-200 text-stone-800 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Eye className="w-4 h-4" aria-hidden="true" />
                        <span>المكونات</span>
                      </motion.button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Ring Controls & Quick Perfume Dial */}
          {total > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center justify-center gap-2 sm:gap-3 w-full max-w-full">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={rotatePrev}
                  aria-label="العطر السابق"
                  className="p-2.5 rounded-full bg-white/85 hover:bg-white border border-stone-200 hover:border-[#B89352] text-stone-800 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </motion.button>

                <div className="flex flex-wrap items-center justify-center gap-1 px-2 py-1.5 rounded-2xl sm:rounded-full bg-white/80 border border-stone-200/80 shadow-xs">
                  {filteredPerfumes.map((item, idx) => {
                    const active = idx === safeActiveIndex;
                    const dialLabel =
                      item.id === 'legend-trio' ? 'الأساطير' : item.arabicName;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`الانتقال إلى ${item.arabicName}`}
                        aria-current={active ? 'true' : undefined}
                        className={`relative px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'text-white'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="ring-dial-pill"
                            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                            className="absolute inset-0 rounded-full bg-[#26265E]"
                          />
                        )}
                        <span className="relative z-10">{dialLabel}</span>
                      </button>
                    );
                  })}
                </div>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={rotateNext}
                  aria-label="العطر التالي"
                  className="p-2.5 rounded-full bg-white/85 hover:bg-white border border-stone-200 hover:border-[#B89352] text-stone-800 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
