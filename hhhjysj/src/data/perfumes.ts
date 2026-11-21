export type FragranceCategory =
  | 'all'
  | 'fruity-amber'
  | 'citrus-woody'
  | 'warm-spice'
  | 'oriental-luxury'
  | 'gift-set';

export interface PerfumeItem {
  id: string;
  arabicName: string;
  latinName: string;
  tagline: string;
  category: Exclude<FragranceCategory, 'all'>;
  categoryLabel: string;
  priceUsd: number;
  volumeLabel: string;
  concentration: string;
  accentColor: string;
  image: string;
  cropClass: string;
  secondaryImage?: string;
  secondaryCropClass?: string;
  description: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  mood: string;
}

export interface RegionalOrderChannel {
  id: string;
  region: string;
  countryNote: string;
  whatsappUrl: string;
  phoneDisplay: string;
  deliveryEta: string;
}

export const PERFUMES: PerfumeItem[] = [
  {
    id: 'qadar',
    arabicName: 'قَدَر',
    latinName: 'QADAR',
    tagline: 'قَدَر، ليس صدفة.',
    category: 'fruity-amber',
    categoryLabel: 'فواكه وعنبر',
    priceUsd: 48,
    volumeLabel: '50 ml · 1.7 FL.OZ',
    concentration: 'Eau de Parfum',
    accentColor: '#26265E',
    image:
      '/assets/qadar.webp',
    cropClass: 'object-cover object-[50%_49%]',
    secondaryImage:
      '/assets/qadar-2.webp',
    secondaryCropClass: 'object-cover object-[50%_46%]',
    description:
      'توليفة مائية مشرقة تمزج بين انتعاش الليمون وحلاوة المانجو الاستوائية مع قلب من الياسمين الأبيض، تستقر على قاعدة عميقة من العنبر وخشب العود والمسك النقي.',
    topNotes: ['الليمون المنعش', 'المانجو الاستوائي'],
    heartNotes: ['الياسمين الأبيض'],
    baseNotes: ['العنبر', 'خشب العود', 'المسك'],
    mood: 'حضور واثق يجمع بين الانتعاش الصيفي والعمق الشرقي',
  },
  {
    id: 'sham',
    arabicName: 'شَام',
    latinName: 'SHAM',
    tagline: 'انتعاش نقي بلمسة أخشاب دافئة.',
    category: 'citrus-woody',
    categoryLabel: 'حمضيات وأخشاب',
    priceUsd: 46,
    volumeLabel: '50 ml · 1.7 FL.OZ',
    concentration: 'Eau de Parfum',
    accentColor: '#4A5D3F',
    image:
      '/assets/sham.webp',
    cropClass: 'object-cover object-[50%_42%]',
    description:
      'عطر متوازن يستلهم حدائق الشام المنعشة؛ يبدأ بنفحات الليمون والتفاح الأخضر وأوراق النعناع، ويتدرج نحو قلب ناعم من زهر الفانيليا ليستقر على حبوب التونكا الغنية.',
    topNotes: ['الليمون', 'التفاح الأخضر', 'النعناع الطازج'],
    heartNotes: ['زهر الفانيليا', 'الفانيليا'],
    baseNotes: ['حبوب التونكا', 'أخشاب ناعمة'],
    mood: 'نقاء يومي راقٍ يلائم الأوقات الصباحية واللقاءات الرسمية',
  },
  {
    id: 'shams',
    arabicName: 'شَمْس',
    latinName: 'SHAMS',
    tagline: 'دفء العنبر والتوابل الذهبية.',
    category: 'warm-spice',
    categoryLabel: 'توابل دافئة',
    priceUsd: 50,
    volumeLabel: '50 ml · 1.7 FL.OZ',
    concentration: 'Eau de Parfum',
    accentColor: '#9A511D',
    image:
      '/assets/shams.webp',
    cropClass: 'object-cover object-[50%_48%]',
    description:
      'إصدار مسائي دافئ يحتضن الفلفل الوردي والخزامى في افتتاحيته، يمتزج بالقرفة والكراميل الفاخر في القلب، ويترك أثراً ذهبياً من العنبر وقرون الفانيليا وحبوب التونكا.',
    topNotes: ['الفلفل الوردي', 'الخزامى', 'الميرمية'],
    heartNotes: ['القرفة الدافئة', 'الكراميل'],
    baseNotes: ['العنبر الذهبي', 'قرون الفانيليا', 'التونكا'],
    mood: 'فوحان دافئ وجذاب للأمسيات والمناسبات الخاصة',
  },
  {
    id: 'qamarain',
    arabicName: 'قَمَرين',
    latinName: 'QAMARAIN',
    tagline: 'الفخامة والأناقة، قمرين.',
    category: 'oriental-luxury',
    categoryLabel: 'شرقي فاخر',
    priceUsd: 54,
    volumeLabel: '50 ml · 1.7 FL.OZ',
    concentration: 'Eau de Parfum',
    accentColor: '#6B1D2F',
    image:
      '/assets/qamarain.webp',
    cropClass: 'object-cover object-[50%_46%]',
    secondaryImage:
      '/assets/qamarain-2.webp',
    secondaryCropClass: 'object-cover object-[50%_45%] scale-[1.08]',
    description:
      'تحفة :BELIND الشرقية في زجاجة ذهبية بملصق عنابي ملكي؛ يلتقي فيه الخزامى الجبلي المجفف مع العنبر الشرقي المعتّق والعود الفاخر ليمنحك هيبة تدوم طويلاً.',
    topNotes: ['الخزامى المجفف', 'البرغموت الدافئ'],
    heartNotes: ['العنبر الشرقي', 'الورد الدمشقي'],
    baseNotes: ['العود المعتّق', 'المسك الذهبي'],
    mood: 'توقيع شرقي مهيب للمجالس والمناسبات الرفيعة',
  },
  {
    id: 'legend-trio',
    arabicName: 'مجموعة الأساطير الثلاثية',
    latinName: 'TRIO COLLECTION',
    tagline: 'ثلاثة أساطير في طلب واحد: شمس · شام · قدر.',
    category: 'gift-set',
    categoryLabel: 'مجموعة هدايا',
    priceUsd: 129,
    volumeLabel: '3 × 50 ml · 150 ml',
    concentration: 'Eau de Parfum',
    accentColor: '#26265E',
    image:
      '/assets/trio.webp',
    cropClass: 'object-cover object-[50%_42%]',
    description:
      'المجموعة الكاملة التي تجمع أبرز ثلاثة إصدارات من دار :BELIND — انتعاش شام، إشراقة قدر، ودفء شمس — في تجربة متكاملة تغطي كل فصول السنة وتصلح للإهداء الفاخر.',
    topNotes: ['الليمون والتفاح الأخضر', 'المانجو والفلفل الوردي'],
    heartNotes: ['الياسمين', 'زهر الفانيليا', 'القرفة والكراميل'],
    baseNotes: ['العنبر', 'خشب العود', 'المسك والتونكا'],
    mood: 'اقتناء متكامل أو هدية ملكية تحمل توقيع :BELIND',
  },
];

