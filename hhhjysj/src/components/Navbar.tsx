import { useEffect, useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { BelindLogo } from './BelindLogo';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

const NAV_LINKS = [
  { label: 'الرئيسية', href: '#hero' },
  { label: 'المجموعة', href: '#collection' },
  { label: 'قصتنا', href: '#story' },
  { label: 'الطلب والتوصيل', href: '#order' },
];

export function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 240, damping: 32, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 px-3 sm:px-6 pt-3">
      <div
        className={`relative mx-auto max-w-7xl rounded-full glass transition-all duration-500 ${
          scrolled ? 'py-1.5 shadow-lg' : 'py-2.5'
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-3 sm:px-5">
          <a href="#hero" aria-label="بلند — الرئيسية" className="group flex items-center gap-3 shrink-0">
            <BelindLogo className="w-10 h-10 transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-105" />
            <span className="font-brand-latin text-xl font-semibold tracking-[0.14em]" dir="ltr">
              :BELIND
            </span>
          </a>

          <nav aria-label="التنقل الرئيسي" className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative py-1 text-sm font-medium text-stone-700 hover:text-[#26265E] transition-colors after:absolute after:bottom-0 after:right-0 after:h-[1.5px] after:w-0 after:bg-[#B89352] after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={onOpenCart}
              aria-label={`فتح حقيبة التسوق، ${cartCount} قطعة`}
              className="btn-shine inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#26265E] text-white text-sm font-medium cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">الحقيبة</span>
              <motion.span
                key={cartCount}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                className="tabular-nums font-semibold"
              >
                {cartCount}
              </motion.span>
            </motion.button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
              className="md:hidden p-2 rounded-full hover:bg-black/5 cursor-pointer"
            >
              {open ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute bottom-0 inset-x-6 h-[2px] rounded-full bg-gradient-to-l from-[#26265E] via-[#B89352] to-[#26265E] origin-right pointer-events-none"
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="قائمة الجوال"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden mx-auto max-w-7xl mt-2 glass rounded-3xl p-3 flex flex-col"
          >
            {NAV_LINKS.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                className="px-4 py-3 rounded-2xl text-base font-medium text-stone-800 hover:bg-white/70"
              >
                {l.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
