import { MessageCircle, ArrowUpLeft } from 'lucide-react';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { REGIONAL_CHANNELS } from '../data/perfumes';
import { BelindLogo } from './BelindLogo';

const EASE_LUXURY: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STORY_PILLARS = [
  {
    index: '٠١.',
    title: 'نقاء في التركيبة وتركيز يدوم',
    body: 'تُحضّر عطور :BELIND بتركيز Eau de Parfum لتمنحك ثباتاً متزناً وفوحاناً راقياً يرافقك لساعات طويلة دون إثقال.',
  },
  {
    index: '٠٢.',
    title: 'تفاصيل زجاج وتغليف تحترم الذوق',
    body: 'زجاج ثقيل مصقول بملصقات مزدوجة الإطار، وأغطية خشبية ومعدنية متقنة مع عبوات نيلية فاخرة تليق بالإهداء.',
  },
  {
    index: '٠٣.',
    title: 'من الصفر نحو العالمية',
    body: 'انطلقت دار بلند برؤية واضحة لبناء علامة عطور عربية عالمية قائمة على الصدق والجودة المباشرة مع العملاء.',
  },
];

export function StoryAndOrderSection() {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <>
      {/* Brand Story & Craftsmanship */}
      <section
        id="story"
        className="relative bg-[#26265E] text-white py-20 md:py-28 px-6 md:px-8 overflow-hidden"
      >
        {/* Subtle 4-point star architectural geometry echoing the BELIND Qadar box */}
        <svg
          aria-hidden="true"
          viewBox="0 0 120 120"
          className="pointer-events-none absolute -top-12 -left-12 w-48 h-48 text-white/[0.04]"
          fill="currentColor"
        >
          <path d="M60 0L72 48L120 60L72 72L60 120L48 72L0 60L48 48L60 0Z" />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 120 120"
          className="pointer-events-none absolute -bottom-16 -right-12 w-56 h-56 text-[#C5A46D]/[0.06]"
          fill="currentColor"
        >
          <path d="M60 0L72 48L120 60L72 72L60 120L48 72L0 60L48 48L60 0Z" />
        </svg>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: EASE_LUXURY }}
              className="lg:col-span-6 space-y-6"
            >
              <p className="text-xs font-semibold text-[#E5C990] tracking-wider uppercase">
                قصة دار :BELIND
              </p>

              <h2 className="font-display-ar text-3xl md:text-5xl font-bold leading-snug text-balance">
                «عم أبني براند عطور عالمي من الصفر — بنقاءٍ في النية والتركيبة.»
              </h2>

              <p className="text-indigo-100/90 text-base md:text-lg leading-relaxed">
                في كل زجاجة من{' '}
                <span
                  className="font-brand-latin font-semibold tracking-wider text-[#E5C990]"
                  dir="ltr"
                >
                  :BELIND
                </span>{' '}
                قصة مكان وذكرى؛ من انتعاش الليمون والنعناع في{' '}
                <strong className="font-semibold text-white">شام</strong>، إلى إشراقة المانجو والعنبر في{' '}
                <strong className="font-semibold text-white">قدر</strong>، ودفء القرفة والفانيليا في{' '}
                <strong className="font-semibold text-white">شمس</strong>، وصولاً إلى فخامة{' '}
                <strong className="font-semibold text-white">قمرين</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/15">
                {STORY_PILLARS.map((pillar, idx) => (
                  <motion.div
                    key={pillar.index}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.1 + idx * 0.08,
                      ease: EASE_LUXURY,
                    }}
                    className="space-y-2"
                  >
                    <p className="text-xs font-semibold text-[#E5C990] tabular-nums">
                      {pillar.index}
                    </p>
                    <h3 className="text-sm font-semibold text-white">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-indigo-100/80 leading-relaxed">
                      {pillar.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: EASE_LUXURY }}
              className="lg:col-span-6"
            >
              <div ref={imgRef} className="relative glass-dark rounded-t-[7.5rem] sm:rounded-t-[10rem] rounded-b-2xl p-4 md:p-5">
                <div className="aspect-square w-full overflow-hidden rounded-t-[6.8rem] sm:rounded-t-[9.2rem] rounded-b-xl bg-stone-900">
                  <motion.img
                    style={{ y: imgY }}
                    loading="lazy"
                    decoding="async"
                    width={720}
                    height={720}
                    src="/assets/qamarain-2.webp"
                    alt="عطر قمرين من :BELIND في إضاءة معمارية دافئة"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-[50%_45%] scale-[1.15]"
                  />
                </div>
                <div className="pt-4 px-2 flex items-center justify-between text-xs text-indigo-100">
                  <span>إصدار قمرين — الفخامة والأناقة</span>
                  <span
                    className="font-brand-latin tracking-widest uppercase text-[#E5C990]"
                    dir="ltr"
                  >
                    @belind.perfume
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Regional Direct WhatsApp Order Channels */}
      <section
        id="order"
        className="py-20 md:py-24 px-6 md:px-8 bg-[#F3EDE3] border-t border-stone-200"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: EASE_LUXURY }}
            className="max-w-2xl mb-12 space-y-3"
          >
            <p className="text-xs font-semibold text-[#8C6D3B] tracking-wider uppercase">
              خدمة العملاء والطلب المباشر
            </p>
            <h2 className="font-display-ar text-3xl md:text-4xl font-bold text-[#1C1917] text-balance">
              قنوات الطلب والتوصيل المعتمدة حسب منطقتك
            </h2>
            <p className="text-sm md:text-base text-stone-600">
              يمكنك إتمام الطلب مباشرة عبر حقيبة الموقع أو التواصل الفوري مع فريق خدمة العملاء في بلدك عبر واتساب الرسمي.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REGIONAL_CHANNELS.map((channel, idx) => (
              <motion.a
                key={channel.id}
                href={channel.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.06,
                  ease: EASE_LUXURY,
                }}
                                className="group glass lift rounded-3xl p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-stone-500">
                      توصيل خلال {channel.deliveryEta}
                    </span>
                    <ArrowUpLeft
                      className="w-4 h-4 text-stone-400 group-hover:text-[#26265E] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">
                    {channel.region}
                  </h3>
                  <p className="text-xs text-stone-600">{channel.countryNote}</p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span
                    className="text-xs font-medium text-[#26265E] tabular-nums"
                    dir="ltr"
                  >
                    {channel.phoneDisplay}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 group-hover:text-[#26265E] transition-colors">
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>واتساب</span>
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="bg-[#FAF7F2] border-t border-stone-200 py-10 px-6 md:px-8 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-stone-600">
          <div className="flex items-center gap-3 text-stone-900">
            <BelindLogo className="w-9 h-9" />
            <span
              className="font-brand-latin text-lg font-semibold tracking-[0.14em] uppercase"
              dir="ltr"
            >
              :BELIND
            </span>
            <span className="text-stone-400" aria-hidden="true">
              ·
            </span>
            <span className="text-sm font-medium">عطور بلند</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#hero" className="hover:text-[#26265E] transition-colors">
              الرئيسية
            </a>
            <a href="#collection" className="hover:text-[#26265E] transition-colors">
              المجموعة
            </a>
            <a href="#story" className="hover:text-[#26265E] transition-colors">
              قصتنا
            </a>
            <a href="#order" className="hover:text-[#26265E] transition-colors">
              الطلب والتوصيل
            </a>
          </div>

          <p className="text-xs text-stone-500" dir="ltr">
            <a href="https://www.instagram.com/belind.perfume" target="_blank" rel="noopener noreferrer" className="hover:text-[#26265E]">@belind.perfume</a>
          </p>
        </div>
      </footer>
    </>
  );
}