export const CATEGORY_FILTERS: { id: FragranceCategory; label: string }[] = [
  { id: 'all', label: 'جميع العطور' },
  { id: 'fruity-amber', label: 'فواكه وعنبر' },
  { id: 'citrus-woody', label: 'حمضيات وأخشاب' },
  { id: 'warm-spice', label: 'توابل دافئة' },
  { id: 'oriental-luxury', label: 'شرقي فاخر' },
  { id: 'gift-set', label: 'مجموعة الأساطير' },
];

export const REGIONAL_CHANNELS: RegionalOrderChannel[] = [
  {
    id: 'turkey',
    region: 'للطلب داخل تركيا',
    countryNote: 'إسطنبول وجميع الولايات التركية',
    whatsappUrl: 'https://wa.me/905523980538',
    phoneDisplay: '+90 552 398 05 38',
    deliveryEta: '٢٤–٤٨ ساعة عمل',
  },
  {
    id: 'syria',
    region: 'للطلب داخل سوريا',
    countryNote: 'دمشق وحلب والمحافظات السورية',
    whatsappUrl: 'https://wa.me/963997440306',
    phoneDisplay: '+963 997 440 306',
    deliveryEta: '٢–٣ أيام عمل',
  },
  {
    id: 'europe',
    region: 'للطلب داخل أوروبا',
    countryNote: 'ألمانيا ودول الاتحاد الأوروبي',
    whatsappUrl: 'https://wa.me/4917688750972',
    phoneDisplay: '+49 176 8875 0972',
    deliveryEta: '٢–٤ أيام عمل',
  },
  {
    id: 'iraq',
    region: 'للطلب داخل العراق',
    countryNote: 'بغداد وأربيل وجميع المحافظات',
    whatsappUrl: 'https://wa.me/9647803988197',
    phoneDisplay: '+964 780 398 8197',
    deliveryEta: '٢–٣ أيام عمل',
  },
];
