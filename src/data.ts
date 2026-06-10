import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'nike-aj1-retro',
    name: 'Air Jordan 1 Retro High OG',
    brand: 'Nike',
    category: 'Basketball',
    price: 180,
    discountPrice: 165,
    rating: 4.9,
    reviewsCount: 142,
    description: 'Familiar but always fresh, the iconic Air Jordan 1 Retro High OG is remastered for today\'s sneakerhead culture. This premium edition features high-quality leather, comfortable Air-Sole cushioning, and classic design lines.',
    features: [
      'Genuine full-grain leather upper provides durability and premium structure.',
      'Encapsulated Air-Sole unit in the heel offer lightweight cushioning.',
      'Deep flex grooves on the solid rubber outsole support natural foot traction.',
      'Classic Wings logo on collar stamps authenticity.'
    ],
    images: [
      'bg-gradient-to-br from-red-600 to-black',
      'bg-gradient-to-br from-red-500 to-slate-900',
      'bg-gradient-to-br from-slate-100 to-red-600'
    ],
    colors: ['Bred Toe (Red/Black)', 'Royal Blue/White', 'Shadow Grey'],
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    stock: 12,
    gender: 'Unisex',
    releaseYear: 2024,
    reviews: [
      { id: 'r1', userName: 'JordanFan99', rating: 5, comment: 'Absolute masterpiece. The leather quality is premium and the colorway is stunning.', date: '2026-05-18' },
      { id: 'r2', userName: 'SneakerHead01', rating: 5, comment: 'TTS (True to size). Comfy enough for daily wear and stands out immediately.', date: '2026-06-01' },
      { id: 'r3', userName: 'MarkR', rating: 4, comment: 'Beautiful sneakers but quite stiff during the first 2-3 wears. Must break them in.', date: '2026-06-04' }
    ]
  },
  {
    id: 'adidas-ub-light',
    name: 'Ultraboost Light 23',
    brand: 'Adidas',
    category: 'Running',
    price: 190,
    discountPrice: 159,
    rating: 4.8,
    reviewsCount: 98,
    description: 'Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever. The magic lies in the Light BOOST midsole, a new generation of Adidas BOOST with 30% lighter material for maximum cushioning and responsiveness.',
    features: [
      'Lightweight PRIMEKNIT+ textile upper adapts to your foot shape.',
      '30% lighter BOOST midsole material offers incredible energy return.',
      'Continental™ Better Rubber outsole provides maximum grip in wet or dry conditions.',
      'Linear Energy Push system increases forefoot and midfoot stiffness.'
    ],
    images: [
      'bg-gradient-to-br from-neutral-200 to-amber-500',
      'bg-gradient-to-br from-slate-800 to-cyan-500',
      'bg-gradient-to-br from-emerald-500 to-slate-100'
    ],
    colors: ['Cloud White/Solar Red', 'Core Black', 'Signal Green'],
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
    stock: 18,
    gender: 'Men',
    releaseYear: 2025,
    reviews: [
      { id: 'r4', userName: 'RunnerCarl', rating: 5, comment: 'Unbelievably comfortable. Like walking on responsive clouds. Highly recommend for high-mileage runs.', date: '2026-04-20' },
      { id: 'r5', userName: 'SarahFit', rating: 4, comment: 'Extremely light! Fits snug like a sock, which is perfect for training.', date: '2026-05-11' }
    ]
  },
  {
    id: 'nb-9060-grey',
    name: 'New Balance 9060 Macadamia',
    brand: 'New Balance',
    category: 'Sneakers',
    price: 160,
    rating: 4.7,
    reviewsCount: 115,
    description: 'The New Balance 9060 is a new expression of the refined style and innovation-led design that has made the 99X series home to some of the most iconic models in NB history. It reinterprets familiar elements with a warped sensibility.',
    features: [
      'Mesh upper with pigskin suede overlays for retro-modern textures.',
      'Dual-density midsole featuring ABZORB and SBS cushioning.',
      'Tongue logo inspired by original 991 lace jewel details.',
      'Translucent CR device at heel and wavy outsole pattern.'
    ],
    images: [
      'bg-gradient-to-br from-[#dfdbd3] to-[#998b7a]',
      'bg-gradient-to-br from-slate-300 to-slate-900',
      'bg-gradient-to-br from-stone-400 to-[#ecebea]'
    ],
    colors: ['Rain Cloud (Grey)', 'Core Black', 'Castlerock'],
    sizes: [7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    stock: 8,
    gender: 'Unisex',
    releaseYear: 2024,
    reviews: [
      { id: 'r6', userName: 'HypeDoc', rating: 5, comment: 'The absolute king of bulky aesthetic. Super plush inside, looks great with wide cargo pants.', date: '2026-05-22' },
      { id: 'r7', userName: 'JennyK', rating: 4, comment: 'Chunky but surprisingly stable and lightweight. Love the custom earth tones.', date: '2026-05-30' }
    ]
  },
  {
    id: 'nike-vaporfly-3',
    name: 'ZoomX Vaporfly Next% 3',
    brand: 'Nike',
    category: 'Running',
    price: 260,
    discountPrice: 245,
    rating: 4.9,
    reviewsCount: 76,
    description: 'Catch \'em if you can. Built for the chase and engineered for race-day speed, the Nike ZoomX Vaporfly 3 gives you marathon-ready velocity to conquer any distance. A full-length carbon fiber flyplate unleashes responsive momentum.',
    features: [
      'Full-length carbon fiber Flyplate provides a stiff, propelling sensation.',
      'Nike ZoomX foam—our highest-returning foam—delivers lightweight spring.',
      'Constructed Flyknit upper provides targeted zones of superior breathability.',
      'Incredibly lightweight design optimized for setting personal records.'
    ],
    images: [
      'bg-gradient-to-br from-orange-500 to-pink-500',
      'bg-gradient-to-br from-emerald-400 to-blue-500',
      'bg-gradient-to-br from-yellow-300 to-teal-600'
    ],
    colors: ['Volt/Proto Pink', 'Electric Green', 'Triple White'],
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
    stock: 5,
    gender: 'Unisex',
    releaseYear: 2025,
    reviews: [
      { id: 'r8', userName: 'MarathonMan', rating: 5, comment: 'Shaved 4 minutes off my half-marathon PR. The propulsion factor is absolutely unparalleled.', date: '2026-03-12' },
      { id: 'r9', userName: 'PB_Chaser', rating: 5, comment: 'The spring is legendary. Feels like a trampoline under your feet and breathes incredibly well.', date: '2026-06-08' }
    ]
  },
  {
    id: 'asics-kayano-30',
    name: 'GEL-Kayano 30 Platinum',
    brand: 'Asics',
    category: 'Training',
    price: 170,
    rating: 4.8,
    reviewsCount: 210,
    description: 'From 5Ks to full marathons, the GEL-KAYANO 30 shoe is designed to provide advanced stability and softer cushioning properties. The new 4D GUIDANCE SYSTEM helps supply adaptive stability during your standard gait cycle.',
    features: [
      '4D GUIDANCE SYSTEM adaptive design restores running symmetry.',
      'Rearfoot PureGEL technology increases impact absorption.',
      'FF BLAST PLUS ECO offers ultra-plush cushioning with 20% bio-based content.',
      'OrthoLite X-55 sockliner offers superb step-in moisture management.'
    ],
    images: [
      'bg-gradient-to-br from-slate-400 to-blue-600',
      'bg-gradient-to-br from-[#ffd700] to-neutral-900',
      'bg-gradient-to-br from-slate-100 to-[#1a3a6c]'
    ],
    colors: ['Carrier Grey/White', 'Black/Electric Blue', 'Platinum Silver'],
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
    stock: 15,
    gender: 'Men',
    releaseYear: 2024,
    reviews: [
      { id: 'r10', userName: 'StabilityKing', rating: 5, comment: 'My overpronation is completely cured. Best version Asics has put out in ten years. Durable!', date: '2026-04-10' },
      { id: 'r11', userName: 'DocJohn', rating: 4, comment: 'Excellent heel lock and fantastic support for physical fitness training.', date: '2026-05-15' }
    ]
  },
  {
    id: 'puma-rs-x3',
    name: 'RS-X 3D Evolution',
    brand: 'Puma',
    category: 'Sneakers',
    price: 120,
    discountPrice: 99,
    rating: 4.6,
    reviewsCount: 84,
    description: 'PUMA\'s RS-X returns with a chunky look, angular detailing, and suede/leather overlays. The RS-X 3D is all about bulky futuristic self-expression, blending 80s Running System cushioning with modern high-color contrasts.',
    features: [
      'Mesh upper with premium synthetic and leather layers.',
      'Running System (RS) retro cushioning technology for comfort.',
      'Thick, chunky PU midsole supports robust footing.',
      'Aggressive rubber tread outsole provides grip.'
    ],
    images: [
      'bg-gradient-to-br from-[#1a3038] to-[#ff4c00]',
      'bg-gradient-to-br from-[#f15c22] to-amber-300',
      'bg-gradient-to-br from-[#504a44] to-[#c7882d]'
    ],
    colors: ['Sunset Multi-color', 'Glaze Green', 'Vapor Grey/Cyan'],
    sizes: [7, 8, 9, 9.5, 10, 10.5, 11, 12],
    stock: 14,
    gender: 'Unisex',
    releaseYear: 2024,
    reviews: [
      { id: 'r12', userName: 'PumaPrez', rating: 5, comment: 'Fierce style. The colors are popping live! Super spongy midsole.', date: '2026-05-02' },
      { id: 'r13', userName: 'Dan_B', rating: 4, comment: 'A bit heavy on the heels, but makes up for it in streetstyle credits. Excellent value with discount.', date: '2026-05-25' }
    ]
  },
  {
    id: 'reebok-club-c',
    name: 'Club C 85 Vintage',
    brand: 'Reebok',
    category: 'Sneakers',
    price: 90,
    rating: 4.6,
    reviewsCount: 312,
    description: 'An ultimate icon born on the tennis courts. The Reebok Club C 85 Vintage is made of premium chalk-colored garment leather. It represents the peak clean retro minimalist footwear, ideal for any outfit.',
    features: [
      'Garment leather upper is incredibly soft and comfortable on feet.',
      'Classic woven Reebok label with Union Jack flag emblem.',
      'Molded foam sockliner adds comfort and impact protection.',
      'Low-cut design supports free range of motion on ankles.'
    ],
    images: [
      'bg-gradient-to-br from-[#f5f2eb] to-[#228b22]',
      'bg-gradient-to-br from-[#efebe4] to-blue-800',
      'bg-gradient-to-br from-[#ffffff] to-slate-400'
    ],
    colors: ['Chalk/Glen Green', 'Chalk/Royal Blue', 'True Alabaster'],
    sizes: [6, 7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    stock: 25,
    gender: 'Unisex',
    releaseYear: 2023,
    reviews: [
      { id: 'r14', userName: 'VintageVibes', rating: 5, comment: 'Absolute staple shoe. Matches with absolutely everything. Sits beautifully on shorts, jeans, or chinos.', date: '2026-04-01' },
      { id: 'r15', userName: 'TenniSensation', rating: 5, comment: 'Supple leather. Retro off-white color is perfect, not too bright.', date: '2026-06-03' }
    ]
  },
  {
    id: 'puma-deviate-nitro',
    name: 'Deviate Nitro Elite 2',
    brand: 'Puma',
    category: 'Running',
    price: 200,
    discountPrice: 175,
    rating: 4.8,
    reviewsCount: 45,
    description: 'The Deviate NITRO Elite 2 is a running shoe redefined for supreme speed. Propelled by premium carbon fiber PWRPLATE and nitrogen-infused NITRO Elite foam, it matches race day energy with top tier grip.',
    features: [
      'NITRO Elite premium nitrogen-infused foam creates lightweight snap.',
      'PWRPLATE spoon-shaped carbon fiber plate for propulsive kinetic energy.',
      'PUMAGRIP lightweight high-traction durable compound outsole.',
      'Featherlight mono-mesh upper enhances ventilation.'
    ],
    images: [
      'bg-gradient-to-br from-indigo-600 to-rose-400',
      'bg-gradient-to-br from-[#e0115f] to-[#ffb347]',
      'bg-gradient-to-br from-[#8a2be2] to-teal-400'
    ],
    colors: ['Fireglow Orange', 'White/Royal Purple', 'Carbon Black'],
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    stock: 6,
    gender: 'Men',
    releaseYear: 2025,
    reviews: [
      { id: 'r16', userName: 'TempoKing', rating: 5, comment: 'Incredible speed shoe, way more stable than the Vaporfly in sharp turns.', date: '2026-05-14' }
    ]
  },
  {
    id: 'nike-air-max-90',
    name: 'Air Max 90 Terrascape',
    brand: 'Nike',
    category: 'Outdoor',
    price: 140,
    rating: 4.7,
    reviewsCount: 168,
    description: 'Think about the classic, then elevate it. The Air Max 90 Terrascape incorporates sustainable recycled materials with outdoor tech. A durable Crater foam translucent cupsole adds robust utility.',
    features: [
      'Made from at least 20% recycled content by weight.',
      'Crater Foam midsole adds lightweight security with unique speckles.',
      'Classic visible Air cushioning in the heel protects from impacts.',
      'Triple-stitched collar and ripstop detailing resist wear.'
    ],
    images: [
      'bg-gradient-to-br from-[#556b2f] to-[#2f4f4f]',
      'bg-gradient-to-br from-slate-200 to-[#e28743]',
      'bg-gradient-to-br from-indigo-950 to-neutral-400'
    ],
    colors: ['Olive/Lime Green', 'Fuel Orange/Grey', 'Obsidian Black'],
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    stock: 9,
    gender: 'Men',
    releaseYear: 2024,
    reviews: [
      { id: 'r17', userName: 'TrailGlazer', rating: 5, comment: 'Super rugged. Great hybrid of Air Max comfort and trail durability. Recycled touches look very futuristic.', date: '2026-05-09' }
    ]
  },
  {
    id: 'nb-550-retro',
    name: 'New Balance 550 White/Green',
    brand: 'New Balance',
    category: 'Basketball',
    price: 120,
    discountPrice: 110,
    rating: 4.7,
    reviewsCount: 220,
    description: 'Simple & clean, not overdesigned. The original 550 debuted in 1989 and left its mark on basketball courts from coast to coast. Now restored to celebrate 90s retro streetwear fashion.',
    features: [
      'Premium leather, synthetic, and mesh upper construction.',
      'Retro athletic low-top design with lace closure.',
      'Rubber cupsole for outstanding court traction and durability.',
      'Accent colored padded lining provides daily comfort.'
    ],
    images: [
      'bg-gradient-to-br from-white to-[#006400]',
      'bg-gradient-to-br from-white to-red-600',
      'bg-gradient-to-br from-white to-neutral-800'
    ],
    colors: ['Chalk White/Kelly Green', 'White/Crimson Red', 'White/Avenue Black'],
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    stock: 15,
    gender: 'Unisex',
    releaseYear: 2024,
    reviews: [
      { id: 'r18', userName: 'RetroCourt', rating: 5, comment: 'Best sneaker silhouette of the decade. Suede detailing on the toe tip is fantastic.', date: '2026-05-30' }
    ]
  }
];

export const SPECIAL_OFFERS = [
  {
    id: 'off-1',
    code: 'SNEAKERHUB20',
    title: 'Summer Sneaker Fest',
    discount: '20% OFF',
    desc: 'Use coupon matching premium sneakers, lifestyle & trail runners.',
    active: true
  },
  {
    id: 'off-2',
    code: 'AIRGROUND',
    title: 'Marathon Velocity Promo',
    discount: '$30 USD OFF',
    desc: 'Exclusive discount for race runners on carbon plated Nike and Puma footwear.',
    active: true
  }
];
